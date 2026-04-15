import ExpoModulesCore
import CoreMotion

public class LillieShakerModule: Module {
  private let motionManager = CMMotionManager()
  private var lastShakeTime: Date = .distantPast
  private let shakeThreshold: Double = 2.5
  private let debounceDuration: TimeInterval = 0.5

  public func definition() -> ModuleDefinition {
    Name("LillieShaker")

    Events("onShake")

    OnStartObserving {
      // TODO (Level 1 iOS):
      // 1) Guard that motionManager.isAccelerometerAvailable
      // 2) Set motionManager.accelerometerUpdateInterval = 0.1
      // 3) Call motionManager.startAccelerometerUpdates(to: .main) with a closure:
      //    a) Read data.acceleration (x, y, z)
      //    b) Compute magnitude = sqrt(x² + y² + z²)
      //    c) If magnitude > shakeThreshold AND debounce interval elapsed →
      //       update lastShakeTime and call self.sendEvent("onShake")
    }

    OnStopObserving {
      // TODO (Level 1 iOS): stop accelerometer updates.
      //   self.motionManager.stopAccelerometerUpdates()
    }

    View(DiscoverOverlayView.self) {
      Events("onItemSelect", "onDismiss")

      Prop("items") { (view: DiscoverOverlayView, items: [[String: Any]]) in
        view.updateItems(items)
      }

      Prop("visible") { (view: DiscoverOverlayView, visible: Bool) in
        view.updateVisibility(visible)
      }
    }
  }
}
