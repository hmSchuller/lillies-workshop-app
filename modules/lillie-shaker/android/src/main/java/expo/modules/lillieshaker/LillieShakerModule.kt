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
      val context = appContext.reactContext ?: return@OnStartObserving
      sensorManager = context.getSystemService(android.content.Context.SENSOR_SERVICE) as? SensorManager
      val accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        ?: return@OnStartObserving  // no accelerometer available
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

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
