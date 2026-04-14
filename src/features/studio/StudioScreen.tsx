import * as React from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RecordingCard from './RecordingCard';
import RecordingModal from './RecordingModal';
import AppHeader from '../../shared/AppHeader';
import {Colors} from '../../shared/tokens';
import { createStudioRecorder, RecordingInfo } from 'react-native-studio-recorder';

export default function StudioScreen(): React.JSX.Element {
  // Create the HybridObject inside the component — avoids issues when the
  // module is imported before NitroModules is fully initialized.
  const recorder = React.useMemo(() => createStudioRecorder(), []);
  const [recordings, setRecordings] = React.useState<RecordingInfo[]>([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // Fetch recordings from native on mount
  React.useEffect(() => {
    setRecordings(recorder.getRecordings());
  }, [recorder]);

  const handleModalClose = React.useCallback(
    (didRecord: boolean) => {
      setIsModalVisible(false);
      if (didRecord) {
        setRecordings(recorder.getRecordings());
      }
    },
    [recorder],
  );

  const handleDelete = React.useCallback(
    (id: string) => {
      try {
        recorder.deleteRecording(id);
        setRecordings(prev => prev.filter(r => r.id !== id));
      } catch (e) {
        Alert.alert('Fehler', 'Aufnahme konnte nicht gelöscht werden.');
      }
    },
    [recorder],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <AppHeader title="Studio" />
      <View style={styles.container}>
        {recordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Noch keine Aufnahmen</Text>
            <Text style={styles.emptySubtext}>
              Tippe auf den roten Button, um eine Aufnahme zu starten.
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({item}) => (
              <RecordingCard recording={item} onDelete={handleDelete} />
            )}
          />
        )}

        {/* Floating action button */}
        <Pressable
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.fabText}>Neue Aufnahme</Text>
        </Pressable>

        {isModalVisible && (
          <RecordingModal recorder={recorder} onClose={handleModalClose} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundApp,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100, // space for FAB
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: Colors.deepRed,
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: Colors.deepRed,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  fabText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.backgroundCard,
  },
});
