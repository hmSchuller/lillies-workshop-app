package com.margelo.nitro.studiorecorder

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
@Keep
class StudioRecorderHybridObject : HybridNitroStudioRecorderSpec() {

  override val memorySize: Long
    get() = 0L

  override var isRecording: Boolean = false
    private set

  private var recordingStartMs: Long = 0L

  override fun startRecording(onMeterUpdate: (db: Double) -> Unit) {
    // TODO (Level 2 Android):
    // 1) Configure/start MediaRecorder
    // 2) Emit dB values on an interval from maxAmplitude
    // 3) Save temp file path + recording id
    if (isRecording) return
    isRecording = true
    recordingStartMs = System.currentTimeMillis()
    onMeterUpdate(-45.0)
  }

  override fun stopRecording(): RecordingResult {
    // TODO (Level 2 Android):
    // 1) Stop/release MediaRecorder
    // 2) Return id/filePath/durationMs
    // 3) Persist metadata (Level 3)
    val durationMs =
      if (isRecording) (System.currentTimeMillis() - recordingStartMs).toDouble() else 0.0

    isRecording = false
    recordingStartMs = 0L

    return RecordingResult("stub", "", durationMs)
  }

  override fun cancelRecording() {
    // TODO (Level 2 Android): stop/release and remove temp file.
    isRecording = false
    recordingStartMs = 0L
  }

  override fun getRecordings(): Array<RecordingInfo> {
    // TODO (Level 3 Android): load persisted metadata list.
    return emptyArray()
  }

  override fun deleteRecording(id: String) {
    // TODO (Level 3 Android): delete file + remove metadata entry.
  }
}
