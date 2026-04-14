import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../shared/tokens';
import AppHeader from '../../shared/AppHeader';
import {
  AbenteuerIcon,
  BewegungIcon,
  DetektivIcon,
  EinschlafenIcon,
  FantasyMagieIcon,
  KinderliedIcon,
  MaerchenIcon,
  PferdegeschichtenIcon,
  TiereNaturIcon,
  WissenLernenIcon,
} from '../../shared/icons';

type CategoryIconComponent = React.ComponentType<{color?: string; size?: number}>;

interface Category {
  id: string;
  name: string;
  color: string;
  Icon: CategoryIconComponent;
}

// 10 categories with SVG background tiles and matching icon components
const CATEGORIES: Category[] = [
  {
    id: 'bewegung',
    name: 'Bewegung',
    color: '#b8d8ef',
    Icon: BewegungIcon,
  },
  {
    id: 'abenteuer',
    name: 'Abenteuer',
    color: '#e8d5b8',
    Icon: AbenteuerIcon,
  },
  {
    id: 'tiere-natur',
    name: 'Tiere & Natur',
    color: '#f0e070',
    Icon: TiereNaturIcon,
  },
  {
    id: 'kinderlieder',
    name: 'Kinderlieder',
    color: '#e8d5b8',
    Icon: KinderliedIcon,
  },
  {
    id: 'detektivgeschichten',
    name: 'Detektivgeschichten',
    color: '#b8d8ef',
    Icon: DetektivIcon,
  },
  {
    id: 'wissen-lernen',
    name: 'Wissen & Lernen',
    color: '#f5b8b0',
    Icon: WissenLernenIcon,
  },
  {
    id: 'maerchen',
    name: 'Märchen',
    color: '#c8e8d0',
    Icon: MaerchenIcon,
  },
  {
    id: 'einschlafen',
    name: 'Einschlafen',
    color: '#d0c8f0',
    Icon: EinschlafenIcon,
  },
  {
    id: 'fantasy-magie',
    name: 'Fantasy & Magie',
    color: '#d0c8f0',
    Icon: FantasyMagieIcon,
  },
  {
    id: 'pferdegeschichten',
    name: 'Pferdegeschichten',
    color: '#b8d8ef',
    Icon: PferdegeschichtenIcon,
  },
];

export default function CategoriesScreen(): React.JSX.Element {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <AppHeader title="Kategorien" />
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.grid}>
        {CATEGORIES.map(cat => (
          <View key={cat.id} style={styles.item}>
            <View style={[styles.thumbnail, {backgroundColor: cat.color}]}>
              <View style={styles.iconOverlay}>
                <cat.Icon color={Colors.backgroundCard} size={24} />
              </View>
            </View>
            <Text style={styles.label}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundApp,
  },
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundApp,
  },
  grid: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 8,
  },
  item: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
    lineHeight: 20,
  },
});
