/**
 * Load Midtrans Snap.js on client and return window.snap when ready.
 * Picks sandbox/production URL based on runtime config.
 */

declare global {
  interface Window {
    snap?: MidtransSnap
  }
}

interface MidtransSnap {
  hide: () => void
  embed: (token: string, options: MidtransEmbedOptions) => void
}

interface MidtransEmbedOptions {
  embedId: string
  onSuccess: (result: Record<string, unknown>) => void
  onPending: (result: Record<string, unknown>) => void
  onError: (error: Record<string, unknown>) => void
  onClose: () => void
}

export const useMidtransSnap = async (): Promise<MidtransSnap | null> => {
  if (!import.meta.client) return null

  if (window.snap) return window.snap

  const config = useRuntimeConfig()
  const isProduction = (config.public.midtransMode || 'SANDBOX') === 'PRODUCTION'
  const clientKey = (config.public.midtransClientKey as string) || ''
  const src = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-midtrans]')
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.setAttribute('data-midtrans', 'true')
    script.src = src
    script.async = true
    script.setAttribute('data-client-key', clientKey)
    script.onload = () => resolve()
    script.onerror = (e) => reject(e)
    document.head.appendChild(script)
  })

  return window.snap || null
}
