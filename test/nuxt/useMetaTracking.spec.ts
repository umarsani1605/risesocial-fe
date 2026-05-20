import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useMetaTracking } from '../../app/composables/useMetaTracking'

describe('useMetaTracking', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    document.cookie = '_fbp=; Max-Age=0; path=/'
    document.cookie = '_fbc=; Max-Age=0; path=/'
    document.cookie = '_fbp=fb.1.123; path=/'
    document.cookie = '_fbc=fb.1.456; path=/'
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ success: true }))
  })

  it('sends Pixel and CAPI with the same event id', async () => {
    const fbq = vi.fn()
    const { trackMetaEvent } = useMetaTracking({
      pixelProxy: { fbq } as never,
      eventIdFactory: () => 'event-123'
    })

    const eventId = await trackMetaEvent({
      eventName: 'Lead',
      eventSourceUrl: 'https://risesocial.org/success',
      customData: { value: 15, currency: 'USD' },
      userData: { email: 'umar@example.com' }
    })

    expect(eventId).toBe('event-123')
    expect(fbq).toHaveBeenCalledWith(
      'track',
      'Lead',
      { value: 15, currency: 'USD' },
      { eventID: 'event-123' }
    )
    expect($fetch).toHaveBeenCalledWith('/tracking/event', {
      method: 'POST',
      body: expect.objectContaining({
        event_name: 'Lead',
        event_id: 'event-123',
        event_source_url: 'https://risesocial.org/success',
        custom_data: { value: 15, currency: 'USD' },
        user_data: { email: 'umar@example.com' },
        fbp: 'fb.1.123',
        fbc: 'fb.1.456'
      })
    })
  })

  it('sends academy events to a specific pixel id', async () => {
    const fbq = vi.fn()
    const { trackMetaEvent } = useMetaTracking({
      pixelProxy: { fbq } as never,
      eventIdFactory: () => 'academy-event-123'
    })

    await trackMetaEvent({
      eventName: 'Purchase',
      pixelId: 'academy-pixel',
      eventId: 'TRX-001',
      eventSourceUrl: 'https://risesocial.org/academy/esg/payment',
      customData: { value: 150000, currency: 'IDR' }
    })

    expect(fbq).toHaveBeenCalledWith(
      'trackSingle',
      'academy-pixel',
      'Purchase',
      { value: 150000, currency: 'IDR' },
      { eventID: 'TRX-001' }
    )
    expect($fetch).toHaveBeenCalledWith('/tracking/event', {
      method: 'POST',
      body: expect.objectContaining({
        event_name: 'Purchase',
        event_id: 'TRX-001',
        pixel_id: 'academy-pixel'
      })
    })
  })
})
