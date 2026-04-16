// Core TurboModule plumbing.
// TurboReactPackage that lazily instantiates AddLillieboxModule on demand and
// registers its ReactModuleInfo so the RN registry knows it is a TurboModule.
package com.nativeflowexercise

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * ReactPackage entry point for the NativeAddLilliebox TurboModule.
 *
 * TurboReactPackage enables lazy, on-demand module instantiation via
 * [getModule] — a core New Architecture feature — rather than eagerly
 * constructing all modules at startup as [ReactPackage.createNativeModules] does.
 */
class NativeAddLillieboxPackage : TurboReactPackage() {

    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? = when (name) {
        NativeAddLillieboxModuleSpec.NAME -> AddLillieboxModule(reactContext)
        else -> null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
        ReactModuleInfoProvider {
            mapOf(
                NativeAddLillieboxModuleSpec.NAME to ReactModuleInfo(
                    /* name                    = */ NativeAddLillieboxModuleSpec.NAME,
                    /* className               = */ AddLillieboxModule::class.java.name,
                    /* canOverrideExistingModule= */ false,
                    /* needsEagerInit          = */ false,
                    /* isCxxModule             = */ false,
                    /* isTurboModule           = */ true,
                )
            )
        }
}
