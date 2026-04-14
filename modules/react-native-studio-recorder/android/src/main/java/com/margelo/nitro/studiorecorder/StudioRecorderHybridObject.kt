package com.margelo.nitro.studiorecorder

import android.content.Context
import android.media.MediaRecorder
import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules
import java.io.File
import kotlin.math.log10
import org.json.JSONArray
import org.json.JSONObject

@DoNotStrip
@Keep
class StudioRecorderHybridObject : HybridNitroStudioRecorderSpec() {

  override val memorySize: Long
    get() = 0L

  private val context: Context
    get() = NitroModules.applicationContext!!

  override var isRecording: Boolean = false
    private set

  private var mediaRecorder: MediaRecorder? = null
  private var meterHandler: Handler? = null
  private var meterRunnable: Runnable? = null
  private var recordingStartMs: Long = 0L
  private var currentRecordingId: String? = null
  private var currentFilePath: String? = null
  private var onMeterUpdateCallback: ((Double) -> Unit)? = null

  override fun startRecording(onMeterUpdate: (db: Double) -> Unit) {
    if (isRecording) return
    val id = java.util.UUID.randomUUID().toString()
    currentRecordingId = id
    val recordingsDir = File(context.getExternalFilesDir(null), "Recordings").apply { mkdirs() }
    val filePath = File(recordingsDir, "$id.m4a").absolutePath
    currentFilePath = filePath

    @Suppress("DEPRECATION")
    val recorder =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
              MediaRecorder(context)
            } else {
              MediaRecorder()
            }
    recorder.apply {
      setAudioSource(MediaRecorder.AudioSource.MIC)
      setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
      setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
      setAudioSamplingRate(44100)
      setAudioEncodingBitRate(128000)
      setOutputFile(filePath)
      prepare()
      start()
    }
    mediaRecorder = recorder
    recordingStartMs = System.currentTimeMillis()
    isRecording = true
    onMeterUpdateCallback = onMeterUpdate

    meterHandler = Handler(Looper.getMainLooper())
    meterRunnable =
            object : Runnable {
              override fun run() {
                val amplitude = mediaRecorder?.maxAmplitude ?: 0
                val db =
                        if (amplitude <= 0) -60.0
                        else 20.0 * log10(amplitude / 32767.0).coerceAtLeast(-60.0)
                onMeterUpdateCallback?.invoke(db)
                meterHandler?.postDelayed(this, 100)
              }
            }
    meterHandler?.postDelayed(meterRunnable!!, 100)
  }

  override fun stopRecording(): RecordingResult {
    meterHandler?.removeCallbacksAndMessages(null)
    meterHandler = null
    meterRunnable = null
    mediaRecorder?.stop()
    mediaRecorder?.release()
    mediaRecorder = null
    isRecording = false
    val durationMs = (System.currentTimeMillis() - recordingStartMs).toDouble()
    val id = currentRecordingId ?: ""
    val filePath = currentFilePath ?: ""
    val name = "Aufnahme ${getRecordingCount() + 1}"
    val createdAt = System.currentTimeMillis().toDouble()
    saveMetadata(id, name, filePath, durationMs, createdAt)
    currentRecordingId = null
    currentFilePath = null
    return RecordingResult(id, filePath, durationMs)
  }

  override fun cancelRecording() {
    meterHandler?.removeCallbacksAndMessages(null)
    meterHandler = null
    meterRunnable = null
    try {
      mediaRecorder?.stop()
    } catch (_: Exception) {}
    mediaRecorder?.release()
    mediaRecorder = null
    currentFilePath?.let { File(it).delete() }
    isRecording = false
    currentRecordingId = null
    currentFilePath = null
  }

  override fun getRecordings(): Array<RecordingInfo> {
    return loadAllMetadata().sortedByDescending { it.createdAt }.toTypedArray()
  }

  override fun deleteRecording(id: String) {
    val prefs = context.getSharedPreferences("studio_recordings", Context.MODE_PRIVATE)
    val arr = JSONArray(prefs.getString("recordings", "[]"))
    val newArr = JSONArray()
    for (i in 0 until arr.length()) {
      val obj = arr.getJSONObject(i)
      if (obj.getString("id") != id) {
        newArr.put(obj)
      } else {
        File(obj.getString("filePath")).delete()
      }
    }
    prefs.edit().putString("recordings", newArr.toString()).apply()
  }

  private fun getRecordingCount(): Int = loadAllMetadata().size

  private fun loadAllMetadata(): List<RecordingInfo> {
    val prefs = context.getSharedPreferences("studio_recordings", Context.MODE_PRIVATE)
    val arr = JSONArray(prefs.getString("recordings", "[]"))
    return (0 until arr.length()).map { i ->
      val obj = arr.getJSONObject(i)
      RecordingInfo(
              obj.getString("id"),
              obj.getString("name"),
              obj.getString("filePath"),
              obj.getDouble("durationMs"),
              obj.getDouble("createdAt")
      )
    }
  }

  private fun saveMetadata(
          id: String,
          name: String,
          filePath: String,
          durationMs: Double,
          createdAt: Double
  ) {
    val prefs = context.getSharedPreferences("studio_recordings", Context.MODE_PRIVATE)
    val arr = JSONArray(prefs.getString("recordings", "[]"))
    arr.put(
            JSONObject().apply {
              put("id", id)
              put("name", name)
              put("filePath", filePath)
              put("durationMs", durationMs)
              put("createdAt", createdAt)
            }
    )
    prefs.edit().putString("recordings", arr.toString()).apply()
  }
}
