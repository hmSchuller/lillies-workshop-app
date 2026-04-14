package com.nativeflowexercise

import androidx.compose.runtime.Composable
import com.nativeflowexercise.screens.InputSelectionScreen

/**
 * TODO (Level 2 Android): Compose NavHost owned by native flow.
 *
 * Expected route map:
 *  inputSelection -> qrScan -> manualInput -> nfcScan
 * Root cancel closes whole flow. Child cancel pops back stack.
 */
@Composable
fun AddLillieboxNavGraph(
    onComplete: (AddLillieboxResult) -> Unit,
    onCancel: () -> Unit,
) {
    // TODO: Replace with rememberNavController + NavHost + composable destinations.
    InputSelectionScreen(
        onSelectQR = {},
        onSelectManual = {},
        onSelectNFC = {},
        onCancel = onCancel,
    )
}
