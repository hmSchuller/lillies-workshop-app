import Foundation
import SwiftUI
import UIKit

/// A thin `UIHostingController` wrapper that presents the SwiftUI Add Lilliebox
/// flow. All business logic lives in `AddLillieboxRootView`; this class is the
/// only UIKit surface that `AddLillieboxModule` needs to touch.
final class AddLillieboxHostingController: UIHostingController<AddLillieboxRootView> {

    /// Creates the hosting controller with the given completion handler.
    /// - Parameter onComplete: Called once with the flow result. The module is
    ///   responsible for dismissing this controller and resolving the JS promise.
    init(onComplete: @escaping (NSDictionary) -> Void) {
        super.init(rootView: AddLillieboxRootView(onComplete: onComplete))
        modalPresentationStyle = .formSheet
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
