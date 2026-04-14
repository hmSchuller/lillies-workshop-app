import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import DatePicker from './DatePicker';

export default function DatePickerExample(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2026-03-24T10:30:00.000Z'),
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollContent}>
      {/* Card 1: Date picker */}
      <View style={styles.cardShadow}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Datum wählen</Text>
            <Text style={styles.discoverLink}>Einstellen</Text>
          </View>
          <View style={styles.pickerArea}>
            <DatePicker
              style={styles.picker}
              value={selectedDate}
              minimumDate={new Date('2026-01-01T00:00:00.000Z')}
              maximumDate={new Date('2026-12-31T23:59:59.999Z')}
              mode="datetime"
              accentColor="#e9001b"
              onChange={setSelectedDate}
            />
          </View>
        </View>
      </View>

      {/* Card 2: Output */}
      <View style={styles.cardShadow}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Ausgewählter Wert</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.outputSection}>
              <Text style={styles.outputLabel}>ISO-WERT</Text>
              <Text style={styles.outputValue}>{selectedDate.toISOString()}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // ── Cards ──────────────────────────────────────────────────────────────────
  cardShadow: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  discoverLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e9001b',
  },

  // ── Picker area ────────────────────────────────────────────────────────────
  pickerArea: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  picker: {
    minHeight: 56,
  },

  // ── Output card ────────────────────────────────────────────────────────────
  cardContent: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  outputSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  outputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b6b6b',
    textTransform: 'uppercase',
  },
  outputValue: {
    fontSize: 14,
    color: '#1a1a1a',
  },
});
