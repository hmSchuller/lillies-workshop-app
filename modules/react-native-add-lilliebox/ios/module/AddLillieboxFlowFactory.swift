// Platform interop glue.
// Small Swift-to-ObjC adapter so the ObjC++ module can ask for a UIViewController
// without importing SwiftUI details through a C++ translation unit.
import Foundation
import UIKit

@objcMembers
public final class AddLillieboxFlowFactory: NSObject {
    @objc(makeHostingControllerWithOnComplete:)
    public func makeHostingController(onComplete: @escaping (NSDictionary) -> Void) -> UIViewController {
        AddLillieboxHostingController(onComplete: onComplete)
    }
}
