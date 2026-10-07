import { afterEach, describe, expect, it, vi } from 'vitest'
import { createId } from '@/lib/id'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createId', () => {
  it('returns unique ids', () => {
    expect(createId()).not.toBe(createId())
  })

  it('still works when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {})

    const first = createId()
    const second = createId()

    expect(first).toEqual(expect.any(String))
    expect(first).not.toBe(second)
  })
})
