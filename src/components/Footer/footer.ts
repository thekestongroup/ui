/** "2024–2026" when `since` is before `year`, otherwise just the year. */
export function yearRange(year: number, since?: number): string {
  return since && since < year ? `${since}–${year}` : String(year)
}

/** "1.4.2" and "v1.4.2" both show as "v1.4.2". Empty for no version. */
export function displayVersion(version?: string): string {
  if (!version) return ''
  return /^v/i.test(version) ? `v${version.slice(1)}` : `v${version}`
}

/** The version without a leading "v", for the screen reader's "Version 1.4.2". */
export function bareVersion(version?: string): string {
  return version ? version.replace(/^v/i, '') : ''
}
