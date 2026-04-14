import Foundation

/// The result returned to JS after the Add Lilliebox flow completes.
///
/// TODO (Level 1): Implement a robust result-pattern mapper used by native + JS.
///
/// Target semantics:
/// - status: "completed" | "cancelled"
/// - serialNumber: scanned/typed value when completed, else nil
/// - addedVia: "qr" | "manual" | "nfc" when completed, else nil
struct AddLillieboxResult {
    let status: String
    let serialNumber: String?
    let addedVia: String?

    /// Converts the result to a dictionary suitable for resolving an RCT promise.
    func toDictionary() -> [String: Any] {
        // TODO: Map all fields correctly (including explicit NSNull for nil values).
        return [
            "status": "cancelled",
            "serialNumber": NSNull(),
            "addedVia": NSNull(),
        ]
    }

    /// Convenience factory for a cancelled result.
    static var cancelled: AddLillieboxResult {
        // TODO: Return the canonical cancelled shape.
        AddLillieboxResult(status: "cancelled", serialNumber: nil, addedVia: nil)
    }
}
