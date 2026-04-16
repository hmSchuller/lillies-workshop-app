// Core TurboModule plumbing.
// Android entrypoint for the TurboModule. This file is required by RN New Architecture;
// the exercise fills in how it hops to the UI thread and launches the native flow.
package com.nativeflowexercise

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

/**
 * TODO (Level 2 Android): Implement TurboModule launch flow.
 *
 * Final behaviour should:
 *  - run on UI thread
 *  - read currentActivity
 *  - verify host implements HasLillieboxLauncher
 *  - store pending promise in AddLillieboxViewModel
 *  - start AddLillieboxActivity via launcher
 *  - reject for in-progress / missing activity / missing launcher
 */
class AddLillieboxModule(reactContext: ReactApplicationContext) :
    NativeAddLillieboxModuleSpec(reactContext) {

    override fun launchAddLilliebox(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            // TODO: Replace stub with full native launch logic.
            promise.reject("E_NOT_IMPLEMENTED", "AddLilliebox Android flow not implemented in exercise stub.")
        }
    }
}
