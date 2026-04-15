import type {ColorValue, HostComponent, ViewProps} from 'react-native';
import type {
  BubblingEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// TODO (Level 0): Define the mode union used by JS + native codegen.
// Expected values: 'date' | 'time' | 'datetime'
export type DatePickerMode = never;

// TODO (Level 0): Define the event payload emitted by native on date changes.
// Expected shape: { date: string }
export type DatePickerChangeEvent = Readonly<{}>;

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
  // TODO: add props here
}

export default codegenNativeComponent<NativeProps>(
  'NativeDatePickerView',
) as HostComponent<NativeProps>;
