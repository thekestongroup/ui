export type ChangeValue = string | number

/** A value with its unit, e.g. "5 phrases"; just the value when there is no unit. */
export function withUnit(value: ChangeValue, unit?: string): string {
  return unit ? `${value} ${unit}` : String(value)
}

/** True when there is something to show: the value really changed. */
export function hasChanged(from: ChangeValue, to: ChangeValue): boolean {
  return String(from) !== String(to)
}
