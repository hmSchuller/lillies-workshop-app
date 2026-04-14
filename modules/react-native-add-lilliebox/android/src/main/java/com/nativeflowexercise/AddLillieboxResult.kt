package com.nativeflowexercise

import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

private const val KEY_STATUS = "status"
private const val KEY_SERIAL_NUMBER = "serialNumber"
private const val KEY_ADDED_VIA = "addedVia"

data class AddLillieboxResult(
    val status: String,       // "completed" | "cancelled"
    val serialNumber: String?,
    val addedVia: String?     // "qr" | "manual" | "nfc" | null
) {

    /** Pack into a Bundle for use with Activity.setResult(). */
    fun toBundle(): Bundle = Bundle().apply {
        putString(KEY_STATUS, status)
        serialNumber?.let { putString(KEY_SERIAL_NUMBER, it) }
        addedVia?.let { putString(KEY_ADDED_VIA, it) }
    }

    /** Build a WritableMap for resolving a React Native promise. */
    fun toWritableMap(): WritableMap = Arguments.createMap().apply {
        putString(KEY_STATUS, status)
        serialNumber?.let { putString(KEY_SERIAL_NUMBER, it) } ?: putNull(KEY_SERIAL_NUMBER)
        addedVia?.let { putString(KEY_ADDED_VIA, it) } ?: putNull(KEY_ADDED_VIA)
    }

    companion object {
        /** Sentinel value returned whenever the flow is cancelled or no data is available. */
        val CANCELLED = AddLillieboxResult("cancelled", null, null)

        /**
         * Reconstruct from an Activity result [Intent].
         *
         * Returns [CANCELLED] when the intent is null or missing the expected extras —
         * this covers both explicit cancellations and system back-presses that never
         * called [setResult].
         */
        fun fromIntent(intent: Intent?): AddLillieboxResult {
            val bundle = intent?.extras ?: return CANCELLED
            return AddLillieboxResult(
                status = bundle.getString(KEY_STATUS) ?: return CANCELLED,
                serialNumber = bundle.getString(KEY_SERIAL_NUMBER),
                addedVia = bundle.getString(KEY_ADDED_VIA),
            )
        }
    }
}
