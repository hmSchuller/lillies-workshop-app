import { registerWebModule, NativeModule } from 'expo';

import { LillieShakerModuleEvents } from './LillieShaker.types';

class LillieShakerModule extends NativeModule<LillieShakerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(LillieShakerModule, 'LillieShakerModule');
