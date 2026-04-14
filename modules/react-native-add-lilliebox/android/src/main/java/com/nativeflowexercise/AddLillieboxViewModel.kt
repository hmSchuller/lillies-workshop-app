package com.nativeflowexercise

import androidx.lifecycle.ViewModel
import com.facebook.react.bridge.Promise

/**
 * Bridges the lifetime gap between the host Activity (which must implement
 * [HasLillieboxLauncher] and owns the ActivityResultLauncher) and [AddLillieboxModule] (which
 * receives the React Native promise).
 *
 * Because [ViewModel] survives Activity recreation (e.g. screen rotation
 * while [AddLillieboxActivity] is in the foreground), the pending promise
 * is never lost during a configuration change.
 *
 * Workshop shortcut: for exercises where rotation mid-flow is unlikely,
 * storing [pendingPromise] directly in [AddLillieboxModule] (singleton
 * scope) is simpler — but leaves a subtle data-loss bug on config change.
 */
class AddLillieboxViewModel : ViewModel() {
    var pendingPromise: Promise? = null
}
