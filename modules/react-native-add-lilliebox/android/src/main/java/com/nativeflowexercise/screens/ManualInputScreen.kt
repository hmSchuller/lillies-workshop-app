package com.nativeflowexercise.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
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
import androidx.compose.ui.unit.dp

/**
 * TODO (Level 3 Android): Build manual input screen in Compose.
 *
 * Requirements:
 *  - serial text field
 *  - trim + uppercase
 *  - disable submit when blank
 */
@Composable
fun ManualInputScreen(
    onSubmit: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    var serial by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text("ManualInputScreen not implemented")

        OutlinedTextField(
            value = serial,
            onValueChange = { serial = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Serial") },
        )

        Button(
            onClick = { onSubmit(serial) },
            enabled = serial.trim().isNotEmpty(),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Submit")
        }

        OutlinedButton(onClick = onCancel, modifier = Modifier.fillMaxWidth()) {
            Text("Cancel")
        }
    }
}
