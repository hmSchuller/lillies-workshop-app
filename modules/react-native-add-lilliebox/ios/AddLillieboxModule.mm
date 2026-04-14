#import "AddLillieboxModule.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTTurboModule.h>
#import <UIKit/UIKit.h>
#import "RNAddLilliebox-Swift.h"
#import "RNAddLillieboxSpec.h"

using namespace facebook::react;

@interface NativeAddLillieboxModule () <RCTTurboModule, NativeAddLillieboxModuleSpec>
@end

@implementation NativeAddLillieboxModule {
  BOOL _isPresenting;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (std::shared_ptr<TurboModule>)getTurboModule:(const ObjCTurboModule::InitParams &)params
{
  return std::make_shared<NativeAddLillieboxModuleSpecJSI>(params);
}

- (void)launchAddLilliebox:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  if (self->_isPresenting) {
    reject(@"E_LILLIEBOX_IN_PROGRESS", @"The Add Lilliebox flow is already open.", nil);
    return;
  }

  UIViewController *topVC = RCTPresentedViewController();
  if (topVC == nil) {
    reject(@"E_NO_VIEW_CONTROLLER", @"Could not find a top view controller to present on.", nil);
    return;
  }

  self->_isPresenting = YES;

  __block __weak UIViewController *weakHostingController = nil;
  AddLillieboxFlowFactory *factory = [AddLillieboxFlowFactory new];
  UIViewController *hostingController = [factory makeHostingControllerWithOnComplete:^(NSDictionary *result) {
    dispatch_async(dispatch_get_main_queue(), ^{
      self->_isPresenting = NO;
      UIViewController *vc = weakHostingController;
      if (vc) {
          [vc dismissViewControllerAnimated:YES completion:^{
              resolve(result);
          }];
      } else {
          // VC already dismissed by the system — resolve immediately
          resolve(result);
      }
    });
  }];
  weakHostingController = hostingController;

  [topVC presentViewController:hostingController animated:YES completion:nil];
}

@end

Class _Nonnull NativeAddLillieboxModuleCls(void)
{
  return NativeAddLillieboxModule.class;
}
