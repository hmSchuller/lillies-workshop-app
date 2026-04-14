package com.nativeflowexercise

import android.content.Intent

/**
 * Interface that the host Activity must implement to support the AddLilliebox native flow.
 * By programming to this interface instead of MainActivity directly, the library module
 * avoids a circular dependency on the host application.
 */
interface HasLillieboxLauncher {
    fun launchAddLillieboxActivity(intent: Intent)
}
