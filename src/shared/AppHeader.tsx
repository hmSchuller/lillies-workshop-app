import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {SearchIcon, CartIcon, ProfileIcon} from './icons';
import {Colors} from './tokens';

export default function AppHeader({title}: {title: string}): React.JSX.Element {
  return (
    <View style={styles.header}>
      <Text style={styles.headerHeading}>{title}</Text>
      <View style={styles.headerIcons}>
        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Suchen">
          <SearchIcon size={28} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Warenkorb">
          <CartIcon size={28} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Profil">
          <ProfileIcon size={28} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundApp,
  },
  headerHeading: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.35,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
});
