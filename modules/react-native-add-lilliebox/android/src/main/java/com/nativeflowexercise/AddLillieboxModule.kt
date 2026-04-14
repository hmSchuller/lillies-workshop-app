package com.nativeflowexercise

import android.content.Intent
import androidx.lifecycle.ViewModelProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

/**
 * TurboModule that launches [AddLillieboxActivity] and bridges the result
 * back to the React Native caller as a resolved/rejected Promise.
 *
 * Promise lifecycle:
 *  1. [launchAddLilliebox] stores the promise in [AddLillieboxViewModel]
 *     (config-change-safe) and starts [AddLillieboxActivity] via the
 *     launcher registered on the host activity.
 *  2. When the Activity finishes, the host activity's launcher callback reads
 *     the promise from the ViewModel, resolves it, and clears it.
 *
 * Threading: [launchAddLilliebox] is called on the React Native JS thread.
 * ViewModel access and [HasLillieboxLauncher.launchAddLillieboxActivity] must run on the
 * main thread, so the body is dispatched via [UiThreadUtil.runOnUiThread].
 */
class AddLillieboxModule(reactContext: ReactApplicationContext) :
    NativeAddLillieboxModuleSpec(reactContext) {

    override fun launchAddLilliebox(promise: Promise) {
        // currentActivity must be read on the main thread in New Architecture / Bridgeless mode.
        // ReactHostImpl.currentActivity is only reliably non-null after onHostResume runs on the
        // UI thread, so we defer the check until we're already there.
        UiThreadUtil.runOnUiThread {
            val activity = currentActivity
                ?: return@runOnUiThread promise.reject("E_NO_ACTIVITY", "No activity is currently attached.")

            val launcher = activity as? HasLillieboxLauncher
                ?: return@runOnUiThread promise.reject("E_NO_LAUNCHER", "Host activity must implement HasLillieboxLauncher.")

            val viewModel = ViewModelProvider(
                activity as androidx.fragment.app.FragmentActivity
            )[AddLillieboxViewModel::class.java]

            if (viewModel.pendingPromise != null) {
                promise.reject(
                    "E_IN_PROGRESS",
                    "An Add Lilliebox flow is already in progress."
                )
                return@runOnUiThread
            }

            viewModel.pendingPromise = promise

            val intent = Intent(activity, AddLillieboxActivity::class.java)
            launcher.launchAddLillieboxActivity(intent)
        }
    }
}
