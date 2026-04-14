import Foundation

/// The result returned to JS after the Add Lilliebox flow completes.
///
/// - `status`: "completed" | "cancelled"
/// - `serialNumber`: the scanned/entered serial number, or nil if cancelled
/// - `addedVia`: "qr" | "manual" | nil
struct AddLillieboxResult {
    let status: String
    let serialNumber: String?
    let addedVia: String?

    /// Converts the result to a dictionary suitable for resolving an RCT promise.
    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = ["status": status]
        dict["serialNumber"] = serialNumber ?? NSNull()
        dict["addedVia"] = addedVia ?? NSNull()
        return dict
    }

    /// Convenience factory for a cancelled result.
    static var cancelled: AddLillieboxResult {
        AddLillieboxResult(status: "cancelled", serialNumber: nil, addedVia: nil)
    }
}
