package expo.modules.lillieshaker

import android.content.Context
import android.view.ViewGroup.LayoutParams
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.StartOffset
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.absoluteOffset
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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
        // Create and add the ComposeView only once the parent is attached to a window.
        // Fabric (New Architecture) measures views before attaching them, and
        // ComposeView.onMeasure() calls ensureCompositionCreated() which requires a
        // WindowRecomposer — crashing if the view isn't in a window yet.
        if (composeView == null) {
            composeView = ComposeView(context).also { cv ->
                cv.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
                cv.setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
                addView(cv)
                cv.setContent {
                    val items by itemsState
                    val visible by visibleState
                    DiscoverOverlay(
                        items = items,
                        visible = visible,
                        onItemSelect = { id -> onItemSelect(mapOf("id" to id)) },
                        onDismiss = { onDismiss(emptyMap()) }
                    )
                }
            }
        }
    }

    override fun onDetachedFromWindow() {
        composeView?.disposeComposition()
        super.onDetachedFromWindow()
    }

    /** Called from the Prop("items") handler in LillieShakerModule. */
    fun updateItems(newItems: List<Map<String, Any?>>) {
        itemsState.value = newItems
    }

    /** Called from the Prop("visible") handler in LillieShakerModule. */
    fun updateVisibility(isVisible: Boolean) {
        visibleState.value = isVisible
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

@Composable
private fun DiscoverOverlay(
    items: List<Map<String, Any?>>,
    visible: Boolean,
    onItemSelect: (String) -> Unit,
    onDismiss: () -> Unit
) {
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(animationSpec = tween(300)) +
                scaleIn(initialScale = 0.85f, animationSpec = tween(300)),
        exit = fadeOut(animationSpec = tween(250)) +
               scaleOut(targetScale = 0.85f, animationSpec = tween(250))
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Semi-transparent scrim — tapping fires onDismiss
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.7f))
                    .clickable(onClick = onDismiss)
            )

            // Up to 5 floating product bubbles
            val displayItems = items.take(5)
            displayItems.forEachIndexed { index, item ->
                val (posX, posY) = BubblePositions.getOrElse(index) {
                    Pair(80f + index * 60f, 200f)
                }
                val itemId = item["id"]?.toString() ?: ""
                val title = item["title"]?.toString() ?: ""
                val category = item["category"]?.toString() ?: ""
                val bubbleColor = BubbleColors[index % BubbleColors.size]

                key(itemId.ifEmpty { index.toString() }) {
                    ProductBubble(
                        title = title,
                        category = category,
                        bubbleColor = bubbleColor,
                        bubbleIndex = index,
                        modifier = Modifier.absoluteOffset(x = posX.dp, y = posY.dp),
                        onClick = { onItemSelect(itemId) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductBubble(
    title: String,
    category: String,
    bubbleColor: Color,
    bubbleIndex: Int,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    // Gentle vertical bobbing, staggered per bubble
    val infiniteTransition = rememberInfiniteTransition(label = "bubble_float_$bubbleIndex")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -7f,
        targetValue = 7f,
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = 1800 + bubbleIndex * 200,
                easing = FastOutSlowInEasing
            ),
            repeatMode = RepeatMode.Reverse,
            initialStartOffset = StartOffset(bubbleIndex * 250)
        ),
        label = "float_$bubbleIndex"
    )

    Column(
        modifier = modifier
            .offset(y = floatOffset.dp)
            .clickable(onClick = onClick)
            .padding(horizontal = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Colored circle with the first letter of the title as fallback image
        Box(
            modifier = Modifier
                .size(68.dp)
                .clip(CircleShape)
                .background(bubbleColor),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = title.firstOrNull()?.uppercaseChar()?.toString() ?: "?",
                color = Color.White,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Product title — max 2 lines, centred
        Text(
            text = title,
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.widthIn(max = 88.dp)
        )

        // Category badge — only shown when non-empty
        if (category.isNotEmpty()) {
            Spacer(modifier = Modifier.height(4.dp))
            Box(
                modifier = Modifier
                    .background(
                        color = Color.White.copy(alpha = 0.25f),
                        shape = RoundedCornerShape(10.dp)
                    )
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(
                    text = category,
                    color = Color.White.copy(alpha = 0.9f),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}
