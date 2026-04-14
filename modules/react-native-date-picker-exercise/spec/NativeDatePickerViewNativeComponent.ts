import type {ColorValue, HostComponent, ViewProps} from 'react-native';
import type {
  BubblingEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// TODO (Level 0): Define the mode union used by JS + native codegen.
// Keep these three values in sync with iOS/Android native mapping logic.
export type DatePickerMode = 'date' | 'time' | 'datetime';

// TODO (Level 0): Define the event payload emitted by native on date changes.
export type DatePickerChangeEvent = Readonly<{
  date: string;
}>;

// TODO (Level 0): Define the native props contract.
//
// Required:
//  - date: string
// Optional:
//  - minimumDate?: string
//  - maximumDate?: string
//  - mode?: WithDefault<DatePickerMode, 'date'>
//  - accentColor?: ColorValue
//  - onChange?: BubblingEventHandler<DatePickerChangeEvent> | null
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
