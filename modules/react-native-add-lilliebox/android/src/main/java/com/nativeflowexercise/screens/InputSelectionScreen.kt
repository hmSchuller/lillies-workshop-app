package com.nativeflowexercise.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

private val ToniesNavy = Color(0xFF1e2939)
private val ToniesRed = Color(0xFFd30f2d)

/**
 * First screen in the Add Lilliebox flow.
 *
 * Lets the user choose between QR code scan, manual serial entry, or NFC tap.
 * The "Abbrechen" button dismisses the entire flow (not just this screen).
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
        Text(
            text = "Lilliebox hinzufügen",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = ToniesNavy,
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Wie möchtest du deine Lilliebox verbinden?",
            style = MaterialTheme.typography.bodyMedium,
            color = ToniesNavy.copy(alpha = 0.7f),
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(40.dp))

        SelectionButton(label = "📷  QR-Code scannen", onClick = onSelectQR)
        Spacer(modifier = Modifier.height(12.dp))
        SelectionButton(label = "⌨️  Seriennummer eingeben", onClick = onSelectManual)
        Spacer(modifier = Modifier.height(12.dp))
        SelectionButton(label = "📡  NFC-Chip scannen", onClick = onSelectNFC)

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedButton(
            onClick = onCancel,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Abbrechen")
        }
    }
}

@Composable
private fun SelectionButton(label: String, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp),
        colors = ButtonDefaults.buttonColors(containerColor = ToniesNavy),
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Medium,
        )
    }
}
