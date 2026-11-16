import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createKestonI18n, en } from './index'

// Tests run in Node: stand in for the browser's storage and <html>.
const store = new Map<string, string>()
const html = { lang: '' }
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  clear: () => store.clear()
})
vi.stubGlobal('document', { documentElement: html })

describe('createKestonI18n', () => {
  beforeEach(() => store.clear())

  it('has Keston UI’s words and the app’s own', () => {
    const i18n = createKestonI18n({ messages: { en: { users: { title: 'Users' } } } })
    expect(i18n.global.t('ui.slideover.close')).toBe('Close')
    expect(i18n.global.t('users.title')).toBe('Users')
  })

  it('falls back to English for a language that lacks a word', () => {
    const i18n = createKestonI18n({ locale: 'cy', messages: { cy: { users: { title: 'Defnyddwyr' } } } })
    expect(i18n.global.t('users.title')).toBe('Defnyddwyr')
    expect(i18n.global.t('ui.slideover.close')).toBe('Close')
  })

  it('remembers the language and sets <html lang>', async () => {
    const i18n = createKestonI18n({ messages: { cy: {} } })
    i18n.global.locale.value = 'cy'
    await Promise.resolve()
    expect(localStorage.getItem('keston-locale')).toBe('cy')
    expect(html.lang).toBe('cy')
    expect(createKestonI18n({ messages: { cy: {} } }).global.locale.value).toBe('cy')
  })

  it('ignores a saved language the app no longer has', () => {
    localStorage.setItem('keston-locale', 'fr')
    expect(createKestonI18n().global.locale.value).toBe('en')
  })

  it('has a working message for every key', () => {
    const i18n = createKestonI18n()
    const leaves = (node: Record<string, unknown>, path = ''): string[] =>
      Object.entries(node).flatMap(([k, v]) =>
        typeof v === 'object' && v ? leaves(v as Record<string, unknown>, `${path}${k}.`) : [`${path}${k}`]
      )
    const keys = leaves(en)
    expect(keys.length).toBeGreaterThan(50)
    for (const key of keys) {
      const text = i18n.global.t(key, { count: 2, n: 2, current: 1, total: 3, name: 'X', label: 'X', title: 'X', names: 'X', hotkey: 'X', example: 'X', initials: 'X', date: 'X', days: 2 }, 2)
      expect(text, key).not.toBe(key)
    }
  })
})
