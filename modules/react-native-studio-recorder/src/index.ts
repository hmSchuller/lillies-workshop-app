import { NitroModules } from 'react-native-nitro-modules';
import type { NitroStudioRecorder } from './specs/NitroStudioRecorder.nitro';

export type { NitroStudioRecorder } from './specs/NitroStudioRecorder.nitro';
export type { RecordingResult, RecordingInfo } from './specs/NitroStudioRecorder.nitro';

export function createStudioRecorder(): NitroStudioRecorder {
  return NitroModules.createHybridObject<NitroStudioRecorder>('NitroStudioRecorder');
}
