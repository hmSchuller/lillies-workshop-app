import type {ColorValue, HostComponent, ViewProps} from 'react-native';
import type {
  BubblingEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type DatePickerMode = 'date' | 'time' | 'datetime';

export type DatePickerChangeEvent = Readonly<{date: string}>;

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
