import SwiftUI

/// The first screen of the Add Lilliebox flow.
/// Offers three actions: scan via QR code, enter manually, or cancel.
struct InputSelectionView: View {

    var onSelectQR: () -> Void
    var onSelectManual: () -> Void
    var onCancel: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text("Wie möchtest du deine Lilliebox hinzufügen?")
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
                .padding(.top, 32)

            Button {
                onSelectQR()
            } label: {
                Label("QR-Code scannen", systemImage: "qrcode.viewfinder")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(red: 0xc8 / 255, green: 0xdf / 255, blue: 0xc0 / 255))
                    .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))
                    .cornerRadius(12)
            }
            .padding(.horizontal)

            Button {
                onSelectManual()
            } label: {
                Label("Seriennummer eingeben", systemImage: "keyboard")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(red: 0xc8 / 255, green: 0xdf / 255, blue: 0xc0 / 255))
                    .foregroundColor(Color(red: 0x1e / 255, green: 0x29 / 255, blue: 0x39 / 255))
                    .cornerRadius(12)
            }
            .padding(.horizontal)

            Button("Abbrechen") {
                onCancel()
            }
            .foregroundColor(Color(red: 0xd3 / 255, green: 0x0f / 255, blue: 0x2d / 255))
            .padding(.top, 8)

            Spacer()
        }
        .navigationTitle("Lilliebox hinzufügen")
        .navigationBarTitleDisplayMode(.inline)
    }
}
