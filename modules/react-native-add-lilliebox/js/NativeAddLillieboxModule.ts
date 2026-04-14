import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

// TODO (Level 0): Define the strict result contract used across JS + native.
// Suggested final types:
//   status: 'completed' | 'cancelled'
//   serialNumber: string | null
//   addedVia: 'qr' | 'manual' | 'nfc' | null
export interface AddLillieboxResult {
  status: string;
  serialNumber: string | null;
  addedVia: string | null;
}

export interface Spec extends TurboModule {
  // TODO (Level 0): Keep this method aligned with native spec/codegen.
  launchAddLilliebox(): Promise<AddLillieboxResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAddLillieboxModule');
