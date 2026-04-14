package com.nativeflowexercise

import android.content.Intent
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.material3.MaterialTheme

/**
 * Full-screen host Activity for the Add Lilliebox Compose flow.
 *
 * Responsibilities:
 *  - Sets up the Compose content root with [MaterialTheme].
 *  - Wires [AddLillieboxNavGraph]'s completion callbacks to Activity results:
 *      onComplete → RESULT_OK with the serialised [AddLillieboxResult]
 *      onCancel   → RESULT_CANCELED (no extra data)
 *
 * System back-press while inside the nav stack is handled by the NavHost
 * (navigates up the back stack). When the root destination receives the
 * back press, Android finishes the Activity without calling [setResult],
 * which causes [AddLillieboxResult.fromIntent] to return CANCELLED — the
 * correct semantics.
 *
 * Declare in AndroidManifest.xml:
 *   <activity android:name="com.nativeflowexercise.AddLillieboxActivity"
 *             android:exported="false" />
 */
class AddLillieboxActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                AddLillieboxNavGraph(
                    onComplete = { result ->
                        val data = Intent().apply { putExtras(result.toBundle()) }
                        setResult(RESULT_OK, data)
                        finish()
                    },
                    onCancel = {
                        setResult(RESULT_CANCELED)
                        finish()
                    }
                )
            }
        }
    }
}
