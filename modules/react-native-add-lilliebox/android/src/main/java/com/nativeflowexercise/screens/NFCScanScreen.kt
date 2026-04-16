// Native UI layer.
// Android-only NFC step. The finished exercise can show a waiting UI, but the
// workshop keeps it simulation-friendly so no real NFC hardware is required.
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
 * TODO (Level 3 Android): Build NFC screen with Compose.
 *
 * Workshop variant can be simulated (no hardware dependency):
 *  - animated waiting UI
 *  - "simulate NFC" button returning a fake serial
 */
@Composable
fun NFCScanScreen(
    onDetected: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text("NFCScanScreen not implemented")

        Button(onClick = { onDetected("NFC-LB-0000") }, modifier = Modifier.fillMaxWidth()) {
            Text("Simulate NFC")
        }

        OutlinedButton(onClick = onCancel, modifier = Modifier.fillMaxWidth()) {
            Text("Cancel")
        }
    }
}
