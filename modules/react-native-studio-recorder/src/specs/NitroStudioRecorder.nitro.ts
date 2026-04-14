import { type HybridObject } from 'react-native-nitro-modules';

export interface RecordingResult {
  id: string;
  filePath: string;
  durationMs: number;
}

export interface RecordingInfo {
  id: string;
  name: string;
  filePath: string;
  durationMs: number;
  createdAt: number; // Unix timestamp ms
}

export interface NitroStudioRecorder
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  // Recording control
  startRecording(onMeterUpdate: (db: number) => void): void;
  stopRecording(): RecordingResult;
  cancelRecording(): void;
  readonly isRecording: boolean;

  // Storage
  getRecordings(): RecordingInfo[];
  deleteRecording(id: string): void;
}
