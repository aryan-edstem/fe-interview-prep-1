// crypto.randomUUID only exists in secure contexts (HTTPS or localhost), not plain-HTTP LAN URLs.
export function createId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}
