package com.nativeflowexercise.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

private val ToniesNavy = Color(0xFF1e2939)
private val ToniesRed = Color(0xFFd30f2d)

/**
 * Screen for manually entering a Lilliebox serial number.
 *
 * The confirm button is disabled while the input is blank.
 * Keyboard "Done" action fires the same confirmation.
 */
@Composable
fun ManualInputScreen(
    onSubmit: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    var serialNumber by remember { mutableStateOf("") }
    val isValid = serialNumber.isNotBlank()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "Seriennummer eingeben",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = ToniesNavy,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Die Seriennummer befindet sich auf der Unterseite deiner Lilliebox.",
            style = MaterialTheme.typography.bodyMedium,
            color = ToniesNavy.copy(alpha = 0.7f),
        )

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = serialNumber,
            onValueChange = { serialNumber = it.uppercase() },
            label = { Text("Seriennummer") },
            placeholder = { Text("z. B. LB-2024-XXXX") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(
                capitalization = KeyboardCapitalization.Characters,
                keyboardType = KeyboardType.Ascii,
                imeAction = ImeAction.Done,
            ),
            keyboardActions = KeyboardActions(
                onDone = { if (isValid) onSubmit(serialNumber.trim()) }
            ),
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { onSubmit(serialNumber.trim()) },
            enabled = isValid,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ToniesRed),
        ) {
            Text(
                text = "Bestätigen",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = onCancel,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Abbrechen")
        }
    }
}
