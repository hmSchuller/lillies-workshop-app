// Pre-baked baseline for Modules 2 and 4. Do not ask participants to modify this file.

#if canImport(UIKit) && canImport(React) && canImport(React_RCTAppDelegate) && canImport(ReactAppDependencyProvider) && canImport(Expo)
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Expo

@main
final class AppDelegate: ExpoAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.moduleName = "LilliesApp"
    self.dependencyProvider = RCTAppDependencyProvider()
    initialProps = [:]
    automaticallyLoadReactNativeWindow = true

    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

#if DEBUG
    // Disable shake-to-open dev menu — conflicts with app shake feature
    DispatchQueue.main.async {
      RCTDevMenu.shared()?.isShakeToShowEnabled = false
    }
#endif

    return result
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
