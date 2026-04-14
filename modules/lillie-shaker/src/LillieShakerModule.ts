import { NativeModule, requireNativeModule } from 'expo';

import { LillieShakerModuleEvents } from './LillieShaker.types';

declare class LillieShakerModule extends NativeModule<LillieShakerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<LillieShakerModule>('LillieShaker');
