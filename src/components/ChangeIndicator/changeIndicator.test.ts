import { describe, expect, it } from 'vitest'
import { hasChanged, withUnit } from './changeIndicator'

describe('withUnit', () => {
  it('puts the unit after the value', () => {
    expect(withUnit(5, 'phrases')).toBe('5 phrases')
  })
  it('is just the value without a unit', () => {
    expect(withUnit(5)).toBe('5')
  })
})

describe('hasChanged', () => {
  it('is false for the same value, even as number and string', () => {
    expect(hasChanged(8, 8)).toBe(false)
    expect(hasChanged(8, '8')).toBe(false)
  })
  it('is true when different', () => {
    expect(hasChanged(15, 5)).toBe(true)
  })
})
