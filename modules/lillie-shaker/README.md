# Exercise: Lillie Shaker (Expo Module)

Build a shake-gesture detector and a native overlay as an Expo Module — using Expo Modules Core's event system on iOS (CMMotionManager) and Android (SensorManager).

This exercise is split into levels so participants can choose depth:

- **Level 0**: JS event wiring (`addShakeListener`)
- **Level 1**: iOS shake detection (CMMotionManager)
- **Level 2**: Android shake detection (SensorManager)
- **Level 3**: Native overlay views (iOS SwiftUI / Android Jetpack Compose)

---

## What is stubbed vs provided

### Stubbed (you implement)

| File | Level |
|---|---|
| `src/index.ts` — `addShakeListener` | Level 0 |
| `ios/LillieShakerModule.swift` — `OnStartObserving` / `OnStopObserving` | Level 1 |
| `android/.../LillieShakerModule.kt` — `OnStartObserving` / `OnStopObserving` / `onSensorChanged` | Level 2 |
| `ios/DiscoverOverlayView.swift` — SwiftUI content + prop handlers | Level 3 |
| `android/.../DiscoverOverlayView.kt` — Compose UI + prop handlers | Level 3 |

### Provided (already complete)

- `expo-module.config.json` — module registration
- `package.json`, `tsconfig.json`, `android/build.gradle`, `ios/lillie-shaker.podspec`
- `src/DiscoverOverlay.tsx` — React Native Modal wrapper around the native view
- `LillieShakerModule` prop/event declarations for `DiscoverOverlayView` on both platforms

---

## Architecture overview

```text
StartScreen (React Native)
  └── addShakeListener(() => setShowDiscover(true))   ← src/index.ts
        └── NativeModule('LillieShaker').addListener('onShake', listener)

                         ┌── iOS ──────────────────────────────────────┐
                         │  LillieShakerModule.swift                   │
                         │  CMMotionManager → accelerometerUpdates     │
                         │  magnitude > threshold + debounce           │
                         │  → sendEvent("onShake")                     │
                         └─────────────────────────────────────────────┘

                         ┌── Android ──────────────────────────────────┐
                         │  LillieShakerModule.kt                      │
                         │  SensorManager + TYPE_ACCELEROMETER         │
                         │  onSensorChanged → userForce > threshold    │
                         │  → sendEvent("onShake")                     │
                         └─────────────────────────────────────────────┘

StartScreen
  └── <DiscoverOverlay items={...} visible={showDiscover} />
        └── <Modal> → <NativeView LillieShaker>
                          ├── iOS: DiscoverOverlayView (UIHostingController + SwiftUI)
                          └── Android: DiscoverOverlayView (ComposeView + Jetpack Compose)
```

---

## References

### Expo Modules Core

| Topic | Link |
|---|---|
| Expo Modules overview | https://docs.expo.dev/modules/overview/ |
| ExpoView (native view base class) | https://docs.expo.dev/modules/native-module-tutorial/ |
| Module API (`Name`, `Events`, `OnStartObserving`, `sendEvent`) | https://docs.expo.dev/modules/module-api/ |
| View API (`View`, `Prop`, `Events`) | https://docs.expo.dev/modules/module-api/#view |
| Expo Module Config (`expo-module.config.json`) | https://docs.expo.dev/modules/module-config/ |

### iOS

| Topic | Link |
|---|---|
| SwiftUI `ZStack`, `VStack`, `ScrollView`, `LazyVStack` | https://developer.apple.com/documentation/swiftui |
| UIHostingController — embedding SwiftUI in UIKit | https://developer.apple.com/documentation/swiftui/uihostingcontroller |
| CMMotionManager — accelerometer updates | https://developer.apple.com/documentation/coremotion/cmmotionmanager |
| CMAccelerometerData — reading x/y/z values | https://developer.apple.com/documentation/coremotion/cmaccelerometerdata |
| SwiftUI `AnimatedVisibility` equivalent — `.transition` + `.animation` | https://developer.apple.com/documentation/swiftui/view/transition(_:) |


### Android

| Topic | Link |
|---|---|
| Jetpack Compose — getting started | https://developer.android.com/jetpack/compose/documentation |
| ComposeView — embedding Compose in Views | https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView |
| `AnimatedVisibility` in Compose | https://developer.android.com/jetpack/compose/animation/composables-modifiers#animatedvisibility |
| `rememberInfiniteTransition` + `animateFloat` | https://developer.android.com/jetpack/compose/animation/value-based#infinite-transition |
| SensorManager — registering a listener | https://developer.android.com/reference/android/hardware/SensorManager |
| SensorEventListener — `onSensorChanged` | https://developer.android.com/reference/android/hardware/SensorEventListener |
| Sensor.TYPE_ACCELEROMETER | https://developer.android.com/reference/android/hardware/Sensor#TYPE_ACCELEROMETER |


---

## Level 0 — JS event wiring (`src/index.ts`)

### Goal
Wire `addShakeListener` to the native `onShake` event so that the `StartScreen` gets notified when a shake is detected.

### 🟢 Hint 1
The Expo Modules runtime exposes an `addListener(eventName, callback)` method on the native module object.  
Use the lazy `getModule()` helper that is already in the file.

### 🟡 Hint 2
The pattern for subscribing to an Expo Module event is:

```ts
return getModule().addListener('onShake', listener);
```

This returns an `EventSubscription` with a `.remove()` method — exactly what callers expect.

### 🔴 Hint 3 — full solution (`src/index.ts`)

<details>
<summary>Click to reveal</summary>

```ts
export function addShakeListener(listener: () => void): EventSubscription {
  return getModule().addListener('onShake', listener);
}
```

</details>

---

## Level 1 — iOS shake detection (`ios/LillieShakerModule.swift`)

### Goal
Start the accelerometer when the first JS listener is added (`OnStartObserving`) and stop it when the last one is removed (`OnStopObserving`).

### 🟢 Hint 1
Use the `motionManager` property already declared in the class.  
Set `accelerometerUpdateInterval` to a small value like `0.1` (seconds).

### 🟡 Hint 2
`CMMotionManager.startAccelerometerUpdates(to:withHandler:)` delivers `CMAccelerometerData` on the given queue. The data's `.acceleration` property has `.x`, `.y`, `.z` components.

Compute the total magnitude:
```swift
let a = data.acceleration
let magnitude = sqrt(pow(a.x, 2) + pow(a.y, 2) + pow(a.z, 2))
```

### 🟡 Hint 3
Debounce with the `lastShakeTime` / `debounceDuration` properties to avoid multiple rapid events:
```swift
let now = Date()
if magnitude > self.shakeThreshold &&
   now.timeIntervalSince(self.lastShakeTime) > self.debounceDuration {
  self.lastShakeTime = now
  self.sendEvent("onShake")
}
```

### 🔴 Hint 4 — full solution

<details>
<summary>Click to reveal</summary>

```swift
OnStartObserving {
  guard self.motionManager.isAccelerometerAvailable else { return }
  self.motionManager.accelerometerUpdateInterval = 0.1
  self.motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, error in
    guard let self = self, let data = data, error == nil else { return }
    let a = data.acceleration
    let magnitude = sqrt(pow(a.x, 2) + pow(a.y, 2) + pow(a.z, 2))
    let now = Date()
    if magnitude > self.shakeThreshold &&
       now.timeIntervalSince(self.lastShakeTime) > self.debounceDuration {
      self.lastShakeTime = now
      self.sendEvent("onShake")
    }
  }
}

OnStopObserving {
  self.motionManager.stopAccelerometerUpdates()
}
```

</details>

---

## Level 2 — Android shake detection (`android/.../LillieShakerModule.kt`)

### Goal
Register a `SensorEventListener` for `TYPE_ACCELEROMETER` when the first JS listener subscribes and unregister it when the last one leaves.

### 🟢 Hint 1
Get the `SensorManager` from the React context:
```kotlin
val context = appContext.reactContext ?: return@OnStartObserving
sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
```

### 🟡 Hint 2
Register `this@LillieShakerModule` as the listener:
```kotlin
val accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
  ?: return@OnStartObserving
sensorManager?.registerListener(
  this@LillieShakerModule,
  accelerometer,
  SensorManager.SENSOR_DELAY_UI
)
```

### 🟡 Hint 3 — `onSensorChanged`
The raw magnitude includes gravity (~9.8 m/s²). Subtract it to get only user-applied force:
```kotlin
val magnitude = sqrt(x * x + y * y + z * z)
val userForce = magnitude - SensorManager.GRAVITY_EARTH
```
Compare `userForce` against `shakeThreshold` (45f) and debounce with `lastShakeTime` / `debounceDuration`.

### 🔴 Hint 4 — full solution

<details>
<summary>Click to reveal</summary>

```kotlin
OnStartObserving {
  val context = appContext.reactContext ?: return@OnStartObserving
  sensorManager = context.getSystemService(android.content.Context.SENSOR_SERVICE) as? SensorManager
  val accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    ?: return@OnStartObserving
  sensorManager?.registerListener(
    this@LillieShakerModule,
    accelerometer,
    SensorManager.SENSOR_DELAY_UI
  )
}

OnStopObserving {
  sensorManager?.unregisterListener(this@LillieShakerModule)
  sensorManager = null
}

override fun onSensorChanged(event: SensorEvent?) {
  event ?: return
  val x = event.values[0]
  val y = event.values[1]
  val z = event.values[2]
  val magnitude = sqrt(x * x + y * y + z * z)
  val userForce = magnitude - SensorManager.GRAVITY_EARTH
  val now = System.currentTimeMillis()
  if (userForce > shakeThreshold && now - lastShakeTime > debounceDuration) {
    lastShakeTime = now
    sendEvent("onShake")
  }
}
```

</details>

---

## Level 3 — Native overlay views

### Goal
Implement `DiscoverOverlayView` on both platforms so that shaking reveals the animated product bubbles.

### iOS (`ios/DiscoverOverlayView.swift`)

#### 🟢 Hint 1
The view uses a `UIHostingController<AnyView>` to embed a SwiftUI hierarchy.  
In `setupHostingController()`:
```swift
let hc = UIHostingController(rootView: makeContentView())
hc.view.backgroundColor = .clear
hc.view.isHidden = !isVisible
addSubview(hc.view)
hostingController = hc
```

#### 🟡 Hint 2 — SwiftUI content
Create a private `DiscoverOverlayContent: View` that wraps:
- `Color.black.opacity(0.4).ignoresSafeArea().onTapGesture { onDismiss() }` for the scrim
- A bottom sheet `VStack` with a header ("Entdecke" + close button) and a `ScrollView` of item rows

Each item row: `AsyncImage` (56×56, corner radius 8) + `VStack` with title + category + chevron.

#### 🟡 Hint 3 — wiring props
In `updateItems(_:)` parse each `[String: Any]` dict into a `DiscoverItem` using `compactMap`:
```swift
items = newItems.compactMap { dict in
  guard let id = dict["id"] as? String, ... else { return nil }
  return DiscoverItem(id: id, title: title, imageUrl: imageUrl, category: category)
}
hostingController?.rootView = makeContentView()
```

#### 🔴 Hint 4 — full solution

<details>
<summary>Click to reveal full DiscoverOverlayView.swift</summary>

```swift
import ExpoModulesCore
import SwiftUI

// MARK: - Data model

struct DiscoverItem: Identifiable {
  let id: String
  let title: String
  let imageUrl: String
  let category: String
}

// MARK: - SwiftUI content view

private struct DiscoverOverlayContent: View {
  let items: [DiscoverItem]
  let onItemSelect: (String) -> Void
  let onDismiss: () -> Void

  var body: some View {
    ZStack(alignment: .bottom) {
      Color.black.opacity(0.4)
        .ignoresSafeArea()
        .onTapGesture { onDismiss() }

      VStack(spacing: 0) {
        Capsule()
          .fill(Color.secondary.opacity(0.4))
          .frame(width: 40, height: 4)
          .padding(.top, 8)
          .padding(.bottom, 4)

        HStack {
          Text("Entdecke")
            .font(.headline)
            .foregroundColor(.primary)
          Spacer()
          Button(action: onDismiss) {
            Image(systemName: "xmark.circle.fill")
              .foregroundColor(.secondary)
              .font(.title2)
          }
        }
        .padding(.horizontal)
        .padding(.bottom, 8)

        Divider()

        ScrollView {
          LazyVStack(spacing: 0) {
            ForEach(items) { item in
              Button(action: { onItemSelect(item.id) }) {
                HStack(spacing: 12) {
                  AsyncImage(url: URL(string: item.imageUrl)) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                  } placeholder: {
                    Color.gray.opacity(0.2)
                  }
                  .frame(width: 56, height: 56)
                  .clipShape(RoundedRectangle(cornerRadius: 8))

                  VStack(alignment: .leading, spacing: 4) {
                    Text(item.title)
                      .font(.subheadline)
                      .fontWeight(.medium)
                      .foregroundColor(.primary)
                    Text(item.category)
                      .font(.caption)
                      .foregroundColor(.secondary)
                  }
                  Spacer()
                  Image(systemName: "chevron.right")
                    .foregroundColor(.secondary)
                    .font(.caption)
                }
                .padding(.horizontal)
                .padding(.vertical, 12)
                .contentShape(Rectangle())
              }
              .buttonStyle(.plain)
              Divider().padding(.leading, 80)
            }
          }
        }
        .frame(maxHeight: 400)
      }
      .background(Color(UIColor.systemBackground))
      .cornerRadius(16)
    }
  }
}

// MARK: - ExpoView

class DiscoverOverlayView: ExpoView {
  private var items: [DiscoverItem] = []
  private var isVisible: Bool = false

  let onItemSelect = EventDispatcher()
  let onDismiss = EventDispatcher()

  private var hostingController: UIHostingController<AnyView>?

  required init(appContext: AppContext?) {
    super.init(appContext: appContext)
    setupHostingController()
  }

  private func setupHostingController() {
    let hc = UIHostingController(rootView: makeContentView())
    hc.view.backgroundColor = .clear
    hc.view.isHidden = !isVisible
    addSubview(hc.view)
    hostingController = hc
  }

  private func makeContentView() -> AnyView {
    AnyView(
      DiscoverOverlayContent(
        items: items,
        onItemSelect: { [weak self] id in self?.onItemSelect(["id": id]) },
        onDismiss: { [weak self] in self?.onDismiss([:]) }
      )
    )
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }

  func updateItems(_ newItems: [[String: Any]]) {
    items = newItems.compactMap { dict in
      guard
        let id = dict["id"] as? String,
        let title = dict["title"] as? String,
        let imageUrl = dict["imageUrl"] as? String,
        let category = dict["category"] as? String
      else { return nil }
      return DiscoverItem(id: id, title: title, imageUrl: imageUrl, category: category)
    }
    hostingController?.rootView = makeContentView()
  }

  func updateVisibility(_ visible: Bool) {
    isVisible = visible
    hostingController?.view.isHidden = !visible
  }
}
```

</details>

---

### Android (`android/.../DiscoverOverlayView.kt`)

#### 🟢 Hint 1 — ComposeView setup
In `onAttachedToWindow()`, create and configure a `ComposeView`:
```kotlin
if (composeView == null) {
  composeView = ComposeView(context).also { cv ->
    cv.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    cv.setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
    addView(cv)
    cv.setContent {
      val items by itemsState
      val visible by visibleState
      DiscoverOverlay(
        items = items,
        visible = visible,
        onItemSelect = { id -> onItemSelect(mapOf("id" to id)) },
        onDismiss = { onDismiss(emptyMap()) }
      )
    }
  }
}
```
Connect `updateItems` and `updateVisibility` to the state holders.

#### 🟡 Hint 2 — DiscoverOverlay composable
Wrap everything in `AnimatedVisibility(visible, fadeIn+scaleIn / fadeOut+scaleOut)`.  
Inside: a full-screen `Box` with a semi-transparent clickable scrim, then `forEachIndexed` over up to 5 items, placing each `ProductBubble` at `BubblePositions[index]` using `Modifier.absoluteOffset`.

#### 🟡 Hint 3 — ProductBubble composable
Use `rememberInfiniteTransition` + `animateFloat` for a gentle float animation (−7f to 7f, ~1800 ms, `RepeatMode.Reverse`, staggered with `StartOffset(bubbleIndex * 250)`).  
Display a colored `CircleShape` (68.dp) containing the first letter of the title, then the title text and an optional category badge below.

#### 🔴 Hint 4 — full solution

<details>
<summary>Click to reveal full DiscoverOverlayView.kt</summary>

```kotlin
package expo.modules.lillieshaker

import android.content.Context
import android.view.ViewGroup.LayoutParams
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.StartOffset
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.absoluteOffset
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class DiscoverOverlayView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {

    val onItemSelect by EventDispatcher()
    val onDismiss by EventDispatcher()

    private val itemsState = mutableStateOf<List<Map<String, Any?>>>(emptyList())
    private val visibleState = mutableStateOf(false)
    private var composeView: ComposeView? = null

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        if (composeView == null) {
            composeView = ComposeView(context).also { cv ->
                cv.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
                cv.setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
                addView(cv)
                cv.setContent {
                    val items by itemsState
                    val visible by visibleState
                    DiscoverOverlay(
                        items = items,
                        visible = visible,
                        onItemSelect = { id -> onItemSelect(mapOf("id" to id)) },
                        onDismiss = { onDismiss(emptyMap()) }
                    )
                }
            }
        }
    }

    override fun onDetachedFromWindow() {
        composeView?.disposeComposition()
        super.onDetachedFromWindow()
    }

    fun updateItems(newItems: List<Map<String, Any?>>) { itemsState.value = newItems }
    fun updateVisibility(isVisible: Boolean) { visibleState.value = isVisible }
}

private val BubblePositions = listOf(
    Pair(48f, 160f), Pair(200f, 90f), Pair(300f, 200f), Pair(60f, 350f), Pair(250f, 380f)
)

private val BubbleColors = listOf(
    Color(0xFF7B61FF), Color(0xFFFF6B9D), Color(0xFF48BEFF),
    Color(0xFFFFAF3F), Color(0xFF56CF8F)
)

@Composable
private fun DiscoverOverlay(
    items: List<Map<String, Any?>>,
    visible: Boolean,
    onItemSelect: (String) -> Unit,
    onDismiss: () -> Unit
) {
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(tween(300)) + scaleIn(initialScale = 0.85f, animationSpec = tween(300)),
        exit = fadeOut(tween(250)) + scaleOut(targetScale = 0.85f, animationSpec = tween(250))
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.7f))
                    .clickable(onClick = onDismiss)
            )
            items.take(5).forEachIndexed { index, item ->
                val (posX, posY) = BubblePositions.getOrElse(index) { Pair(80f + index * 60f, 200f) }
                val itemId = item["id"]?.toString() ?: ""
                key(itemId.ifEmpty { index.toString() }) {
                    ProductBubble(
                        title = item["title"]?.toString() ?: "",
                        category = item["category"]?.toString() ?: "",
                        bubbleColor = BubbleColors[index % BubbleColors.size],
                        bubbleIndex = index,
                        modifier = Modifier.absoluteOffset(x = posX.dp, y = posY.dp),
                        onClick = { onItemSelect(itemId) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductBubble(
    title: String,
    category: String,
    bubbleColor: Color,
    bubbleIndex: Int,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "bubble_float_$bubbleIndex")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -7f,
        targetValue = 7f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1800 + bubbleIndex * 200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse,
            initialStartOffset = StartOffset(bubbleIndex * 250)
        ),
        label = "float_$bubbleIndex"
    )
    Column(
        modifier = modifier.offset(y = floatOffset.dp).clickable(onClick = onClick).padding(horizontal = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier.size(68.dp).clip(CircleShape).background(bubbleColor),
            contentAlignment = Alignment.Center
        ) {
            Text(title.firstOrNull()?.uppercaseChar()?.toString() ?: "?",
                color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center, maxLines = 2, overflow = TextOverflow.Ellipsis,
            modifier = Modifier.widthIn(max = 88.dp))
        if (category.isNotEmpty()) {
            Spacer(modifier = Modifier.height(4.dp))
            Box(
                modifier = Modifier
                    .background(Color.White.copy(alpha = 0.25f), RoundedCornerShape(10.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(category, color = Color.White.copy(alpha = 0.9f), fontSize = 10.sp,
                    fontWeight = FontWeight.Medium)
            }
        }
    }
}
```

</details>

---

## Build + run checklist

```sh
# iOS
cd ios && pod install && cd ..
yarn ios

# Android
yarn android
```

### Acceptance checks

- Shaking the device (or using the simulator's shake gesture) opens the overlay
- The overlay shows 3–5 randomly picked product bubbles with animated floating
- Tapping a bubble navigates to the Product Detail screen
- Tapping the dimmed background dismisses the overlay
- Second shake picks a new random set of products

---

## Troubleshooting

- **`addShakeListener` does nothing** — check Level 0 (`src/index.ts`)
- **iOS: no shake events** — check `OnStartObserving` in `LillieShakerModule.swift`; CMMotionManager requires a real device for the most reliable testing (simulator has limited sensor simulation)
- **Android: no shake events** — verify `SensorManager` registration in `LillieShakerModule.kt` and that `onSensorChanged` fires
- **Overlay doesn't appear** — Level 3 views; check `updateVisibility` sets Compose/SwiftUI state correctly
- **Bubbles not visible on Android** — ensure `DiscoverOverlay` composable is wired and `ComposeView` is added in `onAttachedToWindow`
