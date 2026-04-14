import { requireNativeView } from 'expo';
import * as React from 'react';
import { Modal, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';

export interface DiscoverItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

interface NativeDiscoverOverlayProps {
  items: DiscoverItem[];
  visible: boolean;
  onItemSelect: (event: { nativeEvent: { id: string } }) => void;
  onDismiss: (event: { nativeEvent: Record<string, never> }) => void;
  style?: StyleProp<ViewStyle>;
}

const NativeView: React.ComponentType<NativeDiscoverOverlayProps> =
  requireNativeView('LillieShaker');

export interface DiscoverOverlayProps {
  items: DiscoverItem[];
  visible: boolean;
  onItemSelect: (id: string) => void;
  onDismiss: () => void;
}

export default function DiscoverOverlay({
  items,
  visible,
  onItemSelect,
  onDismiss,
}: DiscoverOverlayProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}>
      <NativeView
        items={items}
        visible={visible}
        onItemSelect={(e) => onItemSelect(e.nativeEvent.id)}
        onDismiss={() => onDismiss()}
        style={StyleSheet.absoluteFill}
      />
    </Modal>
  );
}
