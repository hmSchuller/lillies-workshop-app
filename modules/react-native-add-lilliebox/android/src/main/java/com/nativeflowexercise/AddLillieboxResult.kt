// Core TurboModule plumbing.
// Shared Android result model. Once participants finish Level 1, this file
// centralises how the native flow serialises back to Activity results and JS.
package com.nativeflowexercise

import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

private const val KEY_STATUS = "status"
private const val KEY_SERIAL_NUMBER = "serialNumber"
private const val KEY_ADDED_VIA = "addedVia"

data class AddLillieboxResult(
    val status: String,
    val serialNumber: String?,
    val addedVia: String?,
) {

    /** TODO (Level 1): Pack into a Bundle for Activity.setResult(). */
    fun toBundle(): Bundle = Bundle().apply {
        // TODO: include all fields with stable keys.
        putString(KEY_STATUS, "cancelled")
    }

    /** TODO (Level 1): Convert to WritableMap for JS promise resolution. */
    fun toWritableMap(): WritableMap = Arguments.createMap().apply {
        // TODO: map all fields and preserve null values explicitly.
        putString(KEY_STATUS, "cancelled")
        putNull(KEY_SERIAL_NUMBER)
        putNull(KEY_ADDED_VIA)
    }

    companion object {
        val CANCELLED = AddLillieboxResult("cancelled", null, null)

        /**
         * TODO (Level 1): Reconstruct from Activity result Intent.
         *
         * Suggested behaviour:
         *  - return CANCELLED when the intent/extras/status are missing
         *  - otherwise rebuild the same stable result shape used everywhere else
         */
        fun fromIntent(intent: Intent?): AddLillieboxResult {
            // TODO: replace stub with defensive reconstruction from Intent extras.
            return CANCELLED
        }
    }
}
