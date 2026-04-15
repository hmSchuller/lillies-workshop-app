package expo.modules.lillieshaker

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.sqrt

class LillieShakerModule : Module(), SensorEventListener {
  private var sensorManager: SensorManager? = null
  private var lastShakeTime: Long = 0L
  private val shakeThreshold = 45f
  private val debounceDuration = 500L

  override fun definition() = ModuleDefinition {
    Name("LillieShaker")
    Events("onShake")

    OnStartObserving {
      // TODO (Level 2 Android):
      // 1) Get the system SensorManager from appContext.reactContext:
      //      val context = appContext.reactContext ?: return@OnStartObserving
      //      sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
      // 2) Get the default TYPE_ACCELEROMETER sensor (return early if unavailable)
      // 3) Register this module as a SensorEventListener with SENSOR_DELAY_UI
    }

    OnStopObserving {
      // TODO (Level 2 Android):
      // 1) Unregister this SensorEventListener:  sensorManager?.unregisterListener(this@LillieShakerModule)
      // 2) Set sensorManager = null
    }

    View(DiscoverOverlayView::class) {
      Events("onItemSelect", "onDismiss")

      Prop("items") { view: DiscoverOverlayView, items: List<Map<String, Any?>> ->
        view.updateItems(items)
      }

      Prop("visible") { view: DiscoverOverlayView, visible: Boolean ->
        view.updateVisibility(visible)
      }
    }
  }

  override fun onSensorChanged(event: SensorEvent?) {
    // TODO (Level 2 Android):
    // 1) Read x, y, z from event?.values
    // 2) Compute magnitude = sqrt(x² + y² + z²)
    // 3) userForce = magnitude - SensorManager.GRAVITY_EARTH
    // 4) Debounce: if userForce > shakeThreshold AND enough time has passed since
    //    lastShakeTime → update lastShakeTime and call sendEvent("onShake")
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
