import type { EventSubscription } from 'expo-modules-core';

// Lazily require expo-modules-core inside a function rather than at the top level.
// Importing it at module load time (before the Expo runtime is ready) causes a
// PlatformConstants crash on Android New Architecture in lazy bundle mode.
// Deferring the require to first use avoids that race condition.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _module: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModule(): any {
  if (!_module) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { requireNativeModule } = require('expo-modules-core');
    _module = requireNativeModule('LillieShaker');
  }
  return _module;
}

export function startListening(): void {
  // Note: In ExpoModules, observation starts automatically when the first
  // listener is added. This function is intentionally a no-op — it exists
  // to make the API explicit.
}

export function stopListening(): void {
  // Note: In ExpoModules, observation stops automatically when the last
  // listener is removed. This function is intentionally a no-op.
}

// TODO (Level 0): Wire JS to the native shake event.
//
// The native module emits an 'onShake' event via Expo Modules' event system.
// Use getModule().addListener('onShake', listener) to subscribe and return
// the resulting EventSubscription so callers can unsubscribe via .remove().
//
// For now this stub returns a no-op EventSubscription so the app still runs.
export function addShakeListener(listener: () => void): EventSubscription {
  // Replace this stub with the real implementation:
  //   return getModule().addListener('onShake', listener);
  void listener;
  return { remove: () => {} } as EventSubscription;
}

export { default as DiscoverOverlay, type DiscoverItem, type DiscoverOverlayProps } from './DiscoverOverlay';
