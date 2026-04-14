import * as React from 'react';
import type {ColorValue, ViewProps} from 'react-native';
import {Text, View} from 'react-native';

// TODO (Level 1): Import NativeDatePickerView from the Codegen spec.
// The spec is at ../spec/NativeDatePickerViewNativeComponent
// import NativeDatePickerView from '../spec/NativeDatePickerViewNativeComponent';

export type DatePickerMode = 'date' | 'time' | 'datetime';

export interface DatePickerProps extends Omit<ViewProps, 'onChange'> {
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: DatePickerMode;
  accentColor?: ColorValue;
  onChange?: (date: Date) => void;
}

// TODO (Level 1): Implement the DatePicker component.
//
// This wrapper converts the JS-friendly API (Date objects, typed callbacks)
// to the props the Codegen-generated native component expects (ISO strings, native events).
//
// Steps:
//  1. Import NativeDatePickerView from the spec (uncomment the import above).
//  2. Write a handleChange callback that:
//       - Receives a NativeSyntheticEvent<{ date: string }>
//       - Parses event.nativeEvent.date into a Date object
//       - Guards against NaN (invalid date string)
//       - Calls onChange?.(nextDate)
//  3. Render <NativeDatePickerView> with the converted props:
//       - value          → date           (Date → .toISOString())
//       - minimumDate?   → minimumDate    (Date | undefined → .toISOString() | undefined)
//       - maximumDate?   → maximumDate    (Date | undefined → .toISOString() | undefined)
//       - mode, accentColor              (pass through as-is)
//       - onChange       → handleChange  (native event handler)
//       - ...viewProps                   (spread the rest)

export default function DatePicker({
  value,
  minimumDate,
  maximumDate,
  mode = 'date',
  accentColor,
  onChange,
  ...viewProps
}: DatePickerProps): React.JSX.Element {
  return (
    <View
      {...viewProps}
      style={[
        {minHeight: 56, justifyContent: 'center', alignItems: 'center'},
        viewProps.style,
      ]}>
      <Text style={{color: '#888', fontSize: 14}}>
        DatePicker — not yet implemented
      </Text>
    </View>
  );
}
