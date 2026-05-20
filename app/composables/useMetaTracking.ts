type MetaPixelProxy = ReturnType<typeof useScriptMetaPixel>['proxy']

type MetaEventName =
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Purchase'
  | 'CompleteRegistration'
  | 'CompleteRegistrationStep2'
  | 'CompleteRegistrationStep3'
  | 'RYLSRegisterClick'
  | 'RYLSGuidebookClick'

type MetaTrackingOptions = {
  pixelProxy?: MetaPixelProxy
  eventIdFactory?: () => string
  apiBaseUrl?: string
}

type TrackMetaEventInput = {
  eventName: MetaEventName
  eventId?: string
  eventSourceUrl?: string
  pixelId?: string | null
  customData?: Record<string, unknown>
  userData?: Record<string, unknown>
}

const standardEvents = new Set([
  'ViewContent',
  'InitiateCheckout',
  'Lead',
  'Purchase',
  'CompleteRegistration'
])

function generateEventId() {
  if (import.meta.client && typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getCookieValue(name: string) {
  if (!import.meta.client) return undefined

  const cookie = document.cookie
    .split('; ')
    .find(item => item.startsWith(`${name}=`))

  if (!cookie) return undefined
  return decodeURIComponent(cookie.slice(name.length + 1))
}

function getCurrentUrl() {
  if (!import.meta.client) return undefined
  return window.location.href
}

function getMetaPixelProxy() {
  try {
    const { proxy } = useScriptMetaPixel()
    return proxy
  } catch {
    return undefined
  }
}

export function useMetaTracking(options: MetaTrackingOptions = {}) {
  const config = useRuntimeConfig()
  const apiBaseUrl = options.apiBaseUrl ?? config.public.apiBaseUrl
  const defaultPixelProxy = options.pixelProxy ?? getMetaPixelProxy()

  async function trackMetaEvent(input: TrackMetaEventInput) {
    const eventId = input.eventId ?? options.eventIdFactory?.() ?? generateEventId()
    const customData = input.customData ?? {}
    const pixelId = input.pixelId || undefined
    const proxy = defaultPixelProxy

    if (proxy) {
      const eventOptions = { eventID: eventId }
      const isStandardEvent = standardEvents.has(input.eventName)

      if (pixelId && isStandardEvent) {
        proxy.fbq('trackSingle', pixelId, input.eventName, customData, eventOptions)
      } else if (pixelId) {
        proxy.fbq('trackSingleCustom', pixelId, input.eventName, customData, eventOptions)
      } else if (isStandardEvent) {
        proxy.fbq('track', input.eventName, customData, eventOptions)
      } else {
        proxy.fbq('trackCustom', input.eventName, customData, eventOptions)
      }
    }

    const requestOptions: Parameters<typeof $fetch>[1] = {
      method: 'POST',
      body: {
        event_name: input.eventName,
        event_id: eventId,
        event_source_url: input.eventSourceUrl ?? getCurrentUrl(),
        ...(pixelId && { pixel_id: pixelId }),
        custom_data: customData,
        user_data: input.userData ?? {},
        fbp: getCookieValue('_fbp'),
        fbc: getCookieValue('_fbc')
      }
    }

    if (apiBaseUrl) {
      requestOptions.baseURL = apiBaseUrl
    }

    await $fetch('/tracking/event', requestOptions).catch(() => undefined)
    return eventId
  }

  return { trackMetaEvent }
}
