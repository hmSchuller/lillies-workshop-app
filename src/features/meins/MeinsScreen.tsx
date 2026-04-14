import * as React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {launchAddLilliebox, type AddLillieboxResult} from 'react-native-add-lilliebox';
import LillieboxCard from './LillieboxCard';
import SetupLillieboxCard from './SetupLillieboxCard';
import AppHeader from '../../shared/AppHeader';
import {type LillieboxData} from '../../shared/types';
import {Colors} from '../../shared/tokens';
import {DatePicker} from 'react-native-date-picker-exercise';


export type {LillieboxData};

export default function MeinsScreen(): React.JSX.Element {
  const [lillieboxes, setLillieboxes] = React.useState<LillieboxData[]>([
    {
      id: 'emmas-box',
      boxName: 'Emmas Lilliebox',
      model: 'Lilliebox',
      color: 'Mint',
      colorHex: '#98D8AA',
    },
  ]);

  const [alarmTime, setAlarmTime] = React.useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(7, 30, 0, 0);
    return d;
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const [pickerDate, setPickerDate] = React.useState(() => {
    const d = new Date();
    d.setHours(7, 30, 0, 0);
    return d;
  });

  const handleOpenDatePicker = React.useCallback(() => {
    if (alarmTime) {
      setPickerDate(new Date(alarmTime));
    }
    setShowDatePicker(true);
  }, [alarmTime]);

  const handleConfirmTime = React.useCallback(() => {
    setAlarmTime(new Date(pickerDate));
    setShowDatePicker(false);
  }, [pickerDate]);

  const handleSetupLilliebox = React.useCallback(async () => {
    console.log('[AddLilliebox] setup tapped');
    try {
      console.log('[AddLilliebox] launching native flow');
      const result: AddLillieboxResult = await launchAddLilliebox();
      console.log('[AddLilliebox] native flow resolved', result);
      if (result.status === 'completed' && result.serialNumber) {
        setLillieboxes(prev => [
          ...prev,
          {
            id: result.serialNumber!,
            boxName: `Lilliebox ${result.serialNumber}`,
            model: 'Lilliebox',
            color: 'Sky',
            colorHex: '#87CEEB',
          },
        ]);
      }
    } catch (e) {
      console.error('[AddLilliebox] native flow failed', e);
      Alert.alert('Fehler', 'Einrichtung fehlgeschlagen. Bitte erneut versuchen.');
    }
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <AppHeader title="Meins" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SetupLillieboxCard onSetup={handleSetupLilliebox} />
        <Text style={styles.sectionHeading}>Deine Lillieboxen</Text>
        {lillieboxes.map(box => (
          <LillieboxCard
            key={box.id}
            boxName={box.boxName}
            model={box.model}
            color={box.color}
            colorHex={box.colorHex}
            alarmTime={alarmTime}
            onSetAlarm={handleOpenDatePicker}
          />
        ))}
      </ScrollView>
      {showDatePicker && (
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alarm einstellen</Text>
              <DatePicker
                style={styles.timePicker}
                value={pickerDate}
                mode="datetime"
                accentColor={Colors.deepRed}
                onChange={setPickerDate}
              />
              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.modalCancelButton}
                  onPress={() => setShowDatePicker(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Abbrechen">
                  <Text style={styles.modalCancelText}>Abbrechen</Text>
                </Pressable>
                <Pressable
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmTime}
                  accessibilityRole="button"
                  accessibilityLabel="Fertig">
                  <Text style={styles.modalConfirmText}>Fertig</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundApp,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionHeading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 16,
  },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  timePicker: {
    minHeight: 56,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: Colors.deepRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.deepRed,
  },
  modalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    backgroundColor: Colors.deepRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundCard,
  },
});
