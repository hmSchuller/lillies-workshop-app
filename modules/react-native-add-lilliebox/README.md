# Exercise: Add Lilliebox (TurboModule + Native Flow)

Build a fully native, multi-screen "Add Lilliebox" experience from React Native.

This exercise is intentionally split into levels so participants can stop where it makes sense:

- **Level 0:** Codegen contract (TurboModule spec)
- **Level 1:** Result pattern (typed success/cancel payload across platforms)
- **Level 2:** Native owns navigation + flow orchestration
- **Level 3:** Modern native UI (SwiftUI + Jetpack Compose, multi-screen)

---

## File map

Most source files now carry a short header comment. This table covers the config-heavy files
(and `package.json`) that are easier to explain once in the README.

| File | Role |
|------|------|
| `package.json` | NPM manifest. Declares the package name, `main` entry, and the `codegenConfig` block (`name: RNAddLillieboxSpec`) that drives codegen on both platforms. |
| `react-native.config.js` | DX/helper wiring. Tells the RN CLI autolinking system that this package has native implementations on both iOS and Android. |
| `RNAddLilliebox.podspec` | Platform interop glue (iOS). CocoaPods spec that collects all iOS source files and calls `install_modules_dependencies` to wire up New Architecture support. |
| `android/build.gradle` | Platform interop glue (Android). Library build script enabling Compose, the React Native Gradle plugin, and declaring CameraX/ML Kit/Navigation/ViewModel dependencies. |
| `android/src/main/AndroidManifest.xml` | Platform interop glue (Android). Declares the `CAMERA` permission and registers `AddLillieboxActivity` as a non-exported component within this library. |

---

## What is stubbed vs provided

### Stubbed (you implement)

- `js/NativeAddLillieboxModule.ts` (Level 0)
- `js/launchAddLilliebox.ts` (Level 1)
- `ios/module/AddLillieboxResult.swift` (Level 1)
- `android/.../AddLillieboxResult.kt` (Level 1)
- `ios/module/AddLillieboxModule.mm` (Level 2)
- `android/.../AddLillieboxModule.kt` (Level 2)
- `android/.../AddLillieboxActivity.kt` (Level 2)
- `android/.../AddLillieboxNavGraph.kt` (Level 2)
- `ios/screens/AddLillieboxRootView.swift` (Level 2)
- `ios/screens/InputSelectionView.swift` (Level 3)
- `ios/screens/ManualInputView.swift` (Level 3)
- `ios/screens/QRScanView.swift` (Level 3)
- `android/.../screens/InputSelectionScreen.kt` (Level 3)
- `android/.../screens/ManualInputScreen.kt` (Level 3)
- `android/.../screens/QRScanScreen.kt` (Level 3)
- `android/.../screens/NFCScanScreen.kt` (Level 3)

### Provided (already complete)

- `ios/module/AddLillieboxFlowFactory.swift`
- `ios/module/AddLillieboxHostingController.swift`
- `ios/qrcamera/QRCameraViewController.{h,m}`
- `android/.../AddLillieboxViewModel.kt`
- `android/.../HasLillieboxLauncher.kt`
- `android/.../NativeAddLillieboxPackage.kt`
- `RNAddLilliebox.podspec`, `package.json`, `react-native.config.js`

> Workshop scope note
> - iOS focuses on QR + manual entry.
> - Android adds a simulated NFC branch to demonstrate one extra native-owned route without introducing CoreNFC setup on iOS.
> - The shared JS union still includes `'nfc'` because it models the superset of results returned by either platform.

### Progress markers

- **After Level 0:** your TypeScript spec is strict and codegen can generate the native module contract.
- **After Level 1:** iOS, Android, and JS all agree on the same completed/cancelled payload shape.
- **After Level 2:** one JS call opens a native modal flow and returns one final result.
- **After Level 3:** the placeholder screens are replaced with real SwiftUI / Compose screens.

---

## Level 0 - Codegen contract

### Goal
Define a strict TurboModule contract in `js/NativeAddLillieboxModule.ts`.

### 🟢 Hint 1
You need:
- `AddLillieboxResult` with strict unions
- `Spec extends TurboModule` with `launchAddLilliebox(): Promise<AddLillieboxResult>`
- `TurboModuleRegistry.getEnforcing<Spec>('NativeAddLillieboxModule')`

### 🟡 Hint 2
Use these unions:
- `status`: `'completed' | 'cancelled'`
- `addedVia`: `'qr' | 'manual' | 'nfc' | null`

### 💡 Knowledge bits

- `package.json` uses `"codegenConfig.name": "RNAddLillieboxSpec"` as the generated library/spec namespace. The runtime module name still comes from `TurboModuleRegistry.getEnforcing('NativeAddLillieboxModule')`.
- After `npx react-native codegen --platform all`, inspect generated files such as `build/generated/ios/ReactCodegen/RNAddLillieboxSpec/RNAddLillieboxSpec.h` and `android/app/build/generated/source/codegen/java/com/facebook/fbreact/specs/NativeAddLillieboxModuleSpec.java`.
- `getEnforcing(...)` fails fast if the module is missing from autolinking or registration. `TurboModuleRegistry.get(...)` would return `null` instead.
- The starter uses `never` on purpose: it reminds you that the union is unfinished and prevents fake placeholder result objects from accidentally looking "correct".
- If codegen fails with `TypeScript type annotation 'TSNeverKeyword' is unsupported`, that is the expected starter-state failure. Replace the `never` placeholders with the real unions, then rerun codegen.

### 🔴 Hint 3 - Full solution

<details>
<summary><code>js/NativeAddLillieboxModule.ts</code></summary>

```ts
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface AddLillieboxResult {
  status: 'completed' | 'cancelled';
  serialNumber: string | null;
  addedVia: 'qr' | 'manual' | 'nfc' | null;
}

export interface Spec extends TurboModule {
  launchAddLilliebox(): Promise<AddLillieboxResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAddLillieboxModule');
```

</details>

### Regenerate artifacts

```sh
# project root
npx react-native codegen --platform all

# iOS
cd ios && pod install && cd ..
```

---

## Level 1 - Result pattern

### Goal
Return a stable, typed result shape from both native platforms to JS.

Canonical shape:

```ts
{
  status: 'completed' | 'cancelled',
  serialNumber: string | null,
  addedVia: 'qr' | 'manual' | 'nfc' | null,
}
```

### 🟢 Hint 1
Implement conversion helpers on native:
- iOS: `toDictionary()`, `cancelled`
- Android: `toBundle()`, `toWritableMap()`, `fromIntent()` + `CANCELLED`

### 🟡 Hint 2
When cancelled:
- status = `"cancelled"`
- serialNumber = `null`
- addedVia = `null`

### 💡 Knowledge bits

- On iOS, `NSDictionary` cannot store `nil`. If you want JS to receive `null`, you must write `NSNull()`. Otherwise the key disappears completely.
- On Android, `Activity` cancellation/back-press can produce a `null` `Intent` or missing extras. `fromIntent()` is where you collapse those cases into one `CANCELLED` sentinel.
- Once native returns the canonical shape consistently, the JS wrapper can stay very small and simply forward that typed result.

### 🔴 Hint 3 - Full solutions

<details>
<summary><code>ios/module/AddLillieboxResult.swift</code></summary>

```swift
import Foundation

/// The result returned to JS after the Add Lilliebox flow completes.
///
/// - `status`: "completed" | "cancelled"
/// - `serialNumber`: the scanned/entered serial number, or nil if cancelled
/// - `addedVia`: "qr" | "manual" | nil
struct AddLillieboxResult {
    let status: String
    let serialNumber: String?
    let addedVia: String?

    /// Converts the result to a dictionary suitable for resolving an RCT promise.
    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = ["status": status]
        dict["serialNumber"] = serialNumber ?? NSNull()
        dict["addedVia"] = addedVia ?? NSNull()
        return dict
    }

    /// Convenience factory for a cancelled result.
    static var cancelled: AddLillieboxResult {
        AddLillieboxResult(status: "cancelled", serialNumber: nil, addedVia: nil)
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/AddLillieboxResult.kt</code></summary>

```kotlin
package com.nativeflowexercise

import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

private const val KEY_STATUS = "status"
private const val KEY_SERIAL_NUMBER = "serialNumber"
private const val KEY_ADDED_VIA = "addedVia"

data class AddLillieboxResult(
    val status: String,       // "completed" | "cancelled"
    val serialNumber: String?,
    val addedVia: String?     // "qr" | "manual" | "nfc" | null
) {

    /** Pack into a Bundle for use with Activity.setResult(). */
    fun toBundle(): Bundle = Bundle().apply {
        putString(KEY_STATUS, status)
        serialNumber?.let { putString(KEY_SERIAL_NUMBER, it) }
        addedVia?.let { putString(KEY_ADDED_VIA, it) }
    }

    /** Build a WritableMap for resolving a React Native promise. */
    fun toWritableMap(): WritableMap = Arguments.createMap().apply {
        putString(KEY_STATUS, status)
        serialNumber?.let { putString(KEY_SERIAL_NUMBER, it) } ?: putNull(KEY_SERIAL_NUMBER)
        addedVia?.let { putString(KEY_ADDED_VIA, it) } ?: putNull(KEY_ADDED_VIA)
    }

    companion object {
        /** Sentinel value returned whenever the flow is cancelled or no data is available. */
        val CANCELLED = AddLillieboxResult("cancelled", null, null)

        /**
         * Reconstruct from an Activity result [Intent].
         *
         * Returns [CANCELLED] when the intent is null or missing the expected extras -
         * this covers both explicit cancellations and system back-presses that never
         * called [setResult].
         */
        fun fromIntent(intent: Intent?): AddLillieboxResult {
            val bundle = intent?.extras ?: return CANCELLED
            return AddLillieboxResult(
                status = bundle.getString(KEY_STATUS) ?: return CANCELLED,
                serialNumber = bundle.getString(KEY_SERIAL_NUMBER),
                addedVia = bundle.getString(KEY_ADDED_VIA),
            )
        }
    }
}
```

</details>

<details>
<summary><code>js/launchAddLilliebox.ts</code> (baseline solution)</summary>

```ts
import NativeAddLillieboxModule from './NativeAddLillieboxModule';
import type {AddLillieboxResult} from './NativeAddLillieboxModule';

export type {AddLillieboxResult};

export function launchAddLilliebox(): Promise<AddLillieboxResult> {
  console.log('[RNAddLilliebox] JS launcher called');
  return NativeAddLillieboxModule.launchAddLilliebox();
}
```

</details>

---

## Level 2 - Native owns navigation

### Goal
JS triggers one method. Native handles the complete modal flow lifecycle.

> Dependency note
> - Level 2 builds on Level 1.
> - If the modal opens and closes but JS always receives `{status:'cancelled', ...}`, the remaining bug is usually in the `AddLillieboxResult` helpers rather than the navigation code.

### 🟢 Hint 1
iOS (`AddLillieboxModule.mm`):
- prevent re-entry with `_isPresenting`
- find top VC (`RCTPresentedViewController()`)
- present `AddLillieboxHostingController` via factory
- resolve promise when flow completes and modal is dismissed

Android:
- module stores pending promise in `AddLillieboxViewModel`
- launches `AddLillieboxActivity`
- activity result maps back using `AddLillieboxResult.fromIntent`

### 🟡 Hint 2
Compose/SwiftUI roots should drive navigation state and only return one final result object upward.

### 💡 Knowledge bits

- `getTurboModule(...)` is the New Architecture hook that returns the codegen-generated JSI wrapper. You usually keep it exactly as generated and focus your exercise work inside the exported methods.
- `UiThreadUtil.runOnUiThread` matters because `currentActivity`, modal presentation, and activity launches must happen on the UI thread in RN New Architecture / Bridgeless mode.
- `_isPresenting` on iOS and `pendingPromise` on Android solve the same problem: prevent two native flows from racing at once.

### 🔴 Hint 3 - Full solutions

<details>
<summary><code>ios/module/AddLillieboxModule.mm</code></summary>

```objc
#import "AddLillieboxModule.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTTurboModule.h>
#import <UIKit/UIKit.h>
#import "RNAddLilliebox-Swift.h"
#import "RNAddLillieboxSpec.h"

using namespace facebook::react;

@interface NativeAddLillieboxModule () <RCTTurboModule, NativeAddLillieboxModuleSpec>
@end

@implementation NativeAddLillieboxModule {
  BOOL _isPresenting;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (std::shared_ptr<TurboModule>)getTurboModule:(const ObjCTurboModule::InitParams &)params
{
  return std::make_shared<NativeAddLillieboxModuleSpecJSI>(params);
}

- (void)launchAddLilliebox:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  if (self->_isPresenting) {
    reject(@"E_LILLIEBOX_IN_PROGRESS", @"The Add Lilliebox flow is already open.", nil);
    return;
  }

  UIViewController *topVC = RCTPresentedViewController();
  if (topVC == nil) {
    reject(@"E_NO_VIEW_CONTROLLER", @"Could not find a top view controller to present on.", nil);
    return;
  }

  self->_isPresenting = YES;

  __block __weak UIViewController *weakHostingController = nil;
  AddLillieboxFlowFactory *factory = [AddLillieboxFlowFactory new];
  UIViewController *hostingController = [factory makeHostingControllerWithOnComplete:^(NSDictionary *result) {
    dispatch_async(dispatch_get_main_queue(), ^{
      self->_isPresenting = NO;
      UIViewController *vc = weakHostingController;
      if (vc) {
          [vc dismissViewControllerAnimated:YES completion:^{
              resolve(result);
          }];
      } else {
          // VC already dismissed by the system - resolve immediately
          resolve(result);
      }
    });
  }];
  weakHostingController = hostingController;

  [topVC presentViewController:hostingController animated:YES completion:nil];
}

@end

Class _Nonnull NativeAddLillieboxModuleCls(void)
{
  return NativeAddLillieboxModule.class;
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/AddLillieboxModule.kt</code></summary>

```kotlin
package com.nativeflowexercise

import android.content.Intent
import androidx.lifecycle.ViewModelProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

/**
 * TurboModule that launches [AddLillieboxActivity] and bridges the result
 * back to the React Native caller as a resolved/rejected Promise.
 */
class AddLillieboxModule(reactContext: ReactApplicationContext) :
    NativeAddLillieboxModuleSpec(reactContext) {

    override fun launchAddLilliebox(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val activity = currentActivity
                ?: return@runOnUiThread promise.reject("E_NO_ACTIVITY", "No activity is currently attached.")

            val launcher = activity as? HasLillieboxLauncher
                ?: return@runOnUiThread promise.reject("E_NO_LAUNCHER", "Host activity must implement HasLillieboxLauncher.")

            val viewModel = ViewModelProvider(
                activity as androidx.fragment.app.FragmentActivity
            )[AddLillieboxViewModel::class.java]

            if (viewModel.pendingPromise != null) {
                promise.reject(
                    "E_IN_PROGRESS",
                    "An Add Lilliebox flow is already in progress."
                )
                return@runOnUiThread
            }

            viewModel.pendingPromise = promise

            val intent = Intent(activity, AddLillieboxActivity::class.java)
            launcher.launchAddLillieboxActivity(intent)
        }
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/AddLillieboxActivity.kt</code></summary>

```kotlin
package com.nativeflowexercise

import android.content.Intent
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.material3.MaterialTheme

class AddLillieboxActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                AddLillieboxNavGraph(
                    onComplete = { result ->
                        val data = Intent().apply { putExtras(result.toBundle()) }
                        setResult(RESULT_OK, data)
                        finish()
                    },
                    onCancel = {
                        setResult(RESULT_CANCELED)
                        finish()
                    }
                )
            }
        }
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/AddLillieboxNavGraph.kt</code></summary>

```kotlin
package com.nativeflowexercise

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.nativeflowexercise.screens.InputSelectionScreen
import com.nativeflowexercise.screens.ManualInputScreen
import com.nativeflowexercise.screens.NFCScanScreen
import com.nativeflowexercise.screens.QRScanScreen

@Composable
fun AddLillieboxNavGraph(
    onComplete: (AddLillieboxResult) -> Unit,
    onCancel: () -> Unit,
) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "inputSelection") {

        composable("inputSelection") {
            InputSelectionScreen(
                onSelectQR = { navController.navigate("qrScan") },
                onSelectManual = { navController.navigate("manualInput") },
                onSelectNFC = { navController.navigate("nfcScan") },
                onCancel = onCancel,
            )
        }

        composable("qrScan") {
            QRScanScreen(
                onScanned = { serial ->
                    onComplete(AddLillieboxResult("completed", serial, "qr"))
                },
                onCancel = { navController.popBackStack() },
            )
        }

        composable("manualInput") {
            ManualInputScreen(
                onSubmit = { serial ->
                    onComplete(AddLillieboxResult("completed", serial, "manual"))
                },
                onCancel = { navController.popBackStack() },
            )
        }

        composable("nfcScan") {
            NFCScanScreen(
                onDetected = { serial ->
                    onComplete(AddLillieboxResult("completed", serial, "nfc"))
                },
                onCancel = { navController.popBackStack() },
            )
        }
    }
}
```

</details>

<details>
<summary><code>ios/screens/AddLillieboxRootView.swift</code></summary>

```swift
import Foundation
import SwiftUI

enum AddLillieboxDestination: Hashable {
    case qrScan
    case manualInput
}

struct AddLillieboxRootView: View {

    let onComplete: (NSDictionary) -> Void

    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            InputSelectionView(
                onSelectQR: {
                    path.append(AddLillieboxDestination.qrScan)
                },
                onSelectManual: {
                    path.append(AddLillieboxDestination.manualInput)
                },
                onCancel: {
                    onComplete(AddLillieboxResult.cancelled.toDictionary() as NSDictionary)
                }
            )
            .navigationDestination(for: AddLillieboxDestination.self) { destination in
                switch destination {
                case .qrScan:
                    QRScanView(
                        onScan: { serialNumber in
                            onComplete(AddLillieboxResult(
                                status: "completed",
                                serialNumber: serialNumber,
                                addedVia: "qr"
                            ).toDictionary() as NSDictionary)
                        },
                        onCancel: {
                            path.removeLast()
                        }
                    )
                case .manualInput:
                    ManualInputView(
                        onSubmit: { serialNumber in
                            onComplete(AddLillieboxResult(
                                status: "completed",
                                serialNumber: serialNumber,
                                addedVia: "manual"
                            ).toDictionary() as NSDictionary)
                        },
                        onCancel: {
                            path.removeLast()
                        }
                    )
                }
            }
        }
    }
}
```

</details>

---

## Level 3 - SwiftUI + Compose multi-screen UI

### Goal
Implement all screen UIs natively with platform idioms.

### 🟢 Hint 1
iOS:
- `InputSelectionView` (entry options)
- `ManualInputView` (validated text input)
- `QRScanView` (`UIViewControllerRepresentable` + Coordinator delegate bridge)

Android:
- `InputSelectionScreen`
- `ManualInputScreen`
- `QRScanScreen` (CameraX + ML Kit)
- `NFCScanScreen` (simulated NFC)

### 🟡 Hint 2
For `QRScanView` (SwiftUI bridge), keep `coordinator.parent` updated in `updateUIViewController` to avoid stale closure captures.

### 💡 Knowledge bits

- The iOS workshop variant intentionally stops at QR + manual. Android adds a simulated NFC branch so participants can practice one more native navigation path without introducing CoreNFC setup on iOS.
- `QRScanView` is a classic SwiftUI bridge: `makeUIViewController` creates the UIKit controller, `Coordinator` receives delegate callbacks, and `updateUIViewController` keeps closures/state fresh across re-renders.
- On Android, treat the "Simulate QR" button as a stepping stone: get the navigation/result wiring working first, then swap in CameraX + ML Kit.

### 🔴 Hint 3 - Full solutions

<details>
<summary><code>ios/screens/InputSelectionView.swift</code></summary>

```swift
import SwiftUI

struct InputSelectionView: View {

    var onSelectQR: () -> Void
    var onSelectManual: () -> Void
    var onCancel: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text("Wie möchtest du deine Lilliebox hinzufügen?")
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
                .padding(.top, 32)

            Button {
                onSelectQR()
            } label: {
                Label("QR-Code scannen", systemImage: "qrcode.viewfinder")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(red: 0xc8 / 255, green: 0xdf / 255, blue: 0xc0 / 255))
                    .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))
                    .cornerRadius(12)
            }
            .padding(.horizontal)

            Button {
                onSelectManual()
            } label: {
                Label("Seriennummer eingeben", systemImage: "keyboard")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(red: 0xc8 / 255, green: 0xdf / 255, blue: 0xc0 / 255))
                    .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))
                    .cornerRadius(12)
            }
            .padding(.horizontal)

            Button("Abbrechen") {
                onCancel()
            }
            .foregroundColor(Color(red: 0xd3 / 255, green: 0x0f / 255, blue: 0x2d / 255))
            .padding(.top, 8)

            Spacer()
        }
        .navigationTitle("Lilliebox hinzufügen")
        .navigationBarTitleDisplayMode(.inline)
    }
}
```

</details>

<details>
<summary><code>ios/screens/ManualInputView.swift</code></summary>

```swift
import SwiftUI

struct ManualInputView: View {

    @State private var serialNumber = ""

    var onSubmit: (String) -> Void
    var onCancel: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Text("Seriennummer eingeben")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))

            TextField("Seriennummer", text: $serialNumber)
                .textFieldStyle(.roundedBorder)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.characters)
                .padding(.horizontal)

            Button {
                onSubmit(serialNumber.trimmingCharacters(in: .whitespaces))
            } label: {
                Text("Bestätigen")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(trimmedInput.isEmpty
                        ? Color.gray.opacity(0.3)
                        : Color(red: 0xd3 / 255, green: 0x0f / 255, blue: 0x2d / 255))
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .disabled(trimmedInput.isEmpty)
            .padding(.horizontal)

            Button("Abbrechen") {
                onCancel()
            }
            .foregroundColor(Color(red: 0xd3 / 255, green: 0x0f / 255, blue: 0x2d / 255))

            Spacer()
        }
        .padding(.top, 32)
        .navigationTitle("Manuell")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var trimmedInput: String {
        serialNumber.trimmingCharacters(in: .whitespaces)
    }
}
```

</details>

<details>
<summary><code>ios/screens/QRScanView.swift</code></summary>

```swift
import SwiftUI

// NOTE: QRCameraViewController is an Objective-C class.
// For Swift to use it, add "QRCameraViewController.h" to your project's
// Objective-C Bridging Header (e.g. DatePickerWorkshop-Bridging-Header.h).

struct QRScanView: UIViewControllerRepresentable {

    var onScan: (String) -> Void
    var onCancel: () -> Void

    final class Coordinator: NSObject, QRCameraViewControllerDelegate {
        var parent: QRScanView

        init(_ parent: QRScanView) {
            self.parent = parent
        }

        func qrCameraViewController(_ vc: QRCameraViewController, didScanCode code: String) {
            parent.onScan(code)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> QRCameraViewController {
        let vc = QRCameraViewController()
        vc.delegate = context.coordinator
        return vc
    }

    func updateUIViewController(_ uiViewController: QRCameraViewController, context: Context) {
        context.coordinator.parent = self
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/screens/InputSelectionScreen.kt</code></summary>

```kotlin
package com.nativeflowexercise.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

private val ToniesNavy = Color(0xFF1e2939)

@Composable
fun InputSelectionScreen(
    onSelectQR: () -> Unit,
    onSelectManual: () -> Unit,
    onSelectNFC: () -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "Lilliebox hinzufügen",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = ToniesNavy,
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Wie möchtest du deine Lilliebox verbinden?",
            style = MaterialTheme.typography.bodyMedium,
            color = ToniesNavy.copy(alpha = 0.7f),
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(40.dp))

        SelectionButton(label = "📷  QR-Code scannen", onClick = onSelectQR)
        Spacer(modifier = Modifier.height(12.dp))
        SelectionButton(label = "⌨️  Seriennummer eingeben", onClick = onSelectManual)
        Spacer(modifier = Modifier.height(12.dp))
        SelectionButton(label = "📡  NFC-Chip scannen", onClick = onSelectNFC)

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedButton(
            onClick = onCancel,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Abbrechen")
        }
    }
}

@Composable
private fun SelectionButton(label: String, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp),
        colors = ButtonDefaults.buttonColors(containerColor = ToniesNavy),
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Medium,
        )
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/screens/ManualInputScreen.kt</code></summary>

```kotlin
package com.nativeflowexercise.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

private val ToniesNavy = Color(0xFF1e2939)
private val ToniesRed = Color(0xFFd30f2d)

@Composable
fun ManualInputScreen(
    onSubmit: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    var serialNumber by remember { mutableStateOf("") }
    val isValid = serialNumber.isNotBlank()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "Seriennummer eingeben",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = ToniesNavy,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Die Seriennummer befindet sich auf der Unterseite deiner Lilliebox.",
            style = MaterialTheme.typography.bodyMedium,
            color = ToniesNavy.copy(alpha = 0.7f),
        )

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = serialNumber,
            onValueChange = { serialNumber = it.uppercase() },
            label = { Text("Seriennummer") },
            placeholder = { Text("z. B. LB-2024-XXXX") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(
                capitalization = KeyboardCapitalization.Characters,
                keyboardType = KeyboardType.Ascii,
                imeAction = ImeAction.Done,
            ),
            keyboardActions = KeyboardActions(
                onDone = { if (isValid) onSubmit(serialNumber.trim()) }
            ),
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { onSubmit(serialNumber.trim()) },
            enabled = isValid,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ToniesRed),
        ) {
            Text(
                text = "Bestätigen",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = onCancel,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Abbrechen")
        }
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/screens/QRScanScreen.kt</code> (full CameraX + ML Kit solution)</summary>

```kotlin
package com.nativeflowexercise.screens

import android.Manifest
import android.content.pm.PackageManager
import android.util.Size
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

@Composable
fun QRScanScreen(
    onScanned: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context, Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }
    var permissionDenied by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
    ) { granted ->
        hasPermission = granted
        if (!granted) permissionDenied = true
    }

    LaunchedEffect(Unit) {
        if (!hasPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    when {
        permissionDenied -> PermissionDeniedContent(onCancel)
        !hasPermission -> LoadingContent()
        else -> CameraContent(
            lifecycleOwner = lifecycleOwner,
            onScanned = onScanned,
            onCancel = onCancel,
        )
    }
}

@Composable
private fun PermissionDeniedContent(onCancel: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(modifier = Modifier.weight(1f))
        Text(
            text = "Kamerazugriff verweigert",
            style = MaterialTheme.typography.headlineSmall,
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "Um QR-Codes scannen zu können, erlaube bitte den Kamerazugriff " +
                    "in den App-Einstellungen deines Geräts.",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.weight(1f))
        OutlinedButton(onClick = onCancel, modifier = Modifier.fillMaxWidth()) {
            Text("Zurück")
        }
    }
}

@Composable
private fun LoadingContent() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun CameraContent(
    lifecycleOwner: androidx.lifecycle.LifecycleOwner,
    onScanned: (String) -> Unit,
    onCancel: () -> Unit,
) {
    val scannedOnce = remember { AtomicBoolean(false) }
    val analyzerExecutor = remember { Executors.newSingleThreadExecutor() }

    Column(modifier = Modifier.fillMaxSize()) {
        AndroidView(
            factory = { ctx ->
                val previewView = PreviewView(ctx)

                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                cameraProviderFuture.addListener(
                    {
                        val cameraProvider = cameraProviderFuture.get()

                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(previewView.surfaceProvider)
                        }

                        val imageAnalysis = ImageAnalysis.Builder()
                            .setTargetResolution(Size(1280, 720))
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build()

                        imageAnalysis.setAnalyzer(analyzerExecutor, QRAnalyzer { value ->
                            if (scannedOnce.compareAndSet(false, true)) {
                                cameraProvider.unbindAll()
                                onScanned(value)
                            }
                        })

                        try {
                            cameraProvider.unbindAll()
                            cameraProvider.bindToLifecycle(
                                lifecycleOwner,
                                CameraSelector.DEFAULT_BACK_CAMERA,
                                preview,
                                imageAnalysis,
                            )
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    },
                    ContextCompat.getMainExecutor(ctx),
                )

                previewView
            },
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
        )

        Button(
            onClick = onCancel,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
        ) {
            Text("Abbrechen")
        }
    }
}

private class QRAnalyzer(
    private val onResult: (String) -> Unit,
) : ImageAnalysis.Analyzer {

    private val scanner = BarcodeScanning.getClient()

    @ExperimentalGetImage
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage == null) {
            imageProxy.close()
            return
        }

        val inputImage = InputImage.fromMediaImage(
            mediaImage,
            imageProxy.imageInfo.rotationDegrees,
        )

        scanner.process(inputImage)
            .addOnSuccessListener { barcodes ->
                barcodes
                    .firstOrNull { it.valueType == Barcode.TYPE_TEXT || it.rawValue != null }
                    ?.rawValue
                    ?.let { onResult(it) }
            }
            .addOnCompleteListener {
                imageProxy.close()
            }
    }
}
```

</details>

<details>
<summary><code>android/src/main/java/com/nativeflowexercise/screens/NFCScanScreen.kt</code></summary>

```kotlin
package com.nativeflowexercise.screens

import androidx.compose.animation.core.EaseInOut
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.random.Random

private val ToniesNavy = Color(0xFF1e2939)
private val ToniesGreen = Color(0xFFc8dfc0)
private val ToniesRed = Color(0xFFd30f2d)

@Composable
fun NFCScanScreen(
    onDetected: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    val infiniteTransition = rememberInfiniteTransition(label = "nfcPulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 900, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "pulseScale",
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 900, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "pulseAlpha",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "NFC-Chip scannen",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = ToniesNavy,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Halte dein Handy an die Lilliebox.",
            style = MaterialTheme.typography.bodyMedium,
            color = ToniesNavy.copy(alpha = 0.7f),
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(48.dp))

        Box(contentAlignment = Alignment.Center) {
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .graphicsLayer {
                        scaleX = pulseScale
                        scaleY = pulseScale
                        alpha = pulseAlpha * 0.35f
                    }
                    .background(ToniesGreen, CircleShape),
            )
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(ToniesNavy, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Text(text = "📡", fontSize = 36.sp)
            }
        }

        Spacer(modifier = Modifier.height(48.dp))

        Text(
            text = "Warte auf NFC-Signal ...",
            style = MaterialTheme.typography.bodySmall,
            color = ToniesNavy.copy(alpha = 0.5f),
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = { onDetected(generateFakeSerial()) },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ToniesRed),
        ) {
            Text(
                text = "NFC simulieren",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = onCancel,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Abbrechen")
        }
    }
}

private fun generateFakeSerial(): String {
    val suffix = Random.nextInt(1000, 9999)
    return "NFC-LB-$suffix"
}
```

</details>

---

## Build + run checklist

```sh
# 1) regenerate codegen
npx react-native codegen --platform all

# 2) iOS pods
cd ios && pod install && cd ..

# 3) run
yarn ios
# or
yarn android
```

### Acceptance checks

- Tapping "Lilliebox einrichten" opens a native flow
- Completing QR/manual/NFC returns `{status:'completed', serialNumber, addedVia}`
- Cancelling returns `{status:'cancelled', serialNumber:null, addedVia:null}`
- Android back/cancel also maps to cancelled sentinel

---

## Troubleshooting

- **`NativeAddLillieboxModule` not found**
  - run codegen + rebuild; ensure package is linked/autolinked
- **TypeScript says `'completed'` / `null` is not assignable to `never`**
  - finish Level 0 first; the starter aliases intentionally use `never` until you replace them with the real unions
- **iOS result is missing `serialNumber` / `addedVia` keys**
  - use `NSNull()` when the Swift value is `nil`; plain `nil` removes the key from `NSDictionary`
- **iOS modal doesn't show**
  - verify `RCTPresentedViewController()` is non-null and launch on main queue
- **Android `currentActivity` is unexpectedly null**
  - keep the access inside `UiThreadUtil.runOnUiThread { ... }` before launching the activity
- **Android promise never resolves**
  - verify host activity implements `HasLillieboxLauncher` and clears `pendingPromise`
- **QR screen crashes on Android**
  - check camera permission + CameraX/ML Kit dependencies and lifecycle binding
