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
import {Colors} from '../../shared/tokens';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const ITEM_WIDTH = CARD_WIDTH * 0.58;
const ITEM_SPACING = 8;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;
const SIDE_PADDING = (CARD_WIDTH - ITEM_WIDTH) / 2;

interface Product {
  name: string;
  subtitle: string;
  price: string;
  rating: number;
  reviews: number;
  bgColor: string;
  shapeColor: string;
  accentColor: string;
}

const PRODUCTS: Product[] = [
  {
    name: 'Lilliebox 3 Rot',
    subtitle: 'Lilliebox 3',
    price: '109,99 €',
    rating: 4.5,
    reviews: 1525,
    bgColor: 'rgba(233,0,27,0.08)',
    shapeColor: 'rgba(233,0,27,0.18)',
    accentColor: '#e9001b',
  },
  {
    name: 'Lilliebox 3 Blau',
    subtitle: 'Lilliebox 3',
    price: '109,99 €',
    rating: 4.3,
    reviews: 982,
    bgColor: 'rgba(0,120,233,0.08)',
    shapeColor: 'rgba(0,120,233,0.18)',
    accentColor: '#0078e9',
  },
  {
    name: 'Lilliebox 2 Mint',
    subtitle: 'Lilliebox 2',
    price: '89,99 €',
    rating: 4.7,
    reviews: 2103,
    bgColor: 'rgba(108,206,225,0.12)',
    shapeColor: 'rgba(108,206,225,0.28)',
    accentColor: '#6ccee1',
  },
  {
    name: 'Lilliebox Starter',
    subtitle: 'Lilliebox',
    price: '69,99 €',
    rating: 4.2,
    reviews: 756,
    bgColor: 'rgba(255,152,0,0.08)',
    shapeColor: 'rgba(255,152,0,0.18)',
    accentColor: '#ff9800',
  },
];

/* ─── Animated carousel item with 3D rotation + scale ─────────────────── */
function CarouselItem({
  item,
  index,
  scrollX,
}: {
  item: Product;
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
        <View
          style={[styles.productShapeLarge, {backgroundColor: item.shapeColor}]}
        />
        <View
          style={[
            styles.productShapeSmall,
            {backgroundColor: item.accentColor, opacity: 0.3},
          ]}
        />
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
export default function ProductCard(): React.JSX.Element {
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
      setActiveIndex(Math.max(0, Math.min(idx, PRODUCTS.length - 1)));
    },
    [],
  );

  const product = PRODUCTS[activeIndex];
  const filledStars = Math.floor(product.rating);
  const emptyStars = 5 - filledStars;

  return (
    <View style={styles.cardShadow}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Lilliebox 3</Text>
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
            {PRODUCTS.map((p, i) => (
              <CarouselItem key={i} item={p} index={i} scrollX={scrollX} />
            ))}
          </Animated.ScrollView>

          {/* Pagination */}
          <View style={styles.pagination}>
            {PRODUCTS.map((_, i) => (
              <AnimatedDot key={i} index={i} scrollX={scrollX} />
            ))}
          </View>
        </View>

        {/* Product info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>

          <View style={styles.bottomRow}>
            <View style={styles.bottomLeft}>
              <View style={styles.ratingRow}>
                <Text style={styles.starFilled}>
                  {'★'.repeat(filledStars)}
                </Text>
                <Text style={styles.starEmpty}>
                  {'★'.repeat(emptyStars)}
                </Text>
                <Text style={styles.ratingText}>
                  {' '}
                  {product.rating} ({product.reviews})
                </Text>
              </View>
              <Text style={styles.price}>{product.price}</Text>
            </View>

            <Pressable
              onPress={() => {
                /* TODO */
              }}
              accessibilityRole="button"
              accessibilityLabel="Add to cart"
              style={styles.cartFab}>
              <Text style={styles.cartFabIcon}>+</Text>
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
  productShapeLarge: {
    width: '60%',
    height: '60%',
    borderRadius: 20,
  },
  productShapeSmall: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 13,
    right: 20,
    bottom: 20,
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
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  bottomLeft: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starFilled: {
    fontSize: 16,
    color: '#FFC107',
  },
  starEmpty: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 8,
  },
  cartFab: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.brandRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartFabIcon: {
    fontSize: 28,
    color: Colors.backgroundCard,
    fontWeight: '700',
  },
});
