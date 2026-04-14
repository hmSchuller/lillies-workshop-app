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
