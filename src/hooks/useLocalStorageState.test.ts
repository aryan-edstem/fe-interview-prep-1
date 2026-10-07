import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'

const isString = (value: unknown): value is string => typeof value === 'string'

afterEach(() => {
  localStorage.clear()
})

describe('useLocalStorageState', () => {
  it('starts with the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorageState('name', 'guest', isString))

    expect(result.current[0]).toBe('guest')
  })

  it('saves updates and restores them on the next mount', () => {
    const first = renderHook(() => useLocalStorageState('name', 'guest', isString))
    act(() => {
      first.result.current[1]('ada')
    })
    first.unmount()

    const second = renderHook(() => useLocalStorageState('name', 'guest', isString))

    expect(second.result.current[0]).toBe('ada')
  })

  it('picks up changes made in another tab', () => {
    const { result } = renderHook(() => useLocalStorageState('name', 'guest', isString))

    act(() => {
      localStorage.setItem('name', '"grace"')
      window.dispatchEvent(new StorageEvent('storage', { key: 'name', storageArea: localStorage }))
    })

    expect(result.current[0]).toBe('grace')
  })

  it('falls back to the initial value when another tab clears storage', () => {
    localStorage.setItem('name', '"ada"')
    const { result } = renderHook(() => useLocalStorageState('name', 'guest', isString))

    act(() => {
      localStorage.clear()
      window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: localStorage }))
    })

    expect(result.current[0]).toBe('guest')
  })

  it('ignores sessionStorage events', () => {
    const { result } = renderHook(() => useLocalStorageState('name', 'guest', isString))

    act(() => {
      localStorage.setItem('name', '"grace"')
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'name', storageArea: sessionStorage }),
      )
    })

    expect(result.current[0]).toBe('guest')
  })
})
