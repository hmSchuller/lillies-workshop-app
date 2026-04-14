#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class QRCameraViewController;

/// Delegate protocol for QRCameraViewController.
/// The delegate method is always called on the main thread.
@protocol QRCameraViewControllerDelegate <NSObject>

/// Called exactly once — after the first successful QR scan. The session is
/// stopped before this callback fires, so this is never called twice.
- (void)qrCameraViewController:(QRCameraViewController *)vc
                   didScanCode:(NSString *)code;

@end


/// A UIViewController that presents a full-screen AVFoundation QR-code scanner.
/// After the first successful scan it stops the capture session and notifies
/// its delegate on the main thread.
@interface QRCameraViewController : UIViewController

/// The delegate that receives the scanned QR code.
/// MUST be weak to prevent a retain cycle: the Coordinator (UIViewControllerRepresentable)
/// holds a strong reference to this VC while simultaneously acting as its delegate.
@property (nonatomic, weak, nullable) id<QRCameraViewControllerDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
