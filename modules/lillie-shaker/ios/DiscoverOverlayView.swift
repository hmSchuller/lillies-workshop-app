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

private struct DiscoverOverlayContent: View {
  let items: [DiscoverItem]
  let onItemSelect: (String) -> Void
  let onDismiss: () -> Void

  var body: some View {
    ZStack(alignment: .bottom) {
      // Dimming background — tap to dismiss
      Color.black.opacity(0.4)
        .ignoresSafeArea()
        .onTapGesture { onDismiss() }

      // Items card
      VStack(spacing: 0) {
        // Drag handle
        Capsule()
          .fill(Color.secondary.opacity(0.4))
          .frame(width: 40, height: 4)
          .padding(.top, 8)
          .padding(.bottom, 4)

        // Header row
        HStack {
          Text("Entdecke")
            .font(.headline)
            .foregroundColor(.primary)
          Spacer()
          Button(action: onDismiss) {
            Image(systemName: "xmark.circle.fill")
              .foregroundColor(.secondary)
              .font(.title2)
          }
        }
        .padding(.horizontal)
        .padding(.bottom, 8)

        Divider()

        // Item list
        ScrollView {
          LazyVStack(spacing: 0) {
            ForEach(items) { item in
              Button(action: { onItemSelect(item.id) }) {
                HStack(spacing: 12) {
                  AsyncImage(url: URL(string: item.imageUrl)) { image in
                    image
                      .resizable()
                      .aspectRatio(contentMode: .fill)
                  } placeholder: {
                    Color.gray.opacity(0.2)
                  }
                  .frame(width: 56, height: 56)
                  .clipShape(RoundedRectangle(cornerRadius: 8))

                  VStack(alignment: .leading, spacing: 4) {
                    Text(item.title)
                      .font(.subheadline)
                      .fontWeight(.medium)
                      .foregroundColor(.primary)
                    Text(item.category)
                      .font(.caption)
                      .foregroundColor(.secondary)
                  }
                  Spacer()
                  Image(systemName: "chevron.right")
                    .foregroundColor(.secondary)
                    .font(.caption)
                }
                .padding(.horizontal)
                .padding(.vertical, 12)
                .contentShape(Rectangle())
              }
              .buttonStyle(.plain)

              Divider()
                .padding(.leading, 80)
            }
          }
        }
        .frame(maxHeight: 400)
      }
      .background(Color(UIColor.systemBackground))
      .cornerRadius(16)
    }
  }
}

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
    let hc = UIHostingController(rootView: makeContentView())
    hc.view.backgroundColor = .clear
    hc.view.isHidden = !isVisible
    addSubview(hc.view)
    hostingController = hc
  }

  private func makeContentView() -> AnyView {
    AnyView(
      DiscoverOverlayContent(
        items: items,
        onItemSelect: { [weak self] id in
          self?.onItemSelect(["id": id])
        },
        onDismiss: { [weak self] in
          self?.onDismiss([:])
        }
      )
    )
  }

  // MARK: - Layout

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }

  // MARK: - Prop update methods

  /// Called by the Expo prop handler when the `items` prop changes.
  func updateItems(_ newItems: [[String: Any]]) {
    items = newItems.compactMap { dict in
      guard
        let id = dict["id"] as? String,
        let title = dict["title"] as? String,
        let imageUrl = dict["imageUrl"] as? String,
        let category = dict["category"] as? String
      else { return nil }
      return DiscoverItem(id: id, title: title, imageUrl: imageUrl, category: category)
    }
    hostingController?.rootView = makeContentView()
  }

  /// Called by the Expo prop handler when the `visible` prop changes.
  func updateVisibility(_ visible: Bool) {
    isVisible = visible
    hostingController?.view.isHidden = !visible
  }
}
