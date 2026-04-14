import * as React from 'react';
import {useState, useCallback} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import {Colors} from './tokens';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const ITEM_WIDTH = CARD_WIDTH * 0.58;
const ITEM_SPACING = 8;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;
const SIDE_PADDING = (CARD_WIDTH - ITEM_WIDTH) / 2;

interface ContentItem {
  title: string;
  duration: string;
  bgColor: string;
  shapeColor: string;
  accentColor: string;
  ctaLabel: string;
}

const CONTENT_ITEMS: ContentItem[] = [
  {
    title: 'Kleiner Otter, großes Herz',
    duration: '5:12',
    bgColor: '#c7e5cc',
    shapeColor: '#a5d6a7',
    accentColor: Colors.brandRed,
    ctaLabel: 'Jetzt\nreinhören',
  },
  {
    title: 'Der mutige Bär im Wald',
    duration: '8:34',
    bgColor: '#ffe0b2',
    shapeColor: '#ffcc80',
    accentColor: '#e65100',
    ctaLabel: 'Jetzt\nreinhören',
  },
  {
    title: 'Die kleine Eule Lilu',
    duration: '6:45',
    bgColor: '#b3e5fc',
    shapeColor: '#81d4fa',
    accentColor: '#0288d1',
    ctaLabel: 'Jetzt\nreinhören',
  },
  {
    title: 'Abenteuer am Fluss',
    duration: '4:22',
    bgColor: '#f3e5f5',
    shapeColor: '#ce93d8',
    accentColor: '#7b1fa2',
    ctaLabel: 'Jetzt\nreinhören',
  },
];

/* ─── Animated carousel item with 3D rotation + scale ─────────────────── */
function CarouselItem({
  item,
  index,
  scrollX,
}: {
  item: ContentItem;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.55, 1, 0.55],
      Extrapolation.CLAMP,
    );
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-20, 0, 20],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{translateX}, {scale}],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {width: ITEM_WIDTH, marginHorizontal: ITEM_SPACING / 2},
        animatedStyle,
      ]}>
      <View style={[styles.carouselItem, {backgroundColor: item.bgColor}]}>
        {/* Main shape */}
        <View
          style={[styles.contentShapeLarge, {backgroundColor: item.shapeColor}]}
        />
        {/* CTA bubble */}
        <View style={[styles.ctaBubble, {backgroundColor: item.accentColor}]}>
          <Text style={styles.ctaText}>{item.ctaLabel}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

/* ─── Animated pagination dot ─────────────────────────────────────────── */
function AnimatedDot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP,
    );
    const dotOpacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP,
    );
    return {width, opacity: dotOpacity};
  });

  return (
    <Animated.View
      style={[styles.dot, {backgroundColor: Colors.brandRed}, animatedStyle]}
    />
  );
}

/* ─── Main component ──────────────────────────────────────────────────── */
export default function ContentCard(): React.JSX.Element {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(
        event.nativeEvent.contentOffset.x / SNAP_INTERVAL,
      );
      setActiveIndex(Math.max(0, Math.min(idx, CONTENT_ITEMS.length - 1)));
    },
    [],
  );

  const content = CONTENT_ITEMS[activeIndex];

  return (
    <View style={styles.cardShadow}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Gratis-Inhalte</Text>
          <Text style={styles.headerLink}>Entdecken</Text>
        </View>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: SIDE_PADDING - ITEM_SPACING / 2,
              alignItems: 'center',
            }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleMomentumEnd}>
            {CONTENT_ITEMS.map((item, i) => (
              <CarouselItem key={i} item={item} index={i} scrollX={scrollX} />
            ))}
          </Animated.ScrollView>

          {/* Pagination */}
          <View style={styles.pagination}>
            {CONTENT_ITEMS.map((_, i) => (
              <AnimatedDot key={i} index={i} scrollX={scrollX} />
            ))}
          </View>
        </View>

        {/* Content info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{content.title}</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.duration}>{content.duration}</Text>
            <Pressable
              onPress={() => {
                /* TODO */
              }}
              accessibilityRole="button"
              accessibilityLabel="Play content"
              style={styles.playFab}>
              <Text style={styles.playIcon}>▶</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 20,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
  },
  headerLink: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.brandRed,
  },

  /* Carousel */
  carouselContainer: {
    height: 300,
  },
  carouselItem: {
    height: 250,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentShapeLarge: {
    width: '70%',
    height: '70%',
    borderRadius: 22,
  },
  ctaBubble: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 20,
  },
  ctaText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.backgroundCard,
    textAlign: 'center',
  },

  /* Pagination */
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  /* Info section */
  infoSection: {
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  duration: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  playFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brandRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: Colors.backgroundCard,
  },
});
