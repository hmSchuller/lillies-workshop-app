import {NitroModules} from 'react-native-nitro-modules';
import type {NitroStudioRecorder} from './specs/NitroStudioRecorder.nitro';

export type {NitroStudioRecorder} from './specs/NitroStudioRecorder.nitro';
export type {RecordingResult, RecordingInfo} from './specs/NitroStudioRecorder.nitro';

// TODO (Level 1): Wire JS to the Nitro HybridObject runtime.
//
// Final implementation should return:
//   NitroModules.createHybridObject<NitroStudioRecorder>('NitroStudioRecorder')
//
// For now, this stub returns a safe no-op object so the app can still run.
export function createStudioRecorder(): NitroStudioRecorder {
  const stub = {
    startRecording: () => {
      throw new Error('Studio recorder is not implemented yet.');
    },
    stopRecording: () => ({
      id: 'stub',
      filePath: '',
      durationMs: 0,
    }),
    cancelRecording: () => {},
    isRecording: false,
    getRecordings: () => [],
    deleteRecording: () => {},
  };

  void NitroModules; // keep import referenced in stub version
  return stub as unknown as NitroStudioRecorder;
}
