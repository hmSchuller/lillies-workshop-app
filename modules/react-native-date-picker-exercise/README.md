# Exercise: Fabric Date Picker

Build a cross-platform date picker as a **Fabric Native Component**.

Starter stubs are provided for every layer.
You should implement the exercise in order: **spec → codegen → wiring → native UI**.

---

## What's provided

| File | Purpose | Status |
|------|---------|--------|
| `spec/NativeDatePickerViewNativeComponent.ts` | Codegen spec starter (you complete it) | 🧩 Stub |
| `js/DatePickerExample.tsx` | Example screen that uses the `<DatePicker>` wrapper | ✅ Complete |
| `ios/RNDatePickerFabricView.h` | Header for the ObjC++ Fabric shell | ✅ Complete |
| `ios/RNDatePickerViewProtocol.h` | ObjC protocol the Swift view conforms to | ✅ Complete |
| `ios/RNDatePickerFabricViewProvider.mm` | Registers the component with Fabric | ✅ Complete |
| `android/.../RNDatePickerPackage.kt` | Registers the ViewManager with RN | ✅ Complete |
| `RNDatePickerFabric.podspec` | iOS pod spec | ✅ Complete |
| `package.json` | Module package with `codegenConfig` | ✅ Complete |

## What you need to implement

| Level | File | What to do |
|-------|------|------------|
| **0 — Spec + Codegen** | `spec/NativeDatePickerViewNativeComponent.ts` | Define native props/events and run codegen |
| **1 — JS wiring** | `js/DatePicker.tsx` | Bridge the JS Date API to native ISO strings |
| **2 — Native bridge** | `ios/RNDatePickerFabricView.mm` | Wire Fabric props → Swift view (+ onChange → JS) |
| | `android/.../RNDatePickerManager.kt` | Wire `@ReactProp` setters to the view |
| **3 — Native UI** | `ios/RNDatePickerView.swift` | Implement the `@objc` setters on `UIDatePicker` |
| | `android/.../DatePickerButton.kt` | Implement setters + picker dialog logic |

> **Choose your own adventure:**
> - Start at **Level 0** if you want the complete experience (spec + codegen included).
> - Start at **Level 1** if you want to skip spec setup and focus on JS → native wiring.
> - Continue to **Level 2/3** if you want to implement native bridge + UI internals.

---

## Architecture overview

```
┌──────────────────────────────────────────────────────────┐
│  JS                                                      │
│                                                          │
│  DatePicker.tsx  ──→  NativeDatePickerViewNativeComponent│
│  (Date → ISO)        (Codegen spec)                      │
└────────────────────────────┬─────────────────────────────┘
                             │  Fabric bridge
         ┌───────────────────┴────────────────────┐
         │                                        │
   ┌─────▼──────────┐                   ┌─────────▼────────┐
   │ iOS             │                   │ Android          │
   │                 │                   │                  │
   │ FabricView.mm   │                   │ RNDatePicker-    │
   │ (props→Swift)   │                   │ Manager.kt       │
   │       │         │                   │ (props→View)     │
   │       ▼         │                   │       │          │
   │ RNDatePicker-   │                   │       ▼          │
   │ View.swift      │                   │ DatePicker-      │
   │ (UIDatePicker)  │                   │ Button.kt        │
   │                 │                   │ (MaterialPicker) │
   └─────────────────┘                   └──────────────────┘
```

---

## References

### React Native New Architecture — Fabric Native Components

| Topic | Link |
|---|---|
| New Architecture overview | https://reactnative.dev/docs/the-new-architecture/landing-page |
| Fabric Native Components — full guide | https://reactnative.dev/docs/fabric-native-components-introduction |
| Codegen — TypeScript spec format | https://reactnative.dev/docs/the-new-architecture/what-is-codegen |
| Running Codegen manually | https://reactnative.dev/docs/the-new-architecture/using-codegen |

### JS layer

| Topic | Link |
|---|---|
| `Date.toISOString()` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString |
| React Native `ViewProps` | https://reactnative.dev/docs/view#props |

### iOS

| Topic | Link |
|---|---|
| Fabric Native Components — iOS implementation guide | https://reactnative.dev/docs/fabric-native-components-ios |
| `UIDatePicker` | https://developer.apple.com/documentation/uikit/uidatepicker |
| `UIDatePicker.datePickerMode` | https://developer.apple.com/documentation/uikit/uidatepicker/1615997-datepickermode |
| `UIDatePicker.addTarget(_:action:for:)` — value changed event | https://developer.apple.com/documentation/uikit/uicontrol/1618259-addtarget |
| `ISO8601DateFormatter` | https://developer.apple.com/documentation/foundation/iso8601dateformatter |

### Android

| Topic | Link |
|---|---|
| Fabric Native Components — Android implementation guide | https://reactnative.dev/docs/fabric-native-components-android |
| `SimpleViewManager` / `ViewManagerDelegate` | https://reactnative.dev/docs/fabric-native-components-android |
| `DatePickerDialog` | https://developer.android.com/reference/android/app/DatePickerDialog |
| `TimePickerDialog` | https://developer.android.com/reference/android/app/TimePickerDialog |
| Material `MaterialDatePicker` (bonus) | https://developer.android.com/reference/com/google/android/material/datepicker/MaterialDatePicker |

---

## Level 0 — Spec + Codegen (`spec/NativeDatePickerViewNativeComponent.ts`)

### 🟢 Hint 1: What to define in the spec

In the Codegen spec you need:

- A `DatePickerMode` union: `'date' | 'time' | 'datetime'`
- A change event payload: `{ date: string }`
- Native props:
  - `date: string` (required)
  - `minimumDate?: string`
  - `maximumDate?: string`
  - `mode?: WithDefault<DatePickerMode, 'date'>`
  - `accentColor?: ColorValue`
  - `onChange?: BubblingEventHandler<...> | null`

### 🟡 Hint 2: Run codegen after editing the spec

From project root:

```sh
npx react-native codegen --platform all
```

Then regenerate iOS integration:

```sh
cd ios && pod install && cd ..
```

### 🔴 Hint 3: Full solution

<details>
<summary>Click to reveal — <code>spec/NativeDatePickerViewNativeComponent.ts</code></summary>

```ts
import type {ColorValue, HostComponent, ViewProps} from 'react-native';
import type {
  BubblingEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type DatePickerMode = 'date' | 'time' | 'datetime';

export type DatePickerChangeEvent = Readonly<{
  date: string;
}>;

export interface NativeProps extends ViewProps {
  date: string;
  minimumDate?: string;
  maximumDate?: string;
  mode?: WithDefault<DatePickerMode, 'date'>;
  accentColor?: ColorValue;
  onChange?: BubblingEventHandler<DatePickerChangeEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'NativeDatePickerView',
) as HostComponent<NativeProps>;
```

</details>

---

## Level 1 — JS wiring (`DatePicker.tsx`)

### 🟢 Hint 1: What the component needs to do

The `<DatePicker>` wrapper converts between a developer-friendly React API (`Date` objects, typed callbacks) and the raw native component API (`ISO string` props, `NativeSyntheticEvent`).

Three things to do:
1. Import the Codegen-generated native component
2. Convert `Date` props → ISO strings before passing them down
3. Parse the `onChange` native event's ISO string back into a `Date`

### 🟡 Hint 2: The event handler

```tsx
import type {NativeSyntheticEvent} from 'react-native';

type DatePickerChangeEvent = NativeSyntheticEvent<{
  date: string;
}>;

const handleChange = React.useCallback(
  (event: DatePickerChangeEvent) => {
    const nextDate = new Date(event.nativeEvent.date);
    // Guard: what if the string is garbage?
    if (Number.isNaN(nextDate.getTime())) return;
    onChange?.(nextDate);
  },
  [onChange],
);
```

### 🔴 Hint 3: Full solution

<details>
<summary>Click to reveal — <code>js/DatePicker.tsx</code></summary>

```tsx
import * as React from 'react';
import type {ColorValue, NativeSyntheticEvent, ViewProps} from 'react-native';

import NativeDatePickerView from '../spec/NativeDatePickerViewNativeComponent';

export type DatePickerMode = 'date' | 'time' | 'datetime';

type DatePickerChangeEvent = NativeSyntheticEvent<{
  date: string;
}>;

export interface DatePickerProps extends Omit<ViewProps, 'onChange'> {
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: DatePickerMode;
  accentColor?: ColorValue;
  onChange?: (date: Date) => void;
}

function toIsoString(value?: Date): string | undefined {
  return value?.toISOString();
}

export default function DatePicker({
  value,
  minimumDate,
  maximumDate,
  mode = 'date',
  accentColor,
  onChange,
  ...viewProps
}: DatePickerProps): React.JSX.Element {
  const handleChange = React.useCallback(
    (event: DatePickerChangeEvent) => {
      const nextDate = new Date(event.nativeEvent.date);

      if (Number.isNaN(nextDate.getTime())) {
        return;
      }

      onChange?.(nextDate);
    },
    [onChange],
  );

  return (
    <NativeDatePickerView
      {...viewProps}
      date={value.toISOString()}
      minimumDate={toIsoString(minimumDate)}
      maximumDate={toIsoString(maximumDate)}
      mode={mode}
      accentColor={accentColor}
      onChange={handleChange}
    />
  );
}
```

</details>

---

## Level 2 — iOS: Fabric shell (`RNDatePickerFabricView.mm`)

### 🟢 Hint 1: What `updateProps` does

This is the standard Fabric pattern: compare old vs new props, call the Swift view's setters only when a value changed. Order matters — set mode and bounds before the date so clamping works.

### 🟡 Hint 2: The onChange wiring

In `initWithFrame:`, after creating `_pickerView`, set its `onChange` block:

```objc
__weak RNDatePickerFabricView *weakSelf = self;
_pickerView.onChange = ^(NSString *isoString) {
  [weakSelf handlePickerChange:isoString];
};
```

### 🟡 Hint 3: One prop as an example

```objc
if (oldDatePickerProps.mode != newDatePickerProps.mode) {
  [_pickerView setPickerMode:RNDPModeString(newDatePickerProps.mode)];
}
```

For string props like `minimumDate`, convert `std::string` → `NSString *`:
```objc
NSString *minDate = newDatePickerProps.minimumDate.empty()
    ? nil
    : @(newDatePickerProps.minimumDate.c_str());
[_pickerView setMinimumDateISO:minDate];
```

For `accentColor`, use the RCT helper:
```objc
UIColor *color = RCTUIColorFromSharedColor(newDatePickerProps.accentColor);
[_pickerView setPickerAccentColor:color];
```

### 🔴 Hint 4: Full solution

<details>
<summary>Click to reveal — <code>ios/RNDatePickerFabricView.mm</code></summary>

```objc
#import "RNDatePickerFabricView.h"
#import "RNDatePickerFabric-Swift.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/RNDatePickerExerciseSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNDatePickerExerciseSpec/EventEmitters.h>
#import <react/renderer/components/RNDatePickerExerciseSpec/Props.h>
#import <react/renderer/components/RNDatePickerExerciseSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

static NSString *RNDPModeString(NativeDatePickerViewMode mode)
{
  switch (mode) {
    case NativeDatePickerViewMode::Time:     return @"time";
    case NativeDatePickerViewMode::Datetime: return @"datetime";
    case NativeDatePickerViewMode::Date:     return @"date";
  }
  return @"date";
}

@interface RNDatePickerFabricView () <RCTNativeDatePickerViewViewProtocol>
@end

@implementation RNDatePickerFabricView {
  RNDatePickerView *_pickerView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativeDatePickerViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _props = NativeDatePickerViewShadowNode::defaultSharedProps();

    _pickerView = [[RNDatePickerView alloc] initWithFrame:self.bounds];
    self.contentView = _pickerView;

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

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &oldDatePickerProps = static_cast<const NativeDatePickerViewProps &>(*_props);
  const auto &newDatePickerProps = static_cast<const NativeDatePickerViewProps &>(*props);

  if (oldDatePickerProps.mode != newDatePickerProps.mode) {
    [_pickerView setPickerMode:RNDPModeString(newDatePickerProps.mode)];
  }

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

  if (oldDatePickerProps.date != newDatePickerProps.date) {
    if (!newDatePickerProps.date.empty()) {
      [_pickerView setDateISO:@(newDatePickerProps.date.c_str())];
    }
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)handlePickerChange:(NSString *)isoString
{
  if (!_eventEmitter) return;

  auto eventEmitter = std::dynamic_pointer_cast<const NativeDatePickerViewEventEmitter>(_eventEmitter);
  if (!eventEmitter) return;

  eventEmitter->onChange({.date = std::string([isoString UTF8String])});
}

@end
```

</details>

---

## Level 2 — Android: ViewManager (`RNDatePickerManager.kt`)

### 🟢 Hint 1: What each `@ReactProp` method does

Each method receives a raw prop value (String or Int) from JS, parses it, and forwards it to the `DatePickerButton` view. The `parseInstant` helper in the companion object is already provided.

### 🟡 Hint 2: The date setter pattern

```kotlin
@ReactProp(name = "date")
override fun setDate(view: DatePickerButton, date: String?) {
  view.setDate(parseInstant(date) ?: Instant.now())
}
```

The other string props follow the same pattern but pass `null` when the string is null.

### 🔴 Hint 3: Full solution

<details>
<summary>Click to reveal — <code>android/.../RNDatePickerManager.kt</code></summary>

```kotlin
package com.datepickerexercise

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeDatePickerViewManagerDelegate
import com.facebook.react.viewmanagers.NativeDatePickerViewManagerInterface
import java.time.Instant

@ReactModule(name = RNDatePickerManager.REACT_CLASS)
class RNDatePickerManager :
    SimpleViewManager<DatePickerButton>(),
    NativeDatePickerViewManagerInterface<DatePickerButton> {

  private val delegate: ViewManagerDelegate<DatePickerButton> =
      NativeDatePickerViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<DatePickerButton> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(context: ThemedReactContext): DatePickerButton =
      DatePickerButton(context)

  @ReactProp(name = "date")
  override fun setDate(view: DatePickerButton, date: String?) {
    view.setDate(parseInstant(date) ?: Instant.now())
  }

  @ReactProp(name = "minimumDate")
  override fun setMinimumDate(view: DatePickerButton, minimumDate: String?) {
    view.setMinimumDate(parseInstant(minimumDate))
  }

  @ReactProp(name = "maximumDate")
  override fun setMaximumDate(view: DatePickerButton, maximumDate: String?) {
    view.setMaximumDate(parseInstant(maximumDate))
  }

  @ReactProp(name = "mode")
  override fun setMode(view: DatePickerButton, mode: String?) {
    view.setMode(DatePickerButton.PickerMode.fromProp(mode))
  }

  @ReactProp(name = "accentColor", customType = "Color")
  override fun setAccentColor(view: DatePickerButton, accentColor: Int?) {
    view.setAccentColor(accentColor)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> =
      mapOf(
          "onChange" to
              mapOf(
                  "phasedRegistrationNames" to
                      mapOf(
                          "bubbled" to "onChange",
                          "captured" to "onChangeCapture",
                      ),
              ),
      )

  companion object {
    const val REACT_CLASS = "NativeDatePickerView"

    private fun parseInstant(value: String?): Instant? =
        value?.let { runCatching { Instant.parse(it) }.getOrNull() }
  }
}
```

</details>

---

## Level 3 — iOS: Swift UIDatePicker view (`RNDatePickerView.swift`)

### 🟢 Hint 1: What the setters do

Each `@objc` setter receives a value from the ObjC++ shell and configures `datePicker` accordingly. The helpers `parseDate(from:)`, `clamp(_:)`, and `pickerMode(from:)` are already provided.

### 🟡 Hint 2: The `setDateISO` pattern

```swift
@objc public func setDateISO(_ iso: String) {
  guard let date = parseDate(from: iso) else { return }
  let clamped = clamp(date)
  if datePicker.date != clamped {
    datePicker.setDate(clamped, animated: false)
  }
}
```

The min/max setters follow the same pattern: update the bound, then clamp.

### 🔴 Hint 3: Full solution

<details>
<summary>Click to reveal — <code>ios/RNDatePickerView.swift</code> (setters only)</summary>

```swift
@objc public func setDateISO(_ iso: String) {
  guard let date = parseDate(from: iso) else { return }
  let clamped = clamp(date)
  if datePicker.date != clamped {
    datePicker.setDate(clamped, animated: false)
  }
}

@objc public func setMinimumDateISO(_ iso: String?) {
  datePicker.minimumDate = iso.flatMap { parseDate(from: $0) }
  let clamped = clamp(datePicker.date)
  if datePicker.date != clamped {
    datePicker.setDate(clamped, animated: false)
  }
}

@objc public func setMaximumDateISO(_ iso: String?) {
  datePicker.maximumDate = iso.flatMap { parseDate(from: $0) }
  let clamped = clamp(datePicker.date)
  if datePicker.date != clamped {
    datePicker.setDate(clamped, animated: false)
  }
}

@objc public func setPickerMode(_ mode: String) {
  datePicker.datePickerMode = pickerMode(from: mode)
}

@objc public func setPickerAccentColor(_ color: UIColor?) {
  datePicker.tintColor = color
}
```

</details>

---

## Level 3 — Android: DatePickerButton (`DatePickerButton.kt`)

### 🟢 Hint 1: Setter pattern

Each setter updates internal state, then clamps and refreshes:

```kotlin
fun setDate(instant: Instant) {
  selectedDateTime = clamp(instant.atZone(zoneId))
  updateLabel()
}
```

### 🟡 Hint 2: Opening the date picker

On Android, `MaterialDatePicker` needs a `FragmentActivity`. The `findFragmentActivity()` helper is already provided. Fall back to `DatePickerDialog` when not in a `FragmentActivity`.

Key steps for `MaterialDatePicker`:
1. Build `CalendarConstraints` with validators from min/max dates
2. Set the selection to the current `selectedDateTime` as UTC millis
3. On positive click: convert UTC millis → `LocalDate`, then call `applyDateSelection`

### 🟡 Hint 3: The time picker

```kotlin
private fun openTimePicker() {
  val dialog = TimePickerDialog(
    context,
    { _, hourOfDay, minute ->
      val nextDateTime = selectedDateTime
        .withHour(hourOfDay)
        .withMinute(minute)
        .withSecond(0)
        .withNano(0)
      selectedDateTime = clamp(nextDateTime)
      emitAndRefresh()
    },
    selectedDateTime.hour,
    selectedDateTime.minute,
    true,
  )
  dialog.show()
}
```

### 🔴 Hint 4: Full solution

<details>
<summary>Click to reveal — <code>android/.../DatePickerButton.kt</code> (setters + picker methods)</summary>

```kotlin
// ── Setters ──────────────────────────────────────────────

fun setDate(instant: Instant) {
  selectedDateTime = clamp(instant.atZone(zoneId))
  updateLabel()
}

fun setMinimumDate(instant: Instant?) {
  minimumDate = instant
  selectedDateTime = clamp(selectedDateTime)
  updateLabel()
}

fun setMaximumDate(instant: Instant?) {
  maximumDate = instant
  selectedDateTime = clamp(selectedDateTime)
  updateLabel()
}

fun setMode(mode: PickerMode) {
  this.mode = mode
  updateLabel()
}

fun setAccentColor(@ColorInt color: Int?) {
  color?.let {
    setTextColor(it)
  } ?: run {
    setTextColor(defaultTextColors)
  }
}

// ── Picker dialogs ──────────────────────────────────────

private fun openPicker() {
  when (mode) {
    PickerMode.DATE -> openDatePicker(continueWithTime = false)
    PickerMode.TIME -> openTimePicker()
    PickerMode.DATETIME -> openDatePicker(continueWithTime = true)
  }
}

private fun openDatePicker(continueWithTime: Boolean) {
  val fragmentActivity = findFragmentActivity()

  if (fragmentActivity != null) {
    val constraintsBuilder = CalendarConstraints.Builder()
    val validators = mutableListOf<CalendarConstraints.DateValidator>()

    minimumDate?.let {
      constraintsBuilder.setStart(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
      validators += DateValidatorPointForward.from(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
    }

    maximumDate?.let {
      constraintsBuilder.setEnd(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
      validators += DateValidatorPointBackward.before(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
    }

    if (validators.isNotEmpty()) {
      constraintsBuilder.setValidator(CompositeDateValidator.allOf(validators))
    }

    val picker =
        MaterialDatePicker.Builder.datePicker()
            .setSelection(localDateAtUtcMillis(selectedDateTime.toLocalDate()))
            .setCalendarConstraints(constraintsBuilder.build())
            .build()

    picker.addOnPositiveButtonClickListener { utcMillis ->
      val localDate = Instant.ofEpochMilli(utcMillis).atZone(ZoneOffset.UTC).toLocalDate()
      applyDateSelection(localDate, continueWithTime)
    }

    picker.show(fragmentActivity.supportFragmentManager, "native_date_picker")
    return
  }

  val dialog =
      DatePickerDialog(
          context,
          { _, year, monthOfYear, dayOfMonth ->
            applyDateSelection(LocalDate.of(year, monthOfYear + 1, dayOfMonth), continueWithTime)
          },
          selectedDateTime.year,
          selectedDateTime.monthValue - 1,
          selectedDateTime.dayOfMonth,
      )

  minimumDate?.let {
    dialog.datePicker.minDate = localDateAtSystemMillis(it.atZone(zoneId).toLocalDate())
  }
  maximumDate?.let {
    dialog.datePicker.maxDate = localDateAtSystemMillis(it.atZone(zoneId).toLocalDate())
  }

  dialog.show()
}

private fun openTimePicker() {
  val dialog =
      TimePickerDialog(
          context,
          { _, hourOfDay, minute ->
            val nextDateTime =
                selectedDateTime
                    .withHour(hourOfDay)
                    .withMinute(minute)
                    .withSecond(0)
                    .withNano(0)

            selectedDateTime = clamp(nextDateTime)
            emitAndRefresh()
          },
          selectedDateTime.hour,
          selectedDateTime.minute,
          true,
      )

  dialog.show()
}

private fun applyDateSelection(localDate: LocalDate, continueWithTime: Boolean) {
  val nextDateTime =
      if (continueWithTime) {
        selectedDateTime
            .withYear(localDate.year)
            .withMonth(localDate.monthValue)
            .withDayOfMonth(localDate.dayOfMonth)
      } else {
        localDate.atStartOfDay(zoneId)
      }

  selectedDateTime = clamp(nextDateTime)

  if (continueWithTime) {
    openTimePicker()
  } else {
    emitAndRefresh()
  }
}
```

</details>

---

## Testing your implementation

After implementing each level, regenerate artifacts, then rebuild:

```sh
# 1) Generate native artifacts from the spec
npx react-native codegen --platform all

# 2) iOS integration
cd ios && pod install && cd ..
yarn ios

# 3) Android
yarn android
```

The **DatePicker example** is on the **Meins** tab → **Setup Lilliebox** section. When working correctly:

- A date/time picker UI appears (inline wheel on iOS, button → dialog on Android)
- Selecting a date updates the "Ausgewählter Wert" card below with the ISO string
- The picker respects `minimumDate` / `maximumDate` constraints
- The accent color is applied (red `#e9001b`)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `NativeDatePickerView` not found at runtime | Run `npx react-native codegen --platform all`, then `cd ios && pod install` and rebuild |
| iOS picker renders but doesn't emit events | Check that the `onChange` block is wired in `initWithFrame:` |
| Android picker shows but date doesn't update | Check that `emitChange` is called after `selectedDateTime` is updated |
| Build error in `.mm` file | Make sure you're comparing against `*_props` (old) not `*oldProps` |
