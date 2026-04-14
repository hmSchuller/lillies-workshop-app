package com.workshop.datepicker

// Called from MainApplication.onCreate() before super.onCreate()
import android.content.Context
import io.sentry.Breadcrumb
import io.sentry.Sentry
import io.sentry.SentryLevel
import io.sentry.android.core.SentryAndroid
import java.util.Date

object SentryStartup {
  fun configure(context: Context, dsn: String) {
    SentryAndroid.init(context) { options ->
      options.dsn = dsn

      // Debug logging for testing
      options.isDebug = true

      // TODO: capture traces during the workshop.
      // options.tracesSampleRate = 1.0
    }
  }

  fun addStartupBreadcrumb() {
    val breadcrumb = Breadcrumb(Date()).apply {
      category = "app.lifecycle"
      message = "Native startup - before JS ready"
      level = SentryLevel.INFO
    }

    Sentry.addBreadcrumb(breadcrumb)
  }
}
