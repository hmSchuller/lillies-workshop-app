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
 * TODO (Level 3 Android): Implement camera-based QR scanning screen with Compose.
 *
 * Suggested final implementation:
 *  - request CAMERA permission
 *  - render CameraX PreviewView
 *  - analyze frames with ML Kit Barcode scanner
 *  - call onScanned(serial) exactly once
 */
@Composable
fun QRScanScreen(
    onScanned: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text("QRScanScreen not implemented")

        Button(onClick = { onScanned("QR-LB-0000") }, modifier = Modifier.fillMaxWidth()) {
            Text("Simulate QR")
        }

        OutlinedButton(onClick = onCancel, modifier = Modifier.fillMaxWidth()) {
            Text("Cancel")
        }
    }
}
