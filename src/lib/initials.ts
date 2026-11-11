/** "Ben Smith" → "BS", "Ben" → "B", "Mary Jane Watson" → "MW". Empty for an empty name. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ''
  const first = words[0]!
  const last = words.length > 1 ? words[words.length - 1]! : ''
  return (first[0]! + (last[0] ?? '')).toUpperCase()
}
