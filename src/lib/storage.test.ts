import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStorage, writeStorage } from '@/lib/storage'

const isNumber = (value: unknown): value is number => typeof value === 'number'

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('readStorage', () => {
  it('returns the fallback when the key is missing', () => {
    expect(readStorage('missing', 7, isNumber)).toBe(7)
  })

  it('returns the stored value when it passes the guard', () => {
    localStorage.setItem('count', '42')

    expect(readStorage('count', 0, isNumber)).toBe(42)
  })

  it('returns the fallback for malformed JSON', () => {
    localStorage.setItem('count', '{not json')

    expect(readStorage('count', 0, isNumber)).toBe(0)
  })

  it('returns the fallback when the stored value fails the guard', () => {
    localStorage.setItem('count', '"forty-two"')

    expect(readStorage('count', 0, isNumber)).toBe(0)
  })
})

describe('writeStorage', () => {
  it('stores the value as JSON', () => {
    writeStorage('items', ['a', 'b'])

    expect(localStorage.getItem('items')).toBe('["a","b"]')
  })

  it('does not throw when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    expect(() => {
      writeStorage('items', [])
    }).not.toThrow()
  })
})
