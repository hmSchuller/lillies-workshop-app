package com.nativeflowexercise.screens

import android.Manifest
import android.content.pm.PackageManager
import android.util.Size
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Camera-based QR code scanner screen.
 *
 * Uses CameraX [Preview] + [ImageAnalysis] with an ML Kit [BarcodeScanning]
 * analyzer. On the first valid QR code detected, the camera is unbound and
 * [onScanned] is called exactly once (guarded by [AtomicBoolean]).
 *
 * Camera permission is requested at composable entry. If denied, a rationale
 * message is shown with an option to go back.
 */
@Composable
fun QRScanScreen(
    onScanned: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context, Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }
    var permissionDenied by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
    ) { granted ->
        hasPermission = granted
        if (!granted) permissionDenied = true
    }

    LaunchedEffect(Unit) {
        if (!hasPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    when {
        permissionDenied -> PermissionDeniedContent(onCancel)
        !hasPermission -> LoadingContent()
        else -> CameraContent(
            lifecycleOwner = lifecycleOwner,
            onScanned = onScanned,
            onCancel = onCancel,
        )
    }
}

// ── Permission denied ────────────────────────────────────────────────────────

@Composable
private fun PermissionDeniedContent(onCancel: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(modifier = Modifier.weight(1f))
        Text(
            text = "Kamerazugriff verweigert",
            style = MaterialTheme.typography.headlineSmall,
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "Um QR-Codes scannen zu können, erlaube bitte den Kamerazugriff " +
                    "in den App-Einstellungen deines Geräts.",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.weight(1f))
        OutlinedButton(onClick = onCancel, modifier = Modifier.fillMaxWidth()) {
            Text("Zurück")
        }
    }
}

// ── Waiting for permission result ────────────────────────────────────────────

@Composable
private fun LoadingContent() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

// ── Live camera preview ──────────────────────────────────────────────────────

@Composable
private fun CameraContent(
    lifecycleOwner: androidx.lifecycle.LifecycleOwner,
    onScanned: (String) -> Unit,
    onCancel: () -> Unit,
) {
    // AtomicBoolean ensures onScanned is called at most once across concurrent
    // analyzer invocations (ML Kit callbacks run on an arbitrary thread).
    val scannedOnce = remember { AtomicBoolean(false) }
    val analyzerExecutor = remember { Executors.newSingleThreadExecutor() }

    Column(modifier = Modifier.fillMaxSize()) {
        AndroidView(
            factory = { ctx ->
                val previewView = PreviewView(ctx)

                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                cameraProviderFuture.addListener(
                    {
                        val cameraProvider = cameraProviderFuture.get()

                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(previewView.surfaceProvider)
                        }

                        val imageAnalysis = ImageAnalysis.Builder()
                            .setTargetResolution(Size(1280, 720))
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build()

                        imageAnalysis.setAnalyzer(analyzerExecutor, QRAnalyzer { value ->
                            if (scannedOnce.compareAndSet(false, true)) {
                                cameraProvider.unbindAll()
                                onScanned(value)
                            }
                        })

                        try {
                            cameraProvider.unbindAll()
                            cameraProvider.bindToLifecycle(
                                lifecycleOwner,
                                CameraSelector.DEFAULT_BACK_CAMERA,
                                preview,
                                imageAnalysis,
                            )
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    },
                    ContextCompat.getMainExecutor(ctx),
                )

                previewView
            },
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
        )

        Button(
            onClick = onCancel,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
        ) {
            Text("Abbrechen")
        }
    }
}

// ── ML Kit barcode analyzer ──────────────────────────────────────────────────

/**
 * [ImageAnalysis.Analyzer] that uses ML Kit Barcode Scanning to detect QR
 * codes. Fires [onResult] with the first raw value found.
 *
 * [ExperimentalGetImage] is required to access [ImageProxy.image] (the
 * recommended path for ML Kit integration with CameraX).
 */
private class QRAnalyzer(
    private val onResult: (String) -> Unit,
) : ImageAnalysis.Analyzer {

    private val scanner = BarcodeScanning.getClient()

    @ExperimentalGetImage
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage == null) {
            imageProxy.close()
            return
        }

        val inputImage = InputImage.fromMediaImage(
            mediaImage,
            imageProxy.imageInfo.rotationDegrees,
        )

        scanner.process(inputImage)
            .addOnSuccessListener { barcodes ->
                barcodes
                    .firstOrNull { it.valueType == Barcode.TYPE_TEXT || it.rawValue != null }
                    ?.rawValue
                    ?.let { onResult(it) }
            }
            .addOnCompleteListener {
                // Always close the proxy so the next frame can be delivered.
                imageProxy.close()
            }
    }
}
