import * as React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {RootStackScreenProps} from '../../navigation/types';
import {Colors} from '../../shared/tokens';

export default function ProductDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<'ProductDetail'>): React.JSX.Element {
  const {product} = route.params;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{flex: 1, backgroundColor: Colors.backgroundApp}}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Back button */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backPressable}
          accessibilityRole="button"
          accessibilityLabel="Zurück">
          <Text style={styles.backButtonText}>← Zurück</Text>
        </Pressable>
      </View>

      {/* Product image */}
      <Image
        source={{uri: product.imageUrl}}
        style={styles.productImage}
        resizeMode="cover"
        accessibilityLabel={product.title}
      />

      <View style={styles.content}>
        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{product.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* Shake again hint */}
      <View style={styles.shakeHintContainer}>
        <Text style={styles.shakeHint}>🎲 Nochmal schütteln</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    backgroundColor: Colors.backgroundCard,
  },

  // ── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
  },
  backPressable: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brandRed,
  },

  // ── Image ──────────────────────────────────────────────────────────────────
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.backgroundApp,
  },

  // ── Content area ──────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // ── Category badge ────────────────────────────────────────────────────────
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundApp,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },

  // ── Title ──────────────────────────────────────────────────────────────────
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },

  // ── Description ───────────────────────────────────────────────────────────
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
  },

  // ── Shake hint ─────────────────────────────────────────────────────────────
  shakeHintContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  shakeHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
