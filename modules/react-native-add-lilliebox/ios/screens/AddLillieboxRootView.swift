import Foundation
import SwiftUI

// MARK: - Navigation destinations

/// TODO (Level 2 iOS): Define typed navigation destinations for the flow.
/// Example final enum cases: qrScan, manualInput, nfcScan
enum AddLillieboxDestination: Hashable {
    case placeholder
}

// MARK: - Root view

/// TODO (Level 2 iOS): Native owns navigation here.
///
/// Final behaviour should:
/// - own NavigationStack + NavigationPath
/// - start on input selection
/// - push to QR/manual/NFC screens
/// - complete with AddLillieboxResult(status: "completed", ...)
/// - cancel with AddLillieboxResult.cancelled
struct AddLillieboxRootView: View {

    /// Called exactly once with the final result dictionary.
    let onComplete: (NSDictionary) -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("Add Lilliebox")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Root flow not implemented yet")
                .foregroundColor(.secondary)

            Button("Cancel flow") {
                onComplete(AddLillieboxResult.cancelled.toDictionary() as NSDictionary)
            }
        }
        .padding(24)
    }
}
