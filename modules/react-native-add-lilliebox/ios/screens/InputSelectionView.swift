import SwiftUI

/// TODO (Level 3 iOS): Build the first SwiftUI screen of the flow.
///
/// Requirements:
/// - Offer action buttons for QR + manual entry
/// - Call onCancel to cancel whole flow from root screen
/// - Keep app styling consistent with workshop design tokens/colors
struct InputSelectionView: View {

    var onSelectQR: () -> Void
    var onSelectManual: () -> Void
    var onCancel: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("Lilliebox hinzufügen")
                .font(.title3)
                .fontWeight(.semibold)

            Text("InputSelectionView not implemented")
                .foregroundColor(.secondary)

            Button("QR auswählen") { onSelectQR() }
            Button("Manuell auswählen") { onSelectManual() }
            Button("Abbrechen") { onCancel() }
        }
        .padding(24)
        .navigationTitle("Lilliebox hinzufügen")
        .navigationBarTitleDisplayMode(.inline)
    }
}
