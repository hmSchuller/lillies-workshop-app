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
