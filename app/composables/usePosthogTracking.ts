/* eslint-disable no-unused-vars */
type PostHogClientLike = {
  capture?: (..._args: [string, Record<string, unknown>?]) => void
  identify?: (..._args: [string, Record<string, unknown>?]) => void
  get_distinct_id?: () => string
  get_session_id?: () => string
  reset?: () => void
}
/* eslint-enable no-unused-vars */

function getPostHogClient() {
  if (!import.meta.client) {
    return null
  }

  return usePostHog() as PostHogClientLike | null
}

function buildUserName(user: Pick<UserProfile, 'first_name' | 'last_name'> | null | undefined) {
  if (!user) return ''
  return `${user.first_name} ${user.last_name}`.trim()
}

export function identifyPostHogUser(user: UserProfile | null | undefined) {
  const posthog = getPostHogClient()
  if (!posthog?.identify || !user?.id) {
    return
  }

  posthog.identify(String(user.id), {
    email: user.email,
    name: buildUserName(user),
    role: user.role,
  })
}

export function capturePostHogEvent(event: string, properties: Record<string, unknown> = {}) {
  const posthog = getPostHogClient()
  posthog?.capture?.(event, {
    source: 'frontend',
    ...properties,
  })
}

export function resetPostHogUser() {
  const posthog = getPostHogClient()
  posthog?.reset?.()
}

export function getPostHogRequestHeaders() {
  const posthog = getPostHogClient()
  const distinctId = posthog?.get_distinct_id?.()
  const sessionId = posthog?.get_session_id?.()

  return {
    distinctId,
    sessionId,
  }
}
