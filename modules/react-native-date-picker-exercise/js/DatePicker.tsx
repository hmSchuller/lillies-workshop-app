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
