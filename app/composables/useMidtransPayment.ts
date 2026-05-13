export interface SnapCallbacks {
  onSuccess?: (result: Record<string, unknown>) => void
  onPending?: (result: Record<string, unknown>) => void
  onError?: (error: Record<string, unknown>) => void
  onClose?: () => void
}

export const useMidtransPayment = () => {
  const openSnapEmbed = async (token: string, callbacks: SnapCallbacks = {}) => {
    const snap = await useMidtransSnap()
    if (!snap) throw new Error('Midtrans payment is not available')

    const containerId = 'snap-container'
    snap.hide()

    const { onSuccess = () => {}, onPending = () => {}, onError = () => {}, onClose = () => {} } = callbacks

    snap.embed(token, {
      embedId: containerId,
      onSuccess: (result) => { onSuccess(result) },
      onPending: (result) => { onPending(result) },
      onError: (err) => { onError(err) },
      onClose: () => { onClose() }
    })
  }

  return { openSnapEmbed }
}
