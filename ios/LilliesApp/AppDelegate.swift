// Pre-baked baseline for Modules 2 and 4. Do not ask participants to modify this file.

#if canImport(UIKit) && canImport(React) && canImport(React_RCTAppDelegate) && canImport(ReactAppDependencyProvider)
import UIKit
internal import Expo
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
final class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
#if canImport(Sentry)
    let dsn = Bundle.main.infoDictionary?["SentryDSN"] as? String ?? ""
    SentryBootstrap.configure(dsn: dsn)
    SentryBootstrap.addStartupBreadcrumb()
#endif
    moduleName = "LilliesApp"
    dependencyProvider = RCTAppDependencyProvider()
    initialProps = [:]
    automaticallyLoadReactNativeWindow = true

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
#endif
