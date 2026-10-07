export type Guard<T> = (value: unknown) => value is T

export function readStorage<T>(key: string, fallback: T, isValid: Guard<T>): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked (e.g. private mode): keep working with in-memory state.
  }
}
