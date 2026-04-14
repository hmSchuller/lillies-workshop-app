# Lillies App

The shared workshop host app. It simulates a simplified Tonies-style product browsing and device management experience — the context in which you'll build and wire all native features during the workshop.

**React Native 0.83 · New Architecture only · Expo Modules**

📸 [Screenshots (Android)](./screenshots/android/)

---

## Setup

### Requirements

| Tool | Version |
|------|---------|
| Node.js | ≥ 22.11.0 |
| Xcode | 16+ |
| iOS Simulator | iOS 16+ |
| Android Studio | Latest stable |
| Android SDK | API 36 |
| NDK | 27.1.12297006 |
| CocoaPods | Latest stable |

### Install

```sh
yarn install
```

### iOS

```sh
cd ios && pod install && cd ..
yarn ios
```

### Android

```sh
yarn android
```

---

## Structure

```
lillies-app/
├── App.tsx                          # navigation root
├── src/
│   ├── data/lillies.ts              # mock product data
│   ├── features/
│   │   ├── start/                   # Start tab — product list + detail
│   │   ├── categories/              # Categories tab
│   │   ├── gratis/                  # Gratis tab
│   │   ├── meins/                   # Meins tab — TurboModule exercise integration point
│   │   └── studio/                  # Studio tab — NitroModule exercise integration point
│   ├── navigation/types.ts          # typed navigation params
│   └── shared/                      # AppHeader, icons, design tokens
└── modules/                         # native module packages (each is an exercise)
    ├── react-native-date-picker-exercise/
    ├── react-native-add-lilliebox/
    ├── react-native-studio-recorder/
    └── lillie-shaker/
```

---

## Exercises

Each module in `modules/` is a self-contained exercise. Open its `README.md` to get started.

| Module | Exercise | Native technology |
|--------|----------|-------------------|
| `react-native-date-picker-exercise` | Build a Fabric date-picker component | Fabric + Codegen · iOS UIDatePicker · Android MaterialDatePicker |
| `react-native-add-lilliebox` | Build a TurboModule that launches a native multi-screen flow | TurboModule + Codegen · SwiftUI (iOS) · Compose (Android) |
| `react-native-add-lilliebox` | Migrate `QRCameraViewController` from ObjC to Swift | ObjC → Swift interop |
| `react-native-studio-recorder` | Build a NitroModule for audio recording with a live waveform | NitroModules HybridObject · AVAudioEngine (iOS) · MediaRecorder (Android) |
| `lillie-shaker` | Build an Expo Module that emits shake events | Expo Modules DSL · CoreMotion (iOS) · SensorManager (Android) |

The Sentry exercise integrates directly into the app's `ios/` and `android/` directories — see `ios/AppDelegate.swift` and `android/app/src/main/java/.../SentryStartup.kt`.
