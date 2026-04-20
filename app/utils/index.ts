export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

export function formatDateMonth(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
    })
  } catch {
    return 'N/A'
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

export function formatDatetime(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch {
    return 'N/A'
  }
}

export function formatDateLong(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

export function formatDatetimeLong(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch {
    return 'N/A'
  }
}

export function formatLocation(location?: { city?: string; region?: string; country?: string }): string {
  if (!location) return 'Location not specified'
  return [location.city, location.region, location.country].filter(Boolean).join(', ') || 'Location not specified'
}

export function formatJobType(type: string): string {
  if (!type) return 'Full Time'
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export function formatExperienceLevel(level: string): string {
  if (!level) return 'All Levels'
  const map: Record<string, string> = {
    ENTRY_LEVEL: 'Entry Level',
    JUNIOR: 'Junior',
    MID_LEVEL: 'Mid Level',
    SENIOR: 'Senior',
    LEAD: 'Lead',
    MANAGER: 'Manager',
    DIRECTOR: 'Director'
  }
  return map[level] ?? level.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not specified'
  const fmt = (n: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

export function getApiErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  const data = (error as Record<string, unknown> & { data?: Record<string, string> })?.data
  return data?.details ?? data?.message ?? fallback
}

// ── Cohort module utilities ───────────────────────────────────────────────────

export function formatTime(isoString: string): string {
  if (!isoString) return 'N/A'
  try {
    return new Date(isoString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    })
  } catch {
    return 'N/A'
  }
}

export type ModuleStatusInput = {
  session_start_time: string | null
  session_end_time: string | null
}

export function computeModuleStatus(
  module: ModuleStatusInput,
  now: Date
): 'upcoming' | 'live' | 'completed' {
  if (!module.session_start_time) return 'upcoming'
  const start = new Date(module.session_start_time)
  const end = module.session_end_time ? new Date(module.session_end_time) : null
  if (now < start) return 'upcoming'
  if (end && now > end) return 'completed'
  if (!end && now > new Date(start.getTime() + 120 * 60 * 1000)) return 'completed'
  return 'live'
}
