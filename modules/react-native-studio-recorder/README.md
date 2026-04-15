# Exercise: Studio Recorder (NitroModule)

Build a cross-platform audio recorder as a Nitro HybridObject.

This workshop exercise is split into levels so participants can choose depth:

- **Level 0**: Spec + Nitrogen codegen
- **Level 1**: JS wiring to Nitro runtime
- **Level 2**: Native recording lifecycle + live metering
- **Level 3**: Persistence (list/delete recordings)

---

## What is stubbed vs provided

### Stubbed (you implement)

- `src/specs/NitroStudioRecorder.nitro.ts` (Level 0)
- `src/index.ts` (Level 1)
- `ios/StudioRecorderHybridObject.swift` (Levels 2-3)
- `android/src/main/java/com/margelo/nitro/studiorecorder/StudioRecorderHybridObject.kt` (Levels 2-3)

### Provided (already complete)

- `nitro.json` (Nitro config)
- `nitrogen/generated/**` (generated bindings)
- `android/src/main/java/com/margelo/nitro/studiorecorder/NitroStudiorecorderPackage.kt`
- `android/src/main/cpp/cpp-adapter.cpp`
- `ios/Bridge.h`
- Package/build/autolinking files (`*.podspec`, `android/CMakeLists.txt`, etc.)

---

## Architecture overview

```text
JS (StudioScreen / RecordingModal)
  -> createStudioRecorder()
  -> NitroModules.createHybridObject('NitroStudioRecorder')
  -> native Hybrid object instance

iOS: StudioRecorderHybridObject.swift (AVAudioEngine + AVAudioFile)
Android: StudioRecorderHybridObject.kt (MediaRecorder)

Both return:
- start/stop/cancel recording
- live meter callback (dB)
- persisted recordings list + delete
```

---

## Level 0 — Spec + Nitrogen codegen

### Goal
Define/verify the HybridObject contract in `NitroStudioRecorder.nitro.ts`, then generate native bindings.

### 🟢 Hint 1
Your spec should expose:
- `startRecording(onMeterUpdate)`
- `stopRecording(): RecordingResult`
- `cancelRecording()`
- `isRecording` readonly
- `getRecordings(): RecordingInfo[]`
- `deleteRecording(id)`

### 🟡 Hint 2 — generate bindings

From module root:

```sh
npm run specs
```

or from app root:

```sh
yarn --cwd modules/react-native-studio-recorder specs
```

Then regenerate iOS pods from app root:

```sh
cd ios && pod install && cd ..
```

### 🔴 Hint 3 — full solution (`NitroStudioRecorder.nitro.ts`)

<details>
<summary>Click to reveal</summary>

```ts
import { type HybridObject } from 'react-native-nitro-modules';

export interface RecordingResult {
  id: string;
  filePath: string;
  durationMs: number;
}

export interface RecordingInfo {
  id: string;
  name: string;
  filePath: string;
  durationMs: number;
  createdAt: number; // Unix timestamp ms
}

export interface NitroStudioRecorder
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  // Recording control
  startRecording(onMeterUpdate: (db: number) => void): void;
  stopRecording(): RecordingResult;
  cancelRecording(): void;
  readonly isRecording: boolean;

  // Storage
  getRecordings(): RecordingInfo[];
  deleteRecording(id: string): void;
}
```

</details>

---

## Level 1 — JS wiring (`src/index.ts`)

### Goal
Create and return the Nitro HybridObject from JS.

### 🟢 Hint 1
Use `NitroModules.createHybridObject<NitroStudioRecorder>('NitroStudioRecorder')`.

### 🔴 Hint 2 — full solution (`src/index.ts`)

<details>
<summary>Click to reveal</summary>

```ts
import { NitroModules } from 'react-native-nitro-modules';
import type { NitroStudioRecorder } from './specs/NitroStudioRecorder.nitro';

export type { NitroStudioRecorder } from './specs/NitroStudioRecorder.nitro';
export type { RecordingResult, RecordingInfo } from './specs/NitroStudioRecorder.nitro';

export function createStudioRecorder(): NitroStudioRecorder {
  return NitroModules.createHybridObject<NitroStudioRecorder>('NitroStudioRecorder');
}
```

</details>

---

## Level 2 — Native recording lifecycle + metering

### Goal
Implement actual recording on both platforms:
- start recording
- emit meter dB values while recording
- stop and return `RecordingResult`
- cancel recording

### 🟢 Hint 1 (iOS)
In `StudioRecorderHybridObject.swift`:
- request/check mic permission with `AVAudioSession`
- create `AVAudioEngine`
- install tap on input node
- write buffers to `AVAudioFile`
- compute RMS -> dB and call callback on main queue

### 🟢 Hint 2 (Android)
In `StudioRecorderHybridObject.kt`:
- create/configure `MediaRecorder`
- poll `maxAmplitude` on interval (`Handler`)
- convert amplitude to dB
- emit callback

---

## Level 3 — Persistence (recordings list + delete)

### Goal
Store metadata for each recording and expose list/delete methods.

### 🟢 Hint 1 (iOS)
Use:
- files in Documents/Recordings
- metadata in `UserDefaults` (JSON array)

### 🟢 Hint 2 (Android)
Use:
- files in `context.getExternalFilesDir(null)/Recordings`
- metadata in `SharedPreferences` as JSON array

### Expected behaviour
- `getRecordings()` sorted newest first
- `deleteRecording(id)` removes file + metadata

---

## Full native solutions

### iOS — `ios/StudioRecorderHybridObject.swift`

<details>
<summary>Click to reveal full file</summary>

```swift
import AVFoundation
///
/// StudioRecorderHybridObject.swift
/// iOS implementation of the StudioRecorder NitroModule.
///
import Foundation
import NitroModules

class StudioRecorderHybridObject: HybridNitroStudioRecorderSpec {

  var memorySize: Int { 0 }

  private(set) var isRecording: Bool = false
  private var audioEngine: AVAudioEngine?
  private var audioFile: AVAudioFile?
  private var recordingStartDate: Date?
  private var onMeterCallback: ((_ db: Double) -> Void)?
  private var currentRecordingId: String?

  func startRecording(onMeterUpdate: @escaping (_ db: Double) -> Void) throws {
    guard !isRecording else { return }
    let session = AVAudioSession.sharedInstance()
    switch session.recordPermission {
    case .denied:
      throw NSError(
        domain: "StudioRecorder", code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Microphone permission denied."])
    case .undetermined:
      session.requestRecordPermission { _ in }
      throw NSError(
        domain: "StudioRecorder", code: 3,
        userInfo: [
          NSLocalizedDescriptionKey:
            "Microphone permission not yet granted. Please grant permission and try again."
        ])
    default: break
    }
    try session.setCategory(.record, mode: .default)
    try session.setActive(true)
    let recordingsDir = try recordingsDirectory()
    let id = UUID().uuidString
    currentRecordingId = id
    let fileURL = recordingsDir.appendingPathComponent("\(id).m4a")
    let engine = AVAudioEngine()
    audioEngine = engine
    let inputFormat = engine.inputNode.outputFormat(forBus: 0)
    let aacSettings: [String: Any] = [
      AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
      AVSampleRateKey: inputFormat.sampleRate,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue,
    ]
    audioFile = try AVAudioFile(forWriting: fileURL, settings: aacSettings)
    onMeterCallback = onMeterUpdate
    engine.inputNode.installTap(onBus: 0, bufferSize: 4096, format: inputFormat) {
      [weak self] buffer, _ in
      guard let self, let file = self.audioFile else { return }
      try? file.write(from: buffer)
      let channelData = buffer.floatChannelData![0]
      let frameCount = Int(buffer.frameLength)
      guard frameCount > 0 else { return }
      let rms = sqrt(
        (0..<frameCount).reduce(0.0) { $0 + Double(channelData[$1] * channelData[$1]) }
          / Double(frameCount))
      let db = 20.0 * log10(max(rms, 1e-7))
      DispatchQueue.main.async { self.onMeterCallback?(db) }
    }
    try engine.start()
    recordingStartDate = Date()
    isRecording = true
  }

  func stopRecording() throws -> RecordingResult {
    guard isRecording else {
      throw NSError(
        domain: "StudioRecorder", code: 2,
        userInfo: [NSLocalizedDescriptionKey: "Not currently recording."])
    }
    audioEngine?.inputNode.removeTap(onBus: 0)
    audioEngine?.stop()
    audioFile = nil
    isRecording = false
    let durationMs = Double(Date().timeIntervalSince(recordingStartDate ?? Date()) * 1000)
    let id = currentRecordingId ?? UUID().uuidString
    let fileURL = try recordingsDirectory().appendingPathComponent("\(id).m4a")
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    let info = RecordingMeta(
      id: id, name: "Aufnahme \(loadMeta().count + 1)", filePath: fileURL.path,
      durationMs: durationMs, createdAt: Double(Date().timeIntervalSince1970 * 1000))
    saveMeta(info)
    currentRecordingId = nil
    return RecordingResult(id: id, filePath: fileURL.path, durationMs: durationMs)
  }

  func cancelRecording() throws {
    guard isRecording else { return }
    audioEngine?.inputNode.removeTap(onBus: 0)
    audioEngine?.stop()
    if let id = currentRecordingId, let dir = try? recordingsDirectory() {
      try? FileManager.default.removeItem(at: dir.appendingPathComponent("\(id).m4a"))
    }
    audioFile = nil
    isRecording = false
    currentRecordingId = nil
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
  }

  func getRecordings() throws -> [RecordingInfo] {
    return loadMeta().sorted { $0.createdAt > $1.createdAt }
      .map {
        RecordingInfo(
          id: $0.id, name: $0.name, filePath: $0.filePath, durationMs: $0.durationMs,
          createdAt: $0.createdAt)
      }
  }

  func deleteRecording(id: String) throws {
    var meta = loadMeta()
    if let info = meta.first(where: { $0.id == id }) {
      try? FileManager.default.removeItem(atPath: info.filePath)
    }
    meta.removeAll { $0.id == id }
    saveAllMeta(meta)
  }

  private func recordingsDirectory() throws -> URL {
    let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    let dir = docs.appendingPathComponent("Recordings")
    try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    return dir
  }

  private struct RecordingMeta: Codable {
    let id: String
    let name: String
    let filePath: String
    let durationMs: Double
    let createdAt: Double
  }
  private func loadMeta() -> [RecordingMeta] {
    guard let data = UserDefaults.standard.data(forKey: "studio_recordings"),
      let infos = try? JSONDecoder().decode([RecordingMeta].self, from: data)
    else { return [] }
    return infos
  }
  private func saveMeta(_ info: RecordingMeta) {
    var e = loadMeta()
    e.append(info)
    saveAllMeta(e)
  }
  private func saveAllMeta(_ infos: [RecordingMeta]) {
    if let data = try? JSONEncoder().encode(infos) {
      UserDefaults.standard.set(data, forKey: "studio_recordings")
    }
  }
}
```

</details>

### Android — `android/.../StudioRecorderHybridObject.kt`

<details>
<summary>Click to reveal full file</summary>

```kotlin
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
```

</details>

---

## Build + run checklist

From app root:

```sh
# regenerate nitro bindings (if spec changed)
yarn --cwd modules/react-native-studio-recorder specs

# iOS pods
cd ios && pod install && cd ..

# run
yarn ios
# or
yarn android
```

### Acceptance checks

- Tapping “Neue Aufnahme” opens recording modal
- Start recording updates waveform meter in near-real-time
- Stop recording creates item in Studio list with duration/date
- Cancel recording does not create item
- Deleting recording removes it from list and storage

---

## Troubleshooting

- **Hybrid object not found**
  - run specs generation + clean rebuild
- **iOS permission errors**
  - grant microphone permission in simulator/device settings
- **Android no audio**
  - verify `RECORD_AUDIO` permission and `MediaRecorder` setup
- **List empty after stopping**
  - metadata persistence likely not saved correctly (`UserDefaults` / `SharedPreferences`)
