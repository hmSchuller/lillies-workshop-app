import {type HybridObject} from 'react-native-nitro-modules';

// TODO (Level 0): Define the exact shape returned from stopRecording().
// Expected final fields:
//  - id: string
//  - filePath: string
//  - durationMs: number
export interface RecordingResult {
  id: never;
  filePath: never;
  durationMs: never;
}

// TODO (Level 0): Define the persisted recording metadata shape.
// Expected final fields:
//  - id: string
//  - name: string
//  - filePath: string
//  - durationMs: number
//  - createdAt: number (Unix timestamp ms)
export interface RecordingInfo {
  id: never;
  name: never;
  filePath: never;
  durationMs: never;
  createdAt: never;
}

// TODO (Level 0): Define the Nitro HybridObject contract.
//
// Required methods/properties:
// - startRecording(onMeterUpdate)
// - stopRecording(): RecordingResult
// - cancelRecording()
// - isRecording (readonly)
// - getRecordings(): RecordingInfo[]
// - deleteRecording(id)
export interface NitroStudioRecorder
  extends HybridObject<{ios: 'swift'; android: 'kotlin'}> {
  startRecording(onMeterUpdate: never): never;
  stopRecording(): never;
  cancelRecording(): never;
  readonly isRecording: never;

  getRecordings(): never;
  deleteRecording(id: never): never;
}
