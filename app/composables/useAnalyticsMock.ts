import { subDays, subMonths, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns'

// Simple seeded PRNG for consistent data
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return () => {
    hash = ((hash << 5) - hash) + 1
    hash |= 0
    return Math.abs(hash) / 2147483647
  }
}

const academyNames = [
  'Carbon Accounting',
  'ESG Academy',
  'LCA Mini Academy',
  'Sustainable Finance',
  'Green Business'
]

function getDateRange(period: AnalyticsPeriod): { start: Date; end: Date } {
  const end = new Date()
  let start: Date
  switch (period) {
    case '7d': start = subDays(end, 7); break
    case '30d': start = subDays(end, 30); break
    case '3m': start = subMonths(end, 3); break
    case '6m': start = subMonths(end, 6); break
    case '1y': start = subMonths(end, 12); break
    default: start = subDays(end, 30)
  }
  return { start, end }
}

function generateTimeSeries(period: AnalyticsPeriod, baseValue: number, variance: number): TimeSeriesPoint[] {
  const { start, end } = getDateRange(period)
  const points: TimeSeriesPoint[] = []

  // Use weekly for 3m+, monthly for 1y, daily otherwise
  let dates: Date[]
  if (period === '1y') {
    dates = eachMonthOfInterval({ start, end })
  } else if (period === '3m' || period === '6m') {
    dates = eachWeekOfInterval({ start, end })
  } else {
    dates = eachDayOfInterval({ start, end })
  }

  // One RNG instance per series so the sequence is pseudorandom across dates
  const rng = seededRandom(period + baseValue)
  let currentValue = baseValue
  dates.forEach((date) => {
    const change = (rng() - 0.45) * variance
    currentValue = Math.max(0, currentValue + change)
    points.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.round(currentValue)
    })
  })

  return points
}

export const useAnalyticsMock = () => {
  const getOverview = (): AnalyticsOverview => {
    const revenueTrend = generateTimeSeries('30d', 5_000_000, 1_500_000)
    const usersTrend = generateTimeSeries('30d', 18, 3)
    return {
      totalRevenue: 42500000,
      totalRevenueTrend: 12.5,
      totalUsers: 62,
      totalUsersTrend: 8.3,
      activeCohorts: 5,
      activeCohortsTrend: 0,
      rylsRegistrations: 10,
      rylsRegistrationsTrend: 25.0,
      revenueTrend,
      usersTrend
    }
  }

  const getRevenueTrend = (period: AnalyticsPeriod = '30d'): TimeSeriesPoint[] => {
    return generateTimeSeries(period, 2500, 500)
  }

  const getRevenueBreakdown = (): CategoryBreakdown[] => {
    return academyNames.map((name) => {
      const rng = seededRandom(name)
      return { name, value: Math.round(3000 + rng() * 8000) }
    })
  }

  const getPaymentStatusBreakdown = (): CategoryBreakdown[] => [
    { name: 'Paid', value: 14, color: '#22c55e' },
    { name: 'Pending', value: 4, color: '#f59e0b' },
    { name: 'Expired', value: 2, color: '#ef4444' }
  ]

  const getUserGrowth = (period: AnalyticsPeriod = '30d'): TimeSeriesPoint[] => {
    return generateTimeSeries(period, 50, 5)
  }

  const getRegistrationsTrend = (period: AnalyticsPeriod = '30d'): TimeSeriesPoint[] => {
    return generateTimeSeries(period, 30, 4)
  }

  const getUserDistribution = (): CategoryBreakdown[] => [
    { name: 'Carbon Accounting', value: 22 },
    { name: 'ESG Academy', value: 18 },
    { name: 'LCA Mini Academy', value: 10 },
    { name: 'Sustainable Finance', value: 8 },
    { name: 'Green Business', value: 4 }
  ]

  const getEnrollmentByAcademy = (): CategoryBreakdown[] => {
    return academyNames.map((name) => {
      const rng = seededRandom(name + 'enroll')
      return { name, value: Math.round(3 + rng() * 15) }
    })
  }

  const getCohortFillRates = (): CategoryBreakdown[] => [
    { name: 'Batch 1 - Carbon', value: 85 },
    { name: 'Batch 2 - Carbon', value: 72 },
    { name: 'Summer - ESG', value: 60 },
    { name: 'Batch 1 - LCA', value: 90 },
    { name: 'Batch 1 - SF', value: 55 }
  ]

  const getCompletionRates = (): CategoryBreakdown[] => [
    { name: 'Completed', value: 68, color: '#22c55e' },
    { name: 'In Progress', value: 24, color: '#3b82f6' },
    { name: 'Dropped', value: 8, color: '#ef4444' }
  ]

  const getRylsTrend = (period: AnalyticsPeriod = '30d'): TimeSeriesPoint[] => {
    return generateTimeSeries(period, 8, 2)
  }

  const getScholarshipBreakdown = (): CategoryBreakdown[] => [
    { name: 'Fully Funded', value: 7, color: '#8b5cf6' },
    { name: 'Self Funded', value: 3, color: '#06b6d4' }
  ]

  const getJobPostingStats = (period: AnalyticsPeriod = '30d'): TimeSeriesPoint[] => {
    return generateTimeSeries(period, 12, 3)
  }

  return {
    getOverview,
    getRevenueTrend,
    getRevenueBreakdown,
    getPaymentStatusBreakdown,
    getUserGrowth,
    getRegistrationsTrend,
    getUserDistribution,
    getEnrollmentByAcademy,
    getCohortFillRates,
    getCompletionRates,
    getRylsTrend,
    getScholarshipBreakdown,
    getJobPostingStats
  }
}
