// Called from AppDelegate.swift before super.application(_:didFinishLaunchingWithOptions:)
#if canImport(Foundation) && canImport(Sentry)
import Foundation
import Sentry

enum SentryBootstrap {
  static func configure(dsn: String) {
    SentrySDK.start { options in
      options.dsn = dsn

      // Debug logging for testing
      options.debug = true

      // TODO: capture traces during the workshop.
      // options.tracesSampleRate = 1.0

      options.enableCrashHandler = true
    }
  }

  static func addStartupBreadcrumb() {
    let breadcrumb = Breadcrumb()
    breadcrumb.category = "app.lifecycle"
    breadcrumb.message = "Native startup - before JS ready"
    breadcrumb.level = .info
    breadcrumb.timestamp = Date()

    SentrySDK.addBreadcrumb(breadcrumb)
  }
}
#endif
