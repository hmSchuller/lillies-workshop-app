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

    // Wire the Swift picker's user-interaction callback to the Fabric event emitter.
    // Capture self weakly to avoid a retain cycle between the shell and the Swift view.
    __weak RNDatePickerFabricView *weakSelf = self;
    _pickerView.onChange = ^(NSString *isoString) {
      [weakSelf handlePickerChange:isoString];
    };
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
  const auto &oldDatePickerProps = static_cast<const NativeDatePickerViewProps &>(*_props);
  const auto &newDatePickerProps = static_cast<const NativeDatePickerViewProps &>(*props);

  // Apply mode before bounds/date so that UIDatePicker interprets ranges correctly.
  if (oldDatePickerProps.mode != newDatePickerProps.mode) {
    [_pickerView setPickerMode:RNDPModeString(newDatePickerProps.mode)];
  }

  // Bounds first — the Swift setters clamp the current picker date to the new
  // range immediately, matching the behaviour of the original integration code.
  if (oldDatePickerProps.minimumDate != newDatePickerProps.minimumDate) {
    NSString *minDate = newDatePickerProps.minimumDate.empty()
        ? nil
        : @(newDatePickerProps.minimumDate.c_str());
    [_pickerView setMinimumDateISO:minDate];
  }

  if (oldDatePickerProps.maximumDate != newDatePickerProps.maximumDate) {
    NSString *maxDate = newDatePickerProps.maximumDate.empty()
        ? nil
        : @(newDatePickerProps.maximumDate.c_str());
    [_pickerView setMaximumDateISO:maxDate];
  }

  if (oldDatePickerProps.accentColor != newDatePickerProps.accentColor) {
    UIColor *color = RCTUIColorFromSharedColor(newDatePickerProps.accentColor);
    [_pickerView setPickerAccentColor:color];
  }

  // Apply the date value last so clamping against the already-updated bounds is correct.
  if (oldDatePickerProps.date != newDatePickerProps.date) {
    if (!newDatePickerProps.date.empty()) {
      [_pickerView setDateISO:@(newDatePickerProps.date.c_str())];
    }
  }

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
