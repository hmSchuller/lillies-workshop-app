import UIKit

/// Plain UIView subclass that owns all UIDatePicker logic.
///
/// Lives in the pod alongside `RNDatePickerFabricView`. The ObjC++ shell imports
/// `RNDatePickerFabric-Swift.h` and instantiates this class directly — no
/// `NSClassFromString` or runtime protocol cast needed.
///
/// All methods are `@objc` so that ObjC++ can call them on the concrete type.
@objc(RNDatePickerView)
public final class RNDatePickerView: UIView {

  // MARK: - Public interface (called from ObjC++ via RNDatePickerViewProtocol)

  /// Invoked on the main thread whenever the user selects a new date.
  /// The string is an ISO 8601 date with milliseconds, e.g. "2024-06-15T00:00:00.000Z".
  @objc public var onChange: ((String) -> Void)?

  // MARK: - Private state

  private let datePicker = UIDatePicker()

  private let isoFormatter: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return f
  }()

  /// Fallback without fractional seconds for ISO strings that omit them.
  private let fallbackFormatter: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime]
    return f
  }()

  // MARK: - Initialisation

  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupPicker()
  }

  public required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // MARK: - Setup

  private func setupPicker() {
    datePicker.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    datePicker.frame = bounds
    datePicker.preferredDatePickerStyle = .automatic
    datePicker.addTarget(self, action: #selector(handleDateChange), for: .valueChanged)
    addSubview(datePicker)
  }

  // MARK: - @objc prop setters (names match RNDatePickerViewProtocol selectors)

  /// Sets the currently selected date from an ISO 8601 string.
  /// Should parse the ISO string, clamp it to current min/max bounds, and
  /// call datePicker.setDate(_:animated:false) if the value actually changed.
  @objc public func setDateISO(_ iso: String) {
    guard let date = parseDate(from: iso) else { return }
    let clamped = clamp(date)
    if datePicker.date != clamped {
      datePicker.setDate(clamped, animated: false)
    }
  }

  /// Sets the lower bound. Pass `nil` or an empty string to clear it.
  /// After updating datePicker.minimumDate, clamp the current date if needed.
  @objc public func setMinimumDateISO(_ iso: String?) {
    datePicker.minimumDate = iso.flatMap { parseDate(from: $0) }
    let clamped = clamp(datePicker.date)
    if datePicker.date != clamped {
      datePicker.setDate(clamped, animated: false)
    }
  }

  /// Sets the upper bound. Pass `nil` or an empty string to clear it.
  /// After updating datePicker.maximumDate, clamp the current date if needed.
  @objc public func setMaximumDateISO(_ iso: String?) {
    datePicker.maximumDate = iso.flatMap { parseDate(from: $0) }
    let clamped = clamp(datePicker.date)
    if datePicker.date != clamped {
      datePicker.setDate(clamped, animated: false)
    }
  }

  /// Maps the JS mode string ("date" | "time" | "datetime") to `UIDatePicker.Mode`.
  @objc public func setPickerMode(_ mode: String) {
    datePicker.datePickerMode = pickerMode(from: mode)
  }

  /// Applies an optional accent/tint color. Pass `nil` to restore the system default.
  @objc public func setPickerAccentColor(_ color: UIColor?) {
    datePicker.tintColor = color
  }

  /// Resets all mutable state so the view can be safely reused by Fabric's recycler.
  @objc public func resetForRecycle() {
    datePicker.minimumDate = nil
    datePicker.maximumDate = nil
    datePicker.tintColor = nil
    datePicker.datePickerMode = .date
    datePicker.setDate(Date(), animated: false)
  }

  // MARK: - UIDatePicker target

  @objc private func handleDateChange() {
    let clamped = clamp(datePicker.date)
    if datePicker.date != clamped {
      datePicker.setDate(clamped, animated: false)
    }
    onChange?(isoFormatter.string(from: clamped))
  }

  // MARK: - Helpers

  private func clamp(_ date: Date) -> Date {
    if let min = datePicker.minimumDate, date < min { return min }
    if let max = datePicker.maximumDate, date > max { return max }
    return date
  }

  private func parseDate(from iso: String) -> Date? {
    guard !iso.isEmpty else { return nil }
    return isoFormatter.date(from: iso) ?? fallbackFormatter.date(from: iso)
  }

  private func pickerMode(from mode: String) -> UIDatePicker.Mode {
    switch mode {
    case "time":     return .time
    case "datetime": return .dateAndTime
    default:         return .date
    }
  }
}
