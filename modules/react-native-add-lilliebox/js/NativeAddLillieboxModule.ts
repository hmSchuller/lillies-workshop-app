import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

// TODO (Level 0): tighten this to a strict union type.
// final expected: 'completed' | 'cancelled'
export type AddLillieboxStatus = string;

// TODO (Level 0): tighten this to a strict union type.
// final expected: 'qr' | 'manual' | 'nfc' | null
export type AddLillieboxAddedVia = string | null;

// TODO (Level 0): Define the strict result contract used across JS + native.
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
