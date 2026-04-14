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
