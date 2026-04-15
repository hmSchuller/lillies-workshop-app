import AVFoundation
import Foundation
import NitroModules

/// StudioRecorderHybridObject.swift
///
/// TODO (Levels 2-3): Implement the iOS Nitro hybrid object.
///
/// Suggested split:
/// - Level 2: recording lifecycle + live metering callback
/// - Level 3: persistence (list/delete metadata + files)
class StudioRecorderHybridObject: HybridNitroStudioRecorderSpec {

  var memorySize: Int { 0 }

  private(set) var isRecording: Bool = false
  private var recordingStartDate: Date?

  func startRecording(onMeterUpdate: @escaping (_ db: Double) -> Void) throws {
    // TODO (Level 2 iOS):
    // 1) Check/request microphone permission
    // 2) Configure AVAudioSession
    // 3) Start AVAudioEngine + tap inputNode
    // 4) Stream dB values via onMeterUpdate callback
    guard !isRecording else { return }
    isRecording = true
    recordingStartDate = Date()
    onMeterUpdate(-45)
  }

  func stopRecording() throws -> RecordingResult {
    // TODO (Level 2 iOS):
    // 1) Stop engine, remove tap, close file
    // 2) Return id/filePath/durationMs
    // 3) Persist metadata entry (Level 3)
    guard isRecording else {
      throw NSError(
        domain: "StudioRecorder",
        code: 2,
        userInfo: [NSLocalizedDescriptionKey: "Not currently recording."]
      )
    }

    isRecording = false
    let durationMs = Double(Date().timeIntervalSince(recordingStartDate ?? Date()) * 1000)
    recordingStartDate = nil

    return RecordingResult(
      id: "stub",
      filePath: "",
      durationMs: durationMs
    )
  }

  func cancelRecording() throws {
    // TODO (Level 2 iOS): stop engine and delete in-progress temp file.
    isRecording = false
    recordingStartDate = nil
  }

  func getRecordings() throws -> [RecordingInfo] {
    // TODO (Level 3 iOS): load persisted metadata (sorted newest first).
    return []
  }

  func deleteRecording(id: String) throws {
    // TODO (Level 3 iOS): delete file + remove metadata entry.
  }
}
