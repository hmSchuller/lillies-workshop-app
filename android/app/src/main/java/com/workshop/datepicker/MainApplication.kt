package com.workshop.datepicker
import android.content.Context
import android.content.res.Configuration
import android.content.pm.PackageManager
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Add manually linked packages here only if autolinking cannot discover them.
        },
    )
  }

  override fun onCreate() {
    val dsn = try {
      packageManager
        .getApplicationInfo(packageName, PackageManager.GET_META_DATA)
        .metaData?.getString("io.sentry.dsn") ?: ""
    } catch (e: Exception) { "" }
    SentryStartup.configure(this, dsn)
    SentryStartup.addStartupBreadcrumb()

    super.onCreate()

    // Pre-baked workshop baseline: Module 4's Sentry exercise will add startup
    // instrumentation here, so facilitators should keep this file stable.
    // RN 0.84 New Architecture apps start through ReactHost instead of the old
    // getPackages()/ReactNativeHost initialization path.
    if (BuildConfig.DEBUG) {
      // Disable shake-to-open dev menu — conflicts with app shake feature
      getSharedPreferences("react_native_dev_preferences", Context.MODE_PRIVATE)
        .edit()
        .putBoolean("shake_to_show_dev_menu", false)
        .apply()
    }

    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
