import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { LillyProduct } from '../data/lillies';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { product: LillyProduct };
};

export type TabParamList = {
  Start: undefined;
  Kategorien: undefined;
  Gratis: undefined;
  Studio: undefined;
  Meins: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
  BottomTabScreenProps<TabParamList, T>;
