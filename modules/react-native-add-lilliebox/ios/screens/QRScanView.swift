import SwiftUI

// NOTE: QRCameraViewController is an Objective-C class.
// For Swift to use it, add "QRCameraViewController.h" to your project's
// Objective-C Bridging Header (e.g. DatePickerWorkshop-Bridging-Header.h).

/// SwiftUI wrapper around the Objective-C `QRCameraViewController`.
///
/// Key implementation notes:
/// - The `Coordinator` is the `QRCameraViewControllerDelegate`. It holds a
///   **mutable** `parent` reference so `updateUIViewController` can keep it
///   current — without this the Coordinator's closures would refer to a stale
///   SwiftUI view from a previous render cycle.
/// - The ObjC delegate property is `weak`, so there is no retain cycle between
///   the VC and its Coordinator.
struct QRScanView: UIViewControllerRepresentable {

    /// Called with the raw QR code string when a code is successfully scanned.
    var onScan: (String) -> Void
    /// Called when the user taps cancel.
    var onCancel: () -> Void

    // MARK: - Coordinator

    final class Coordinator: NSObject, QRCameraViewControllerDelegate {
        /// Mutable so that `updateUIViewController` can refresh it on every SwiftUI
        /// re-render, keeping the captured closures (onScan / onCancel) up-to-date.
        var parent: QRScanView

        init(_ parent: QRScanView) {
            self.parent = parent
        }

        // MARK: QRCameraViewControllerDelegate

        func qrCameraViewController(_ vc: QRCameraViewController, didScanCode code: String) {
            // Already on main thread — guaranteed by QRCameraViewController's setup.
            parent.onScan(code)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    // MARK: - UIViewControllerRepresentable

    func makeUIViewController(context: Context) -> QRCameraViewController {
        let vc = QRCameraViewController()
        vc.delegate = context.coordinator
        return vc
    }

    func updateUIViewController(_ uiViewController: QRCameraViewController, context: Context) {
        // CRITICAL: refresh the coordinator's parent reference so it always holds
        // the latest closures from the current SwiftUI render.
        context.coordinator.parent = self
    }
}
