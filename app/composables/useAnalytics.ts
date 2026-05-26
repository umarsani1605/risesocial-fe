function periodToQuery(dateRange: AnalyticsDateRange): string {
  return new URLSearchParams(dateRangeToQuery(dateRange)).toString()
}

function dateRangeToQuery(dateRange?: AnalyticsDateRange): Record<string, string> {
  if (!dateRange) return {}

  return {
    period: dateRange.period,
    startDate: dateRange.start.toISOString().slice(0, 10),
    endDate: dateRange.end.toISOString().slice(0, 10)
  }
}

export function periodToDateRange(period: AnalyticsPeriod = '30d'): AnalyticsDateRange {
  const end = new Date()
  const start = new Date(end)
  const daysByPeriod: Record<Exclude<AnalyticsPeriod, 'custom'>, number> = {
    '7d': 7,
    '30d': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365
  }

  start.setDate(end.getDate() - ((daysByPeriod[period as Exclude<AnalyticsPeriod, 'custom'>] ?? 30) - 1))

  return {
    period,
    start,
    end
  }
}

function normalizeDateRange(input?: AnalyticsDateRange | AnalyticsPeriod): AnalyticsDateRange {
  if (!input || typeof input === 'string') return periodToDateRange(input)
  return input
}

export const useAnalytics = () => {
  const { api } = useApi()

  const fetchOverview = async (): Promise<AnalyticsOverview> => {
    return (await api<ApiResponse<AnalyticsOverview>>('/admin/analytics/overview')).data
  }

  const fetchRevenueTrend = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<TimeSeriesPoint[]> => {
    const res = await api<ApiResponse<TimeSeriesPoint[]>>('/admin/analytics/revenue/trend', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchRevenueBreakdown = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    return fetchRevenueByType(dateRange)
  }

  const fetchPaymentStatusBreakdown = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    const res = await api<ApiResponse<CategoryBreakdown[]>>('/admin/analytics/revenue/payment-status', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchRevenueByType = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    const res = await api<ApiResponse<CategoryBreakdown[]>>('/admin/analytics/revenue/by-type', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchUserGrowth = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<TimeSeriesPoint[]> => {
    return fetchRegistrationsTrend(dateRange)
  }

  const fetchRegistrationsTrend = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<TimeSeriesPoint[]> => {
    const res = await api<ApiResponse<TimeSeriesPoint[]>>('/admin/analytics/users/registrations-trend', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchUserDistribution = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    const res = await api<ApiResponse<CategoryBreakdown[]>>('/admin/analytics/users/distribution', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchEnrollmentByAcademy = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    const res = await api<ApiResponse<CategoryBreakdown[]>>('/admin/analytics/academies/enrollments', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchCohortFillRates = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    const res = await api<ApiResponse<CategoryBreakdown[]>>('/admin/analytics/academies/cohort-students', {
      query: dateRangeToQuery(normalizeDateRange(dateRange))
    })
    return res.data
  }

  const fetchRylsTrend = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<TimeSeriesPoint[]> => {
    const trend = await fetchRylsAnalyticsTrend(normalizeDateRange(dateRange))
    return trend.map((point) => ({ date: point.date, value: point.count }))
  }

  const fetchScholarshipBreakdown = async (dateRange?: AnalyticsDateRange | AnalyticsPeriod): Promise<CategoryBreakdown[]> => {
    const demographics = await fetchRylsAnalyticsDemographics(normalizeDateRange(dateRange))
    return demographics.byScholarshipType.map((item) => ({ name: item.name, value: item.count }))
  }

  const fetchRylsAnalyticsSummary = async (dateRange: AnalyticsDateRange): Promise<RylsAnalyticsSummary> => {
    const res = await api<ApiResponse<RylsAnalyticsSummary>>(
      `/admin/analytics/programs/summary?${periodToQuery(dateRange)}`
    )
    return res.data
  }

  const fetchRylsAnalyticsTrend = async (dateRange: AnalyticsDateRange): Promise<RylsAnalyticsTrendPoint[]> => {
    const res = await api<ApiResponse<RylsAnalyticsTrendPoint[]>>(
      `/admin/analytics/programs/trend?${periodToQuery(dateRange)}`
    )
    return res.data
  }

  const fetchRylsAnalyticsDemographics = async (dateRange: AnalyticsDateRange): Promise<RylsAnalyticsDemographics> => {
    const res = await api<ApiResponse<RylsAnalyticsDemographics>>(
      `/admin/analytics/programs/demographics?${periodToQuery(dateRange)}`
    )
    return res.data
  }

  return {
    fetchOverview,
    fetchRevenueTrend,
    fetchRevenueBreakdown,
    fetchPaymentStatusBreakdown,
    fetchRevenueByType,
    fetchUserGrowth,
    fetchRegistrationsTrend,
    fetchUserDistribution,
    fetchEnrollmentByAcademy,
    fetchCohortFillRates,
    fetchRylsTrend,
    fetchScholarshipBreakdown,
    fetchRylsAnalyticsSummary,
    fetchRylsAnalyticsTrend,
    fetchRylsAnalyticsDemographics,
  }
}
