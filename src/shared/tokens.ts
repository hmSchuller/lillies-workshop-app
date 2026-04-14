/**
 * Design tokens – single source of truth for all recurring color values.
 *
 * Usage:
 *   import { Colors } from '../../shared/tokens';
 *   color: Colors.brandRed
 */
export const Colors = {
  // ── Brand ────────────────────────────────────────────────────────────────
  /** Primary interactive: FABs, links, back button, carousel CTA bubble */
  brandRed: '#e9001b',
  /** Emphasis: recording, alarm, modal CTAs, active tab indicator */
  deepRed: '#d30f2d',
  /** Pressed / active state for deepRed buttons */
  deepRedDark: '#a50c23',

  // ── Text ─────────────────────────────────────────────────────────────────
  /** Headings and high-weight text (App header, RecordingCard name, etc.) */
  textPrimary: '#1e2939',
  /** Body text in cards (ProductCard, ContentCard, CategoriesScreen) */
  textDark: '#1a1a1a',
  /** Secondary/muted text (subtitles, meta lines, empty-state body) */
  textMuted: '#6b6b6b',
  /** Tertiary text and inactive icons (LillieboxCard info, bottom-nav inactive) */
  textSecondary: '#4a5565',

  // ── Backgrounds ──────────────────────────────────────────────────────────
  /** App-level background and carousel area fills */
  backgroundApp: '#f3f3f3',
  /** Card / modal / nav-bar surfaces */
  backgroundCard: '#ffffff',

  // ── Borders & Dividers ───────────────────────────────────────────────────
  /** Divider lines and nav-bar top border */
  borderLight: '#e5e7eb',

  // ── UI State ─────────────────────────────────────────────────────────────
  /** Waveform bars when idle / not recording */
  waveformIdle: '#d1d5db',
  /** Icons in an inactive / placeholder state */
  iconInactive: '#9ca3af',
} as const;
