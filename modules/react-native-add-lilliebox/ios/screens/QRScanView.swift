// Native UI layer.
// SwiftUI/UIKit bridge for the QR step. This file exists because the camera
// implementation is still UIKit/ObjC while the surrounding flow is SwiftUI.
import SwiftUI

// NOTE: QRCameraViewController is an Objective-C class.
// For Swift to use it, add "QRCameraViewController.h" to your project's
// Objective-C Bridging Header (e.g. DatePickerWorkshop-Bridging-Header.h).

/// TODO (Level 3 iOS): Wrap QRCameraViewController in SwiftUI.
///
/// Final behaviour:
/// - bridge ObjC delegate callback didScanCode -> onScan
/// - use a Coordinator as QRCameraViewControllerDelegate
/// - keep coordinator.parent updated in updateUIViewController to avoid stale closures
struct QRScanView: UIViewControllerRepresentable {

    var onScan: (String) -> Void
    var onCancel: () -> Void

    final class Coordinator: NSObject, QRCameraViewControllerDelegate {
        var parent: QRScanView

        init(_ parent: QRScanView) {
            self.parent = parent
        }

        func qrCameraViewController(_ vc: QRCameraViewController, didScanCode code: String) {
            // TODO: forward scanned code to SwiftUI callback.
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> QRCameraViewController {
        let vc = QRCameraViewController()
        // TODO: set vc.delegate = context.coordinator
        return vc
    }

    func updateUIViewController(_ uiViewController: QRCameraViewController, context: Context) {
        // TODO: keep coordinator parent in sync across SwiftUI re-renders.
    }
}
