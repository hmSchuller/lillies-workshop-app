import {type HybridObject} from 'react-native-nitro-modules';

// TODO (Level 0): Define the exact shape returned from stopRecording().
export interface RecordingResult {
  id: string;
  filePath: string;
  durationMs: number;
}

// TODO (Level 0): Define the persisted recording metadata shape.
export interface RecordingInfo {
  id: string;
  name: string;
  filePath: string;
  durationMs: number;
  createdAt: number; // Unix timestamp ms
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
  startRecording(onMeterUpdate: (db: number) => void): void;
  stopRecording(): RecordingResult;
  cancelRecording(): void;
  readonly isRecording: boolean;

  getRecordings(): RecordingInfo[];
  deleteRecording(id: string): void;
}
