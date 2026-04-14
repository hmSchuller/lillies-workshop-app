import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface AddLillieboxResult {
  status: 'completed' | 'cancelled';
  serialNumber: string | null;
  addedVia: 'qr' | 'manual' | 'nfc' | null;
}

export interface Spec extends TurboModule {
  launchAddLilliebox(): Promise<AddLillieboxResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAddLillieboxModule');
