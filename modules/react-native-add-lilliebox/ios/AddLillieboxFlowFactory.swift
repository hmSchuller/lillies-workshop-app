import Foundation
import UIKit

@objcMembers
public final class AddLillieboxFlowFactory: NSObject {
    @objc(makeHostingControllerWithOnComplete:)
    public func makeHostingController(onComplete: @escaping (NSDictionary) -> Void) -> UIViewController {
        AddLillieboxHostingController(onComplete: onComplete)
    }
}
