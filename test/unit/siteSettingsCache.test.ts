import { describe, expect, it } from 'vitest'

import { getSiteSettingsCacheStorageKey } from '../../server/utils/siteSettingsCache'

describe('site settings cache key', () => {
  it('matches Nitro handler storage format for the public site settings cache', () => {
    expect(getSiteSettingsCacheStorageKey()).toBe('/cache:nitro/handlers:site-settings:public.json')
  })

  it('sanitizes custom keys the same way Nitro cached handlers do', () => {
    expect(getSiteSettingsCacheStorageKey('v=2026-05-31T10:00:00Z')).toBe(
      '/cache:nitro/handlers:site-settings:v20260531T100000Z.json'
    )
  })
})
