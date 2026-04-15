import ExpoModulesCore
import SwiftUI

// MARK: - Data model

struct DiscoverItem: Identifiable {
  let id: String
  let title: String
  let imageUrl: String
  let category: String
}

// MARK: - SwiftUI content view

// TODO (Level 3 iOS): Implement the overlay SwiftUI view.
//
// Create a private struct DiscoverOverlayContent: View that receives:
//   - items: [DiscoverItem]
//   - onItemSelect: (String) -> Void
//   - onDismiss: () -> Void
//
// Its body should render:
//   1. A full-screen dimming Color.black.opacity(0.4) (tapable → onDismiss)
//   2. A bottom sheet or bubble layout listing the items
//   3. Each item row / bubble calls onItemSelect(item.id) when tapped

// MARK: - ExpoView

class DiscoverOverlayView: ExpoView {
  // Properties set by Expo props
  private var items: [DiscoverItem] = []
  private var isVisible: Bool = false

  // Event dispatchers
  let onItemSelect = EventDispatcher()
  let onDismiss = EventDispatcher()

  private var hostingController: UIHostingController<AnyView>?

  required init(appContext: AppContext?) {
    super.init(appContext: appContext)
    setupHostingController()
  }

  // MARK: - Private helpers

  private func setupHostingController() {
    // TODO (Level 3 iOS):
    // 1) Create UIHostingController(rootView: makeContentView())
    // 2) Set hc.view.backgroundColor = .clear
    // 3) hc.view.isHidden = !isVisible
    // 4) addSubview(hc.view) and store as hostingController
  }

  private func makeContentView() -> AnyView {
    // TODO (Level 3 iOS):
    // Return AnyView wrapping DiscoverOverlayContent, forwarding
    // items, onItemSelect(["id": id]) and onDismiss([:]) closures.
    return AnyView(EmptyView())
  }

  // MARK: - Layout

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }

  // MARK: - Prop update methods

  /// Called by the Expo prop handler when the `items` prop changes.
  func updateItems(_ newItems: [[String: Any]]) {
    // TODO (Level 3 iOS):
    // 1) Parse newItems into [DiscoverItem] — each dict has id/title/imageUrl/category keys
    // 2) Store in self.items
    // 3) Refresh: hostingController?.rootView = makeContentView()
  }

  /// Called by the Expo prop handler when the `visible` prop changes.
  func updateVisibility(_ visible: Bool) {
    // TODO (Level 3 iOS):
    // 1) isVisible = visible
    // 2) hostingController?.view.isHidden = !visible
  }
}
