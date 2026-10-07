import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { readStorage, writeStorage, type Guard } from '@/lib/storage'

/**
 * `useState` that is saved to localStorage under `key` and restored on load.
 * `isValid` rejects stored data of the wrong shape, falling back to `initialValue`.
 * `key` is read once on mount; remount the component (e.g. via a React `key`) to switch keys.
 * Pass a stable (module-level) `initialValue` and guard so the cross-tab listener is not
 * re-attached every render.
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  isValid: Guard<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(() => readStorage(key, initialValue, isValid))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.storageArea !== window.localStorage) return
      // A null key means another tab called localStorage.clear().
      if (event.key === null || event.key === key) {
        setValue(readStorage(key, initialValue, isValid))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [key, initialValue, isValid])

  return [value, setValue]
}
