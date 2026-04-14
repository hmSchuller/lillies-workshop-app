import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {BellIcon} from '../../shared/icons';
import {Colors} from '../../shared/tokens';

function formatAlarmDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

interface LillieboxCardProps {
  boxName: string;
  model: string;
  color: string;
  colorHex: string;
  alarmTime: Date | null;
  onSetAlarm: () => void;
}

export default function LillieboxCard({
  boxName,
  model,
  color,
  colorHex,
  alarmTime,
  onSetAlarm,
}: LillieboxCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.boxName}>{boxName}</Text>

      {/* Info row */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Modell: {model}</Text>
        <View style={styles.colorInfo}>
          <Text style={styles.infoText}>Farbe: {color}</Text>
          <View style={[styles.colorDot, {backgroundColor: colorHex}]} />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Alarm section */}
      <View style={styles.alarmSection}>
        <View style={styles.alarmLabelRow}>
          <BellIcon color={Colors.textPrimary} size={20} />
          <Text style={styles.alarmLabel}>
            {alarmTime ? 'Nächster Alarm' : 'Kein Alarm gesetzt'}
          </Text>
        </View>
        {alarmTime && (
          <Text style={styles.alarmDateTime}>
            {formatAlarmDate(alarmTime)}
          </Text>
        )}
      </View>

      {/* CTA button */}
      <Pressable
        style={styles.ctaButton}
        onPress={onSetAlarm}
        accessibilityRole="button"
        accessibilityLabel="Alarm einstellen">
        <Text style={styles.ctaButtonText}>Alarm einstellen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#C0D4DF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    marginBottom: 16,
  },
  boxName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 16,
  },
  alarmSection: {
    marginBottom: 20,
  },
  alarmLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alarmLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  alarmDateTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginLeft: 30,
  },
  ctaButton: {
    backgroundColor: Colors.deepRed,
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: Colors.backgroundCard,
    fontSize: 16,
    fontWeight: '700',
  },
});
