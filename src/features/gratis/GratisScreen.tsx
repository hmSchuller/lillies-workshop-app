import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContentCard from '../../shared/ContentCard';
import AppHeader from '../../shared/AppHeader';
import {Colors} from '../../shared/tokens';

export default function GratisScreen(): React.JSX.Element {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <AppHeader title="Gratis" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ContentCard />
      </ScrollView>
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
});
