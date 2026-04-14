import * as React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import ContentCard from '../../shared/ContentCard';
import {LILLIES} from '../../data/lillies';
import ProductCard from './ProductCard';
import AppHeader from '../../shared/AppHeader';
import {Colors} from '../../shared/tokens';
import type {RootStackParamList, TabParamList} from '../../navigation/types';
import { addShakeListener, DiscoverOverlay, type DiscoverItem } from 'lillie-shaker';


type StartScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Start'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function StartScreen(): React.JSX.Element {
  const navigation = useNavigation<StartScreenNavigationProp>();
  const [showDiscover, setShowDiscover] = useState(false);
  const [discoverItems, setDiscoverItems] = useState<DiscoverItem[]>([]);

  useEffect(() => {
    const subscription = addShakeListener(() => {
      const count = Math.floor(Math.random() * 3) + 3; // 3–5 items
      const shuffled = [...LILLIES].sort(() => Math.random() - 0.5);
      const picked: DiscoverItem[] = shuffled.slice(0, count).map((p) => ({
        id: p.id,
        title: p.title,
        imageUrl: p.imageUrl,
        category: p.category,
      }));
      setDiscoverItems(picked);
      setShowDiscover(true);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  function handleItemSelect(id: string): void {
    setShowDiscover(false);
    const product = LILLIES.find((p) => p.id === id);
    if (product) {
      navigation.navigate('ProductDetail', {product});
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <AppHeader title="Hey" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.shakeHint}>🎲 Schütteln zum Entdecken</Text>
        <ProductCard />
        <View style={{height: 16}} />
        <ContentCard />
      </ScrollView>
      <DiscoverOverlay
        items={discoverItems}
        visible={showDiscover}
        onItemSelect={handleItemSelect}
        onDismiss={() => setShowDiscover(false)}
      />
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
  shakeHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 12,
  },
});
