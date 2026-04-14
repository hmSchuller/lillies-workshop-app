import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

// TODO (Level 0): tighten this to the exact status union.
// Expected final: 'completed' | 'cancelled'
export type AddLillieboxStatus = never;

// TODO (Level 0): tighten this to the exact added-via union.
// Expected final: 'qr' | 'manual' | 'nfc' | null
export type AddLillieboxAddedVia = never;

// TODO (Level 0): define the strict result contract used across JS + native.
export interface AddLillieboxResult {
  status: AddLillieboxStatus;
  serialNumber: string | null;
  addedVia: AddLillieboxAddedVia;
}

export interface Spec extends TurboModule {
  // TODO (Level 0): Keep this method aligned with native spec/codegen.
  launchAddLilliebox(): Promise<AddLillieboxResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAddLillieboxModule');
