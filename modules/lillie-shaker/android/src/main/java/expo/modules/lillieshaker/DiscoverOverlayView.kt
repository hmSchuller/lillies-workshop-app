package expo.modules.lillieshaker

import android.content.Context
import android.view.ViewGroup.LayoutParams
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

// ─────────────────────────────────────────────────────────────
// ExpoView subclass
// ─────────────────────────────────────────────────────────────

class DiscoverOverlayView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {

    // Event dispatchers – wired to JS callbacks by the Expo Modules framework.
    val onItemSelect by EventDispatcher()
    val onDismiss by EventDispatcher()

    private val itemsState = mutableStateOf<List<Map<String, Any?>>>(emptyList())
    private val visibleState = mutableStateOf(false)

    private var composeView: ComposeView? = null

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        // TODO (Level 3 Android):
        // Create a ComposeView, add it to this ExpoView, and set its content
        // to call your DiscoverOverlay composable, wiring:
        //   - items  from itemsState
        //   - visible from visibleState
        //   - onItemSelect: { id -> onItemSelect(mapOf("id" to id)) }
        //   - onDismiss:    { onDismiss(emptyMap()) }
        //
        // Use ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed.
        // Only create the ComposeView once (guard with `if (composeView == null)`).
    }

    override fun onDetachedFromWindow() {
        composeView?.disposeComposition()
        super.onDetachedFromWindow()
    }

    /** Called from the Prop("items") handler in LillieShakerModule. */
    fun updateItems(newItems: List<Map<String, Any?>>) {
        // TODO (Level 3 Android): update itemsState.value = newItems
    }

    /** Called from the Prop("visible") handler in LillieShakerModule. */
    fun updateVisibility(isVisible: Boolean) {
        // TODO (Level 3 Android): update visibleState.value = isVisible
    }
}

// ─────────────────────────────────────────────────────────────
// Compose UI
// ─────────────────────────────────────────────────────────────

/** Pre-calculated (x, y) dp offsets for up to 5 bubbles, spread to avoid overlap. */
private val BubblePositions = listOf(
    Pair(48f, 160f),
    Pair(200f, 90f),
    Pair(300f, 200f),
    Pair(60f, 350f),
    Pair(250f, 380f)
)

/** Palette used as fallback product image — one color per bubble. */
private val BubbleColors = listOf(
    Color(0xFF7B61FF),
    Color(0xFFFF6B9D),
    Color(0xFF48BEFF),
    Color(0xFFFFAF3F),
    Color(0xFF56CF8F)
)

// TODO (Level 3 Android): Implement the DiscoverOverlay composable.
//
// Signature:
//   @Composable
//   private fun DiscoverOverlay(
//       items: List<Map<String, Any?>>,
//       visible: Boolean,
//       onItemSelect: (String) -> Unit,
//       onDismiss: () -> Unit
//   )
//
// It should:
//   1. Wrap content in AnimatedVisibility(visible, fadeIn+scaleIn / fadeOut+scaleOut)
//   2. Show a full-screen semi-transparent Box (clickable → onDismiss)
//   3. For each item (up to 5) render a ProductBubble at BubblePositions[index]
//      passing id/title/category, a color from BubbleColors, and onClick → onItemSelect(id)

// TODO (Level 3 Android): Implement the ProductBubble composable.
//
// Signature:
//   @Composable
//   private fun ProductBubble(
//       title: String,
//       category: String,
//       bubbleColor: Color,
//       bubbleIndex: Int,
//       modifier: Modifier = Modifier,
//       onClick: () -> Unit
//   )
//
// It should:
//   1. Use rememberInfiniteTransition to animate a gentle float offset
//      (staggered by bubbleIndex, ~1800+bubbleIndex*200 ms, -7f..7f, Reverse)
//   2. Show a colored Circle (68.dp) with the first letter of title centered
//   3. Below the circle: title text (max 2 lines) + optional category badge
