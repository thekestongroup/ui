import { describe, expect, it } from 'vitest'
import { bareVersion, displayVersion, yearRange } from './footer'
import { kestonFooterLinks, kestonGroupLinks } from './links'

describe('yearRange', () => {
  it('shows a range from an earlier year, and a single year otherwise', () => {
    expect(yearRange(2026, 2024)).toBe('2024–2026')
    expect(yearRange(2026, 2026)).toBe('2026')
    expect(yearRange(2026)).toBe('2026')
    expect(yearRange(2026, 2030)).toBe('2026')
  })
})

describe('version', () => {
  it('shows a v in front, once', () => {
    expect(displayVersion('1.4.2')).toBe('v1.4.2')
    expect(displayVersion('v1.4.2')).toBe('v1.4.2')
    expect(displayVersion('V1.4.2')).toBe('v1.4.2')
    expect(displayVersion(undefined)).toBe('')
    expect(displayVersion('')).toBe('')
  })
  it('gives the plain number for screen readers', () => {
    expect(bareVersion('v1.4.2')).toBe('1.4.2')
    expect(bareVersion('1.4.2')).toBe('1.4.2')
    expect(bareVersion(undefined)).toBe('')
  })
})

describe('kestonFooterLinks', () => {
  it('are Help & support, Privacy Policy and Terms & Conditions, on secure thekestongroup.com addresses', () => {
    expect(kestonFooterLinks.map((l) => l.label)).toEqual(['Help & support', 'Privacy Policy', 'Terms & Conditions'])
    for (const link of kestonFooterLinks) expect(link.href).toMatch(/^https:\/\/thekestongroup\.com\/(help|privacy|terms)$/)
  })
})

describe('kestonGroupLinks', () => {
  it('are all secure addresses on keston.co', () => {
    expect(kestonGroupLinks.length).toBeGreaterThan(0)
    for (const link of kestonGroupLinks) expect(link.href).toMatch(/^https:\/\/[a-z]+\.keston\.co\/?$/)
  })
})
