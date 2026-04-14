import Foundation
import SwiftUI

// MARK: - Navigation destinations

/// Typed navigation destinations for the Add Lilliebox flow.
enum AddLillieboxDestination: Hashable {
    case qrScan
    case manualInput
}

// MARK: - Root view

/// The SwiftUI root of the Add Lilliebox flow.
///
/// Owns the `NavigationStack` and drives programmatic navigation via a
/// `NavigationPath`. All result production (completed / cancelled) bubbles up
/// through the `onComplete` closure, which the hosting controller passes in.
struct AddLillieboxRootView: View {

    /// Called exactly once with the final result dictionary.
    /// The caller (`NativeAddLillieboxModule`) dismisses the controller and
    /// resolves the JS promise after this closure fires.
    let onComplete: (NSDictionary) -> Void

    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            InputSelectionView(
                onSelectQR: {
                    path.append(AddLillieboxDestination.qrScan)
                },
                onSelectManual: {
                    path.append(AddLillieboxDestination.manualInput)
                },
                onCancel: {
                    onComplete(AddLillieboxResult.cancelled.toDictionary() as NSDictionary)
                }
            )
            .navigationDestination(for: AddLillieboxDestination.self) { destination in
                switch destination {
                case .qrScan:
                    QRScanView(
                        onScan: { serialNumber in
                            // Successful scan — complete the entire flow.
                            // The hosting controller will be dismissed; no need to pop.
                            onComplete(AddLillieboxResult(
                                status: "completed",
                                serialNumber: serialNumber,
                                addedVia: "qr"
                            ).toDictionary() as NSDictionary)
                        },
                        onCancel: {
                            // User tapped cancel — go back to the selection screen.
                            path.removeLast()
                        }
                    )
                case .manualInput:
                    ManualInputView(
                        onSubmit: { serialNumber in
                            // Successful entry — complete the entire flow.
                            onComplete(AddLillieboxResult(
                                status: "completed",
                                serialNumber: serialNumber,
                                addedVia: "manual"
                            ).toDictionary() as NSDictionary)
                        },
                        onCancel: {
                            // User tapped cancel — go back to the selection screen.
                            path.removeLast()
                        }
                    )
                }
            }
        }
    }
}
