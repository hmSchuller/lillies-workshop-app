import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../shared/tokens';

interface SetupLillieboxCardProps {
  onSetup: () => void;
}

export default function SetupLillieboxCard({
  onSetup,
}: SetupLillieboxCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.container}>
        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>
            Du hast eine neue{'\n'}Lilliebox?
          </Text>
        </View>

        {/* CTA button */}
        <Pressable
          style={styles.button}
          onPress={onSetup}
          accessibilityRole="button"
          accessibilityLabel="Jetzt einrichten">
          <Text style={styles.buttonText}>Jetzt einrichten</Text>
        </Pressable>
      </View>

      {/* Device image */}
      <Image
        source={require('../../../assets/toniebox-device.png')}
        style={styles.deviceImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#c8dfc0',
    borderRadius: 24,
    overflow: 'hidden',
  },
  container: {
    paddingLeft: 32,
    paddingTop: 32,
  },
  headingContainer: {
    maxWidth: 250,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 37.5,
    color: Colors.textPrimary,
    letterSpacing: 0.4,
  },
  button: {
    backgroundColor: Colors.deepRed,
    height: 60,
    width: 215,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
    zIndex: 1,
  },
  buttonText: {
    color: Colors.backgroundCard,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: -0.44,
  },
  deviceImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 134,
    height: 145,
  },
});
