import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RecordingInfo } from 'react-native-studio-recorder';
import {Colors} from '../../shared/tokens';

interface RecordingCardProps {
  recording: RecordingInfo;
  onDelete: (id: string) => void;
}

/** Formats milliseconds as m:ss */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Formats a Unix timestamp (ms) in German locale */
function formatDate(timestampMs: number): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestampMs));
}

export default function RecordingCard({
  recording,
  onDelete,
}: RecordingCardProps): React.JSX.Element {
  return (
    <View style={styles.shadow}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{recording.name}</Text>
          <Text style={styles.meta}>
            {formatDuration(recording.durationMs)}
            {'  ·  '}
            {formatDate(recording.createdAt)}
          </Text>
        </View>
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(recording.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${recording.name} löschen`}>
          <Text style={styles.deleteText}>Löschen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  deleteButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.deepRed,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.deepRed,
  },
});
