import SwiftUI

/// Screen that lets the user type a serial number manually.
struct ManualInputView: View {

    @State private var serialNumber = ""

    /// Called with the trimmed serial number when the user confirms.
    var onSubmit: (String) -> Void
    /// Called when the user cancels without entering a serial number.
    var onCancel: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Text("Seriennummer eingeben")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))

            TextField("Seriennummer", text: $serialNumber)
                .textFieldStyle(.roundedBorder)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.characters)
                .padding(.horizontal)

            Button {
                onSubmit(serialNumber.trimmingCharacters(in: .whitespaces))
            } label: {
                Text("Bestätigen")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(trimmedInput.isEmpty
                        ? Color.gray.opacity(0.3)
                        : Color(red: 0xd3 / 255, green: 0x0f / 255, blue: 0x2d / 255))
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .disabled(trimmedInput.isEmpty)
            .padding(.horizontal)

            Button("Abbrechen") {
                onCancel()
            }
            .foregroundColor(Color(red: 0xd3 / 255, green: 0x0f / 255, blue: 0x2d / 255))

            Spacer()
        }
        .padding(.top, 32)
        .navigationTitle("Manuell")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var trimmedInput: String {
        serialNumber.trimmingCharacters(in: .whitespaces)
    }
}
