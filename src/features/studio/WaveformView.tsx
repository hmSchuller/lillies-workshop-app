import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {Colors} from '../../shared/tokens';

interface WaveformViewProps {
  /** Array of 50 dB readings in the range [-60, 0] */
  samples: number[];
  isRecording: boolean;
}

const BAR_COUNT = 50;
const BAR_MAX_HEIGHT = 60;
const BAR_MIN_HEIGHT = 3;

/**
 * Renders a row of 50 vertical bars whose heights are mapped linearly from
 * the dB samples: –60 dB → 3 px, 0 dB → 60 px.
 *
 * Re-renders at the rate the parent pushes new samples (~10 Hz).
 * No Animated API needed — the update rate is low enough that setState re-renders
 * are perfectly smooth.
 */
export default function WaveformView({
  samples,
  isRecording,
}: WaveformViewProps): React.JSX.Element {
  const barColor = isRecording ? Colors.deepRed : Colors.waveformIdle;

  return (
    <View style={styles.container}>
      {samples.map((db, index) => {
        const clampedDb = Math.max(-60, Math.min(0, db));
        const height = Math.max(
          BAR_MIN_HEIGHT,
          ((clampedDb + 60) / 60) * BAR_MAX_HEIGHT,
        );
        return (
          <View
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={[styles.bar, { height, backgroundColor: barColor }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    gap: 2,
    paddingHorizontal: 4,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
});
