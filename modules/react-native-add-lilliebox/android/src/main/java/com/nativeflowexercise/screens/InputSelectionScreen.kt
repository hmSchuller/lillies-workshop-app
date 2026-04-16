// Native UI layer.
// Entry Compose screen offering QR, manual, and NFC paths plus a cancel button;
// Android adds the NFC branch over iOS to demonstrate one extra native-owned route.
package com.nativeflowexercise.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * TODO (Level 3 Android): Build the first Compose screen in the flow.
 *
 * Should offer three paths:
 *  - QR scan
 *  - Manual input
 *  - NFC scan
 * plus cancel for the whole flow.
 */
@Composable
fun InputSelectionScreen(
    onSelectQR: () -> Unit,
    onSelectManual: () -> Unit,
    onSelectNFC: () -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text("InputSelectionScreen not implemented")

        Button(onClick = onSelectQR, modifier = Modifier.fillMaxWidth()) {
            Text("QR")
        }
        Button(onClick = onSelectManual, modifier = Modifier.fillMaxWidth()) {
            Text("Manual")
        }
        Button(onClick = onSelectNFC, modifier = Modifier.fillMaxWidth()) {
            Text("NFC")
        }
        OutlinedButton(onClick = onCancel, modifier = Modifier.fillMaxWidth()) {
            Text("Cancel")
        }
    }
}
