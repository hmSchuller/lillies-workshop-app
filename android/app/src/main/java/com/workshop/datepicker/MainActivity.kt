package com.workshop.datepicker
import expo.modules.ReactActivityDelegateWrapper

import android.content.Intent
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.lifecycle.ViewModelProvider
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.nativeflowexercise.AddLillieboxResult
import com.nativeflowexercise.AddLillieboxViewModel
import com.nativeflowexercise.HasLillieboxLauncher

class MainActivity : ReactActivity(), HasLillieboxLauncher {

    /**
     * Launcher for [com.nativeflowexercise.AddLillieboxActivity].
     *
     * Must be declared as a class-level property — NOT inside [onCreate].
     * AndroidX requires activity-result launchers to be registered before
     * the Activity reaches the STARTED state, and class-level initialisation
     * satisfies that requirement.
     *
     * Result handling:
     *  - Reads the pending promise from [AddLillieboxViewModel] (config-
     *    change safe: the ViewModel survives rotation).
     *  - Resolves the promise with the parsed [AddLillieboxResult].
     *  - Clears [AddLillieboxViewModel.pendingPromise] so a new flow can
     *    be started after this one completes.
     */
    val addLillieboxLauncher: ActivityResultLauncher<Intent> =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val vm = ViewModelProvider(this)[AddLillieboxViewModel::class.java]
            val promise = vm.pendingPromise ?: return@registerForActivityResult
            vm.pendingPromise = null

            val lillieboxResult = AddLillieboxResult.fromIntent(result.data)
            promise.resolve(lillieboxResult.toWritableMap())
        }

    override fun launchAddLillieboxActivity(intent: Intent) {
        addLillieboxLauncher.launch(intent)
    }

    override fun getMainComponentName(): String = "LilliesApp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))
}
