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
  // TODO (Level 2 iOS): Native owns the flow presentation.
  //
  // Suggested implementation steps:
  //  1) Guard re-entry with _isPresenting
  //  2) Read top presented VC via RCTPresentedViewController()
  //  3) Build the Swift flow VC using AddLillieboxFlowFactory
  //  4) Present it modally
  //  5) On completion, dismiss and resolve the JS promise with NSDictionary result
  
  reject(@"E_NOT_IMPLEMENTED", @"AddLilliebox iOS flow not implemented in exercise stub.", nil);
}

@end

Class _Nonnull NativeAddLillieboxModuleCls(void)
{
  return NativeAddLillieboxModule.class;
}
