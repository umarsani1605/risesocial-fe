// Maps semantic/common color names to hex values for use in chart libraries
// that require actual color values (not CSS variables or Tailwind classes).
const COLOR_MAP: Record<string, string> = {
  // Project semantic colors
  primary: '#FF8E50',
  secondary: '#145b56',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  // Common color names
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  purple: '#a855f7',
  pink: '#ec4899',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  slate: '#64748b',
  gray: '#6b7280',
  // Project palette aliases
  'rise-orange': '#FF8E50',
  'deep-teal': '#1bb1a0',
}

/**
 * Resolves a color name (e.g. "primary", "red") or passthrough raw CSS value (hex, rgb).
 * Returns undefined if no color provided.
 */
export function resolveChartColor(color: string | undefined): string | undefined {
  if (!color) return undefined
  return COLOR_MAP[color] ?? color
}
