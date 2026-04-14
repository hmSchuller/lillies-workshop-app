@import AVFoundation;
#import <UIKit/UIKit.h>
#import "QRCameraViewController.h"

@interface QRCameraViewController () <AVCaptureMetadataOutputObjectsDelegate>

@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong) AVCaptureVideoPreviewLayer *previewLayer;
/// Guards against calling the delegate more than once per presentation.
@property (nonatomic, assign) BOOL didScan;

@end

@implementation QRCameraViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = UIColor.blackColor;
    [self setupCaptureSession];
}

- (void)setupCaptureSession {
    self.captureSession = [[AVCaptureSession alloc] init];

    AVCaptureDevice *videoCaptureDevice =
        [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if (!videoCaptureDevice) {
        NSLog(@"QRCameraViewController: no video capture device available");
        return;
    }

    NSError *error = nil;
    AVCaptureDeviceInput *videoInput =
        [AVCaptureDeviceInput deviceInputWithDevice:videoCaptureDevice error:&error];
    if (error || !videoInput) {
        NSLog(@"QRCameraViewController: could not create video input: %@", error);
        return;
    }

    if ([self.captureSession canAddInput:videoInput]) {
        [self.captureSession addInput:videoInput];
    } else {
        NSLog(@"QRCameraViewController: could not add video input to session");
        return;
    }

    AVCaptureMetadataOutput *metadataOutput = [[AVCaptureMetadataOutput alloc] init];
    if ([self.captureSession canAddOutput:metadataOutput]) {
        [self.captureSession addOutput:metadataOutput];
        // Deliver callbacks on the main queue — AVFoundation fires them on a private
        // serial queue by default, but UIKit must only be driven from the main thread.
        [metadataOutput setMetadataObjectsDelegate:self
                                             queue:dispatch_get_main_queue()];
        metadataOutput.metadataObjectTypes = @[AVMetadataObjectTypeQRCode];
    } else {
        NSLog(@"QRCameraViewController: could not add metadata output to session");
        return;
    }

    // Full-screen preview layer
    self.previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:self.captureSession];
    self.previewLayer.frame = self.view.layer.bounds;
    self.previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.view.layer addSublayer:self.previewLayer];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.didScan = NO;
    if (self.captureSession && !self.captureSession.isRunning) {
        // Start on a background thread to avoid blocking the main thread
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [self.captureSession startRunning];
        });
    }
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    if (self.captureSession && self.captureSession.isRunning) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [self.captureSession stopRunning];
        });
    }
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    self.previewLayer.frame = self.view.layer.bounds;
}

#pragma mark - AVCaptureMetadataOutputObjectsDelegate

/// This delegate method is delivered on the main queue (as configured above).
/// We stop the session immediately after the first scan to prevent repeated callbacks.
- (void)captureOutput:(AVCaptureOutput *)output
didOutputMetadataObjects:(NSArray<__kindof AVMetadataObject *> *)metadataObjects
       fromConnection:(AVCaptureConnection *)connection {

    // Guard against multiple rapid callbacks before stopRunning takes effect
    if (self.didScan) {
        return;
    }

    for (AVMetadataObject *metadataObject in metadataObjects) {
        if (![metadataObject isKindOfClass:[AVMetadataMachineReadableCodeObject class]]) {
            continue;
        }

        AVMetadataMachineReadableCodeObject *readableObject =
            (AVMetadataMachineReadableCodeObject *)metadataObject;
        NSString *stringValue = readableObject.stringValue;
        if (!stringValue) {
            continue;
        }

        // Mark as scanned before stopping to prevent any race condition
        self.didScan = YES;

        // Stop the session on a background thread — stopRunning is synchronous
        // and can block. We don't need the session anymore after one scan.
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [self.captureSession stopRunning];
        });

        // Notify the delegate — we are already on the main queue here (set above),
        // but wrap in dispatch_async to keep the call non-reentrant and consistent
        // with the documented threading contract.
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.delegate qrCameraViewController:self didScanCode:stringValue];
        });

        return; // Process only the first valid QR code per callback batch
    }
}

@end
