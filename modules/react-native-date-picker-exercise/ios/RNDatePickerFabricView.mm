#import "RNDatePickerFabricView.h"
#import "RNDatePickerFabric-Swift.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/RNDatePickerExerciseSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNDatePickerExerciseSpec/EventEmitters.h>
#import <react/renderer/components/RNDatePickerExerciseSpec/Props.h>
#import <react/renderer/components/RNDatePickerExerciseSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

/// Maps the Codegen mode enum to the string representation expected by RNDatePickerView.
static NSString *RNDPModeString(NativeDatePickerViewMode mode)
{
  switch (mode) {
    case NativeDatePickerViewMode::Time:
      return @"time";
    case NativeDatePickerViewMode::Datetime:
      return @"datetime";
    case NativeDatePickerViewMode::Date:
      return @"date";
  }
  return @"date";
}

@interface RNDatePickerFabricView () <RCTNativeDatePickerViewViewProtocol>
@end

@implementation RNDatePickerFabricView {
  /// Swift UIView subclass that owns all UIDatePicker logic.
  RNDatePickerView *_pickerView;
}

// MARK: - Fabric registration

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativeDatePickerViewComponentDescriptor>();
}

// MARK: - Lifecycle

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _props = NativeDatePickerViewShadowNode::defaultSharedProps();

    _pickerView = [[RNDatePickerView alloc] initWithFrame:self.bounds];
    self.contentView = _pickerView;

    // TODO (Level 2 iOS): Wire _pickerView.onChange to emit a Fabric onChange event back to JS.
    //
    // The block receives an ISO date string from the Swift view.
    // Use a weak reference to avoid a retain cycle, then call [weakSelf handlePickerChange:isoString].
  }

  return self;
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  [_pickerView resetForRecycle];
}

// MARK: - Props

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  // TODO (Level 2 iOS): Apply changed props to _pickerView.
  //
  // 1. Cast both `props` and `oldProps` to NativeDatePickerViewProps:
  //      const auto &oldP = static_cast<const NativeDatePickerViewProps &>(*_props);
  //      const auto &newP = static_cast<const NativeDatePickerViewProps &>(*props);
  //
  // 2. For each prop, only call the setter when the value has actually changed (compare old vs new).
  //    Apply in this order so clamping works correctly:
  //
  //    a) mode         → [_pickerView setPickerMode: RNDPModeString(newP.mode)]
  //    b) minimumDate  → [_pickerView setMinimumDateISO: ...]   pass nil when newP.minimumDate is empty
  //    c) maximumDate  → [_pickerView setMaximumDateISO: ...]   pass nil when newP.maximumDate is empty
  //    d) accentColor  → [_pickerView setPickerAccentColor: RCTUIColorFromSharedColor(newP.accentColor)]
  //    e) date         → [_pickerView setDateISO: @(newP.date.c_str())]  only when non-empty
  //
  // 3. Call [super updateProps:props oldProps:oldProps] at the end.
  [super updateProps:props oldProps:oldProps];
}

// MARK: - Private

/// Receives the user-selected ISO date string from the Swift view and emits the
/// Fabric bubbling event back to JS.
- (void)handlePickerChange:(NSString *)isoString
{
  if (!_eventEmitter) {
    return;
  }

  auto eventEmitter = std::dynamic_pointer_cast<const NativeDatePickerViewEventEmitter>(_eventEmitter);
  if (!eventEmitter) {
    return;
  }

  eventEmitter->onChange({.date = std::string([isoString UTF8String])});
}

@end
