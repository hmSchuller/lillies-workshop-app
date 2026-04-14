package com.nativeflowexercise.screens

import androidx.compose.animation.core.EaseInOut
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.random.Random

private val ToniesNavy = Color(0xFF1e2939)
private val ToniesGreen = Color(0xFFc8dfc0)
private val ToniesRed = Color(0xFFd30f2d)

/**
 * Simulated NFC scan screen.
 *
 * No real [android.nfc.NfcAdapter] is used — hardware independence keeps
 * the exercise runnable on any device or emulator.
 *
 * The animated pulse ring conveys the "tap your device" metaphor. The
 * "Simulieren" button generates a fake serial and fires [onDetected] so
 * participants can see the full result flow without physical hardware.
 */
@Composable
fun NFCScanScreen(
    onDetected: (serialNumber: String) -> Unit,
    onCancel: () -> Unit,
) {
    // Infinite scale animation for the outer pulse ring.
    val infiniteTransition = rememberInfiniteTransition(label = "nfcPulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 900, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "pulseScale",
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 900, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "pulseAlpha",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "NFC-Chip scannen",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = ToniesNavy,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Halte dein Handy an die Lilliebox.",
            style = MaterialTheme.typography.bodyMedium,
            color = ToniesNavy.copy(alpha = 0.7f),
            textAlign = TextAlign.Center,
        )

        Spacer(modifier = Modifier.height(48.dp))

        // Animated pulse indicator
        Box(contentAlignment = Alignment.Center) {
            // Outer ring — pulses
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .graphicsLayer {
                        scaleX = pulseScale
                        scaleY = pulseScale
                        alpha = pulseAlpha * 0.35f
                    }
                    .background(ToniesGreen, CircleShape),
            )
            // Inner solid circle
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(ToniesNavy, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Text(text = "📡", fontSize = 36.sp)
            }
        }

        Spacer(modifier = Modifier.height(48.dp))

        Text(
            text = "Warte auf NFC-Signal …",
            style = MaterialTheme.typography.bodySmall,
            color = ToniesNavy.copy(alpha = 0.5f),
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = { onDetected(generateFakeSerial()) },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ToniesRed),
        ) {
            Text(
                text = "NFC simulieren",
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

/** Generates a deterministic-looking fake serial for simulation purposes. */
private fun generateFakeSerial(): String {
    val suffix = Random.nextInt(1000, 9999)
    return "NFC-LB-$suffix"
}
