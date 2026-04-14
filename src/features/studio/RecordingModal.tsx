import * as React from 'react';
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NitroStudioRecorder } from 'react-native-studio-recorder';
import { StudioIcon } from '../../shared/icons';
import WaveformView from './WaveformView';
import {Colors} from '../../shared/tokens';

interface RecordingModalProps {
  recorder: NitroStudioRecorder;
  onClose: (didRecord: boolean) => void;
}

const SAMPLE_COUNT = 50;
const INITIAL_SAMPLES = Array<number>(SAMPLE_COUNT).fill(-60);

/** Formats elapsed seconds as mm:ss */
function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Request RECORD_AUDIO on Android (no-op on iOS — handled in Swift). */
async function requestMicPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Mikrofon',
      message: 'Studio benötigt Zugriff auf das Mikrofon, um Aufnahmen zu erstellen.',
      buttonPositive: 'Erlauben',
      buttonNegative: 'Ablehnen',
    },
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export default function RecordingModal({
  recorder,
  onClose,
}: RecordingModalProps): React.JSX.Element {
  const [isRecording, setIsRecording] = React.useState(false);
  const [samples, setSamples] = React.useState<number[]>(INITIAL_SAMPLES);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  // useRef keeps the "is recording" flag in sync for the unmount cleanup.
  // A plain state variable would be stale inside the cleanup closure.
  const isRecordingRef = React.useRef(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Unmount safety ─────────────────────────────────────────────────────────
  // If the modal is unmounted while recording (OS kill, unexpected navigation),
  // cancel the recording so the native engine doesn't continue running and
  // fire meter callbacks into a dead JS context.
  React.useEffect(() => {
    return () => {
      if (isRecordingRef.current) {
        recorder.cancelRecording();
      }
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // empty deps — runs only on unmount

  const stopTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = React.useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  const handleStart = React.useCallback(async () => {
    const granted = await requestMicPermission();
    if (!granted) {
      return;
    }

    try {
      recorder.startRecording((db: number) => {
        // Slide the window: drop the oldest sample, append the new dB value.
        setSamples(prev => [...prev.slice(1), db]);
      });
      setIsRecording(true);
      isRecordingRef.current = true;
      setElapsedSeconds(0);
      startTimer();
    } catch (e) {
      // Could be permission denied, undetermined, or a native audio engine error.
      const msg = (e as Error).message ?? 'Aufnahme konnte nicht gestartet werden.';
      Alert.alert('Fehler', msg);
    }
  }, [recorder, startTimer]);

  const handleStop = React.useCallback(() => {
    try {
      recorder.stopRecording();
    } catch (e) {
      // If native side fails, still clean up JS state below.
      console.warn('stopRecording error:', e);
    }
    stopTimer();
    setIsRecording(false);
    isRecordingRef.current = false;
    // Assumes stopRecording() is synchronous and returns only after the file is
    // written to disk. If the native implementation flushes asynchronously,
    // consider making stopRecording() return a Promise.
    onClose(true);
  }, [recorder, stopTimer, onClose]);

  const handleCancel = React.useCallback(() => {
    try {
      if (isRecordingRef.current) {
        recorder.cancelRecording();
      }
    } catch (e) {
      console.warn('cancelRecording error:', e);
    }
    stopTimer();
    setIsRecording(false);
    isRecordingRef.current = false;
    onClose(false);
  }, [recorder, stopTimer, onClose]);

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Icon */}
          <View style={styles.iconRow}>
            <StudioIcon
              color={isRecording ? Colors.deepRed : Colors.iconInactive}
              size={64}
            />
          </View>

          {/* Waveform */}
          <WaveformView samples={samples} isRecording={isRecording} />

          {/* Timer */}
          <Text style={styles.timer}>{formatElapsed(elapsedSeconds)}</Text>

          {/* Primary button */}
          <Pressable
            style={[
              styles.primaryButton,
              isRecording && styles.primaryButtonActive,
            ]}
            onPress={isRecording ? handleStop : handleStart}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'}>
            <Text style={styles.primaryButtonText}>
              {isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
            </Text>
          </Pressable>

          {/* Cancel button */}
          <Pressable
            style={styles.cancelButton}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Abbrechen">
            <Text style={styles.cancelButtonText}>Abbrechen</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    marginTop: 12,
    marginBottom: 28,
  },
  primaryButton: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: Colors.deepRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonActive: {
    backgroundColor: Colors.deepRedDark,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundCard,
  },
  cancelButton: {
    height: 52,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: Colors.deepRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.deepRed,
  },
});
