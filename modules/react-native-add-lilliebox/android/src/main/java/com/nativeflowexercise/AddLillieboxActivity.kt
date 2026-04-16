// Native UI layer.
// Host Activity reserved for the native-owned flow. In the finished exercise it
// will render the Compose graph and hand one result back to the TurboModule.
package com.nativeflowexercise

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text

/**
 * TODO (Level 2 Android): Host Activity for native-owned flow.
 *
 * Expected final behaviour:
 *  - render AddLillieboxNavGraph
 *  - onComplete -> RESULT_OK with AddLillieboxResult extras
 *  - onCancel   -> RESULT_CANCELED
 *  - finish() after setting result
 */
class AddLillieboxActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Button(onClick = {
                    setResult(RESULT_CANCELED)
                    finish()
                }) {
                    Text("AddLillieboxActivity not implemented")
                }
            }
        }
    }
}
