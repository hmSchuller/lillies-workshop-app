// Native UI layer.
// SwiftUI form for typing a serial number. Participants implement trimming and
// validation here while the root flow stays focused on navigation.
import SwiftUI

/// TODO (Level 3 iOS): Build manual serial input screen in SwiftUI.
///
/// Requirements:
/// - text field for serial number
/// - trim whitespace
/// - disable submit while input is empty
/// - call onSubmit(serial)
struct ManualInputView: View {

    @State private var serialNumber = ""

    var onSubmit: (String) -> Void
    var onCancel: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("Manuelle Eingabe")
                .font(.title2)
                .fontWeight(.semibold)

            TextField("Seriennummer", text: $serialNumber)
                .textFieldStyle(.roundedBorder)

            Button("Bestätigen") {
                // TODO: submit the trimmed value, not the raw text field contents.
                onSubmit(serialNumber)
            }
            .disabled(serialNumber.trimmingCharacters(in: .whitespaces).isEmpty)

            Button("Abbrechen") {
                onCancel()
            }
        }
        .padding(24)
        .navigationTitle("Manuell")
        .navigationBarTitleDisplayMode(.inline)
    }
}
