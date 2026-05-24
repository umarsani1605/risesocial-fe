export function getAuthCookieOptions({
  isHttps,
  isProduction
}: {
  isHttps: boolean
  isProduction: boolean
}) {
  return {
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    secure: isHttps || isProduction
  }
}
