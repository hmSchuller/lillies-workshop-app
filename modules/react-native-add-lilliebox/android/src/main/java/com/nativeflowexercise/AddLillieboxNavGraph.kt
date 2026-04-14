package com.nativeflowexercise

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.nativeflowexercise.screens.InputSelectionScreen
import com.nativeflowexercise.screens.ManualInputScreen
import com.nativeflowexercise.screens.NFCScanScreen
import com.nativeflowexercise.screens.QRScanScreen

/**
 * Compose NavHost for the Add Lilliebox flow.
 *
 * Route map:
 *  inputSelection  →  choose how to add (QR / manual / NFC)
 *  qrScan          →  camera-based QR code scanner
 *  manualInput     →  type in the serial number manually
 *  nfcScan         →  simulated NFC detection screen
 *
 * @param onComplete Called when the user successfully adds a Lilliebox.
 *                   Passes the completed [AddLillieboxResult] up to the
 *                   Activity, which packages it into the activity result.
 * @param onCancel   Called when the user cancels from the root screen.
 *                   Sub-screens use [navController.popBackStack] instead.
 */
@Composable
fun AddLillieboxNavGraph(
    onComplete: (AddLillieboxResult) -> Unit,
    onCancel: () -> Unit,
) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "inputSelection") {

        composable("inputSelection") {
            InputSelectionScreen(
                onSelectQR = { navController.navigate("qrScan") },
                onSelectManual = { navController.navigate("manualInput") },
                onSelectNFC = { navController.navigate("nfcScan") },
                onCancel = onCancel,
            )
        }

        composable("qrScan") {
            QRScanScreen(
                onScanned = { serial ->
                    onComplete(AddLillieboxResult("completed", serial, "qr"))
                },
                onCancel = { navController.popBackStack() },
            )
        }

        composable("manualInput") {
            ManualInputScreen(
                onSubmit = { serial ->
                    onComplete(AddLillieboxResult("completed", serial, "manual"))
                },
                onCancel = { navController.popBackStack() },
            )
        }

        composable("nfcScan") {
            NFCScanScreen(
                onDetected = { serial ->
                    onComplete(AddLillieboxResult("completed", serial, "nfc"))
                },
                onCancel = { navController.popBackStack() },
            )
        }
    }
}
