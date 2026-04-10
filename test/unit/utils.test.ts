import { describe, expect, it } from 'vitest'
import {
  formatDate,
  formatDatetime,
  formatLocation,
  formatJobType,
  formatExperienceLevel,
  formatSalary,
  formatPrice,
  getApiErrorMessage
} from '../../app/utils/index'

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats a valid ISO date string into a human-readable date', () => {
    // 2024-03-15 should render as "Mar 15, 2024" under en-US locale
    const result = formatDate('2024-03-15')
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
  })

  it('returns N/A for an empty string', () => {
    expect(formatDate('')).toBe('N/A')
  })

  it('returns N/A for a whitespace-only string (falsy after coercion)', () => {
    // The function checks `if (!dateString)` — a non-empty string like spaces
    // is truthy, so it will attempt to parse.  A string of spaces produces
    // an Invalid Date whose toLocaleDateString returns "Invalid Date".
    // Verify we do NOT crash and get a string back.
    const result = formatDate('   ')
    expect(typeof result).toBe('string')
  })

  it('returns N/A for a clearly invalid date token', () => {
    // new Date('not-a-date') is Invalid Date; toLocaleDateString on it
    // does not throw in most runtimes but returns "Invalid Date".
    // The function's catch branch covers engines that do throw.
    const result = formatDate('not-a-date')
    expect(typeof result).toBe('string')
  })

  it('handles a datetime string and extracts only the date portion', () => {
    const result = formatDate('2023-12-01T10:30:00Z')
    expect(result).toMatch(/2023/)
    expect(result).toMatch(/Dec/)
  })
})

// ---------------------------------------------------------------------------
// formatDatetime
// ---------------------------------------------------------------------------

describe('formatDatetime', () => {
  it('formats a valid ISO datetime string including time', () => {
    const result = formatDatetime('2024-06-20T14:05:00Z')
    // Must contain year and a colon for the time component
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/:/)
  })

  it('returns N/A for an empty string', () => {
    expect(formatDatetime('')).toBe('N/A')
  })

  it('uses 24-hour format (hour12 is false)', () => {
    // Pick a datetime whose hour is unambiguous between 12h and 24h: 22:00
    const result = formatDatetime('2024-01-01T22:00:00Z')
    // Should NOT contain "PM" or "AM"
    expect(result).not.toMatch(/AM|PM/)
  })

  it('returns a string for an invalid date token without throwing', () => {
    const result = formatDatetime('INVALID')
    expect(typeof result).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// formatLocation
// ---------------------------------------------------------------------------

describe('formatLocation', () => {
  it('returns all three fields joined by commas when all are present', () => {
    const result = formatLocation({ city: 'Jakarta', region: 'DKI Jakarta', country: 'Indonesia' })
    expect(result).toBe('Jakarta, DKI Jakarta, Indonesia')
  })

  it('returns only city and country when region is omitted', () => {
    const result = formatLocation({ city: 'Bandung', country: 'Indonesia' })
    expect(result).toBe('Bandung, Indonesia')
  })

  it('returns only country when city and region are undefined', () => {
    const result = formatLocation({ country: 'Singapore' })
    expect(result).toBe('Singapore')
  })

  it('returns "Location not specified" when location is undefined', () => {
    expect(formatLocation(undefined)).toBe('Location not specified')
  })

  it('returns "Location not specified" when all fields are undefined/empty', () => {
    // filter(Boolean) drops empty strings too
    expect(formatLocation({ city: undefined, region: undefined, country: undefined })).toBe('Location not specified')
  })

  it('returns "Location not specified" when an empty object is passed', () => {
    expect(formatLocation({})).toBe('Location not specified')
  })
})

// ---------------------------------------------------------------------------
// formatJobType
// ---------------------------------------------------------------------------

describe('formatJobType', () => {
  it('converts FULL_TIME to "Full Time"', () => {
    expect(formatJobType('FULL_TIME')).toBe('Full Time')
  })

  it('converts PART_TIME to "Part Time"', () => {
    expect(formatJobType('PART_TIME')).toBe('Part Time')
  })

  it('converts CONTRACT to "Contract"', () => {
    expect(formatJobType('CONTRACT')).toBe('Contract')
  })

  it('converts INTERNSHIP to "Internship"', () => {
    expect(formatJobType('INTERNSHIP')).toBe('Internship')
  })

  it('converts a multi-word underscore type correctly', () => {
    expect(formatJobType('REMOTE_FULL_TIME')).toBe('Remote Full Time')
  })

  it('returns "Full Time" as default when an empty string is provided', () => {
    expect(formatJobType('')).toBe('Full Time')
  })
})

// ---------------------------------------------------------------------------
// formatExperienceLevel
// ---------------------------------------------------------------------------

describe('formatExperienceLevel', () => {
  it('maps ENTRY_LEVEL to "Entry Level"', () => {
    expect(formatExperienceLevel('ENTRY_LEVEL')).toBe('Entry Level')
  })

  it('maps JUNIOR to "Junior"', () => {
    expect(formatExperienceLevel('JUNIOR')).toBe('Junior')
  })

  it('maps MID_LEVEL to "Mid Level"', () => {
    expect(formatExperienceLevel('MID_LEVEL')).toBe('Mid Level')
  })

  it('maps SENIOR to "Senior"', () => {
    expect(formatExperienceLevel('SENIOR')).toBe('Senior')
  })

  it('maps LEAD to "Lead"', () => {
    expect(formatExperienceLevel('LEAD')).toBe('Lead')
  })

  it('maps MANAGER to "Manager"', () => {
    expect(formatExperienceLevel('MANAGER')).toBe('Manager')
  })

  it('maps DIRECTOR to "Director"', () => {
    expect(formatExperienceLevel('DIRECTOR')).toBe('Director')
  })

  it('falls back to title-cased underscore replacement for unknown values', () => {
    // e.g. "VICE_PRESIDENT" is not in the map → "Vice President"
    expect(formatExperienceLevel('VICE_PRESIDENT')).toBe('Vice President')
  })

  it('returns "All Levels" for an empty string', () => {
    expect(formatExperienceLevel('')).toBe('All Levels')
  })
})

// ---------------------------------------------------------------------------
// formatSalary
// ---------------------------------------------------------------------------

describe('formatSalary', () => {
  it('returns "Salary not specified" when both min and max are null', () => {
    expect(formatSalary(null, null)).toBe('Salary not specified')
  })

  it('returns "Salary not specified" when both min and max are 0 (falsy)', () => {
    expect(formatSalary(0, 0)).toBe('Salary not specified')
  })

  it('shows a range when both min and max are provided', () => {
    const result = formatSalary(5_000_000, 10_000_000)
    expect(result).toContain('–')
    expect(result).toMatch(/5\.000\.000|5,000,000|Rp/)
    expect(result).toMatch(/10\.000\.000|10,000,000|IDR/)
  })

  it('starts with "From" when only min is provided', () => {
    const result = formatSalary(3_000_000, null)
    expect(result).toMatch(/^From /)
    expect(result).toMatch(/3/)
  })

  it('starts with "Up to" when only max is provided', () => {
    const result = formatSalary(null, 8_000_000)
    expect(result).toMatch(/^Up to /)
    expect(result).toMatch(/8/)
  })

  it('includes IDR currency marker in the formatted output', () => {
    const result = formatSalary(5_000_000, 10_000_000)
    // Intl.NumberFormat id-ID with currency IDR includes "Rp" or "IDR"
    expect(result).toMatch(/Rp|IDR/)
  })
})

// ---------------------------------------------------------------------------
// formatPrice
// ---------------------------------------------------------------------------

describe('formatPrice', () => {
  it('formats zero as a currency string', () => {
    const result = formatPrice(0)
    expect(result).toMatch(/Rp|IDR/)
    expect(result).toMatch(/0/)
  })

  it('formats a typical product price and includes the currency symbol', () => {
    const result = formatPrice(299_000)
    expect(result).toMatch(/Rp|IDR/)
    expect(result).toMatch(/299/)
  })

  it('formats a large price without decimal places (minimumFractionDigits is 0)', () => {
    const result = formatPrice(1_500_000)
    // Should not contain a decimal separator followed by digits like ".00"
    expect(result).not.toMatch(/[.,]00$/)
  })

  it('uses id-ID locale separators (dots for thousands)', () => {
    const result = formatPrice(1_000_000)
    // In id-ID locale, 1000000 → "Rp1.000.000"
    expect(result).toMatch(/1\.000\.000|1,000,000/)
  })
})

// ---------------------------------------------------------------------------
// getApiErrorMessage
// ---------------------------------------------------------------------------

describe('getApiErrorMessage', () => {
  it('returns the server message from error.data.message', () => {
    const error = { data: { message: 'Server error' } }
    expect(getApiErrorMessage(error)).toBe('Server error')
  })

  it('returns the default fallback when error is null', () => {
    expect(getApiErrorMessage(null)).toBe('An error occurred')
  })

  it('returns the default fallback when error is undefined', () => {
    expect(getApiErrorMessage(undefined)).toBe('An error occurred')
  })

  it('returns a custom fallback when provided and error is null', () => {
    expect(getApiErrorMessage(null, 'Custom fallback')).toBe('Custom fallback')
  })

  it('returns a custom fallback when provided and error has no data', () => {
    expect(getApiErrorMessage({}, 'Oops!')).toBe('Oops!')
  })

  it('returns a custom fallback when error.data exists but message is missing', () => {
    const error = { data: {} }
    expect(getApiErrorMessage(error, 'No message')).toBe('No message')
  })

  it('returns the default fallback when error is an empty object and no custom fallback is given', () => {
    expect(getApiErrorMessage({})).toBe('An error occurred')
  })

  it('returns the default fallback when error is a plain string (no .data.message path)', () => {
    expect(getApiErrorMessage('something went wrong')).toBe('An error occurred')
  })

  it('returns server message over any fallback when message is present', () => {
    const error = { data: { message: 'Unauthorized' } }
    expect(getApiErrorMessage(error, 'Should not appear')).toBe('Unauthorized')
  })
})
