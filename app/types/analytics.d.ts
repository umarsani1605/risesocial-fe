interface TimeSeriesPoint {
  date: string       // ISO date string
  value: number
  label?: string
}

interface CategoryBreakdown {
  name: string
  value: number
  color?: string
}

interface AnalyticsStat {
  title: string
  value: number | string
  icon: string
  trend?: number        // percentage change
  trendLabel?: string
  color?: string
  to?: string
}

interface AnalyticsOverview {
  totalRevenue: number
  totalRevenueTrend: number
  totalUsers: number
  totalUsersTrend: number
  activeEnrollments: number
  totalAcademies: number
  rylsRegistrations: number
  jobPostings: number
  revenueTrend: TimeSeriesPoint[]   // 30d mini chart
  usersTrend: TimeSeriesPoint[]     // 30d mini chart
}

type AnalyticsPeriod = '7d' | '30d' | '3m' | '6m' | '1y' | 'custom'

interface AnalyticsDateRange {
  period: AnalyticsPeriod
  start: Date
  end: Date
}
