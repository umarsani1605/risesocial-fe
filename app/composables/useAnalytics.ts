function periodToQuery(dateRange: AnalyticsDateRange): string {
  const s = dateRange.start.toISOString().split('T')[0]
  const e = dateRange.end.toISOString().split('T')[0]
  return `startDate=${s}&endDate=${e}`
}

export const useAnalytics = () => {
  const { api } = useApi()
  const mock = useAnalyticsMock()

  const fetchOverview = async (): Promise<AnalyticsOverview> => {
    // TODO: return (await api<ApiResponse<AnalyticsOverview>>('/admin/analytics/overview')).data
    return mock.getOverview()
  }

  const fetchRevenueTrend = async (period: AnalyticsPeriod = '30d'): Promise<TimeSeriesPoint[]> => {
    return mock.getRevenueTrend(period)
  }

  const fetchRevenueBreakdown = async (): Promise<CategoryBreakdown[]> => {
    return mock.getRevenueBreakdown()
  }

  const fetchPaymentStatusBreakdown = async (): Promise<CategoryBreakdown[]> => {
    return mock.getPaymentStatusBreakdown()
  }

  const fetchUserGrowth = async (period: AnalyticsPeriod = '30d'): Promise<TimeSeriesPoint[]> => {
    return mock.getUserGrowth(period)
  }

  const fetchRegistrationsTrend = async (period: AnalyticsPeriod = '30d'): Promise<TimeSeriesPoint[]> => {
    return mock.getRegistrationsTrend(period)
  }

  const fetchUserDistribution = async (): Promise<CategoryBreakdown[]> => {
    return mock.getUserDistribution()
  }

  const fetchEnrollmentByAcademy = async (): Promise<CategoryBreakdown[]> => {
    return mock.getEnrollmentByAcademy()
  }

  const fetchCohortFillRates = async (): Promise<CategoryBreakdown[]> => {
    return mock.getCohortFillRates()
  }

  const fetchCompletionRates = async (): Promise<CategoryBreakdown[]> => {
    return mock.getCompletionRates()
  }

  const fetchRylsTrend = async (period: AnalyticsPeriod = '30d'): Promise<TimeSeriesPoint[]> => {
    return mock.getRylsTrend(period)
  }

  const fetchScholarshipBreakdown = async (): Promise<CategoryBreakdown[]> => {
    return mock.getScholarshipBreakdown()
  }

  const fetchJobPostingStats = async (period: AnalyticsPeriod = '30d'): Promise<TimeSeriesPoint[]> => {
    return mock.getJobPostingStats(period)
  }

  const fetchRylsAnalyticsSummary = async (dateRange: AnalyticsDateRange): Promise<RylsAnalyticsSummary> => {
    const res = await api<ApiResponse<RylsAnalyticsSummary>>(
      `/admin/ryls/registrations/analytics/summary?${periodToQuery(dateRange)}`
    )
    return res.data
  }

  const fetchRylsAnalyticsTrend = async (dateRange: AnalyticsDateRange): Promise<RylsAnalyticsTrendPoint[]> => {
    const res = await api<ApiResponse<RylsAnalyticsTrendPoint[]>>(
      `/admin/ryls/registrations/analytics/trend?${periodToQuery(dateRange)}`
    )
    return res.data
  }

  const fetchRylsAnalyticsDemographics = async (dateRange: AnalyticsDateRange): Promise<RylsAnalyticsDemographics> => {
    const res = await api<ApiResponse<RylsAnalyticsDemographics>>(
      `/admin/ryls/registrations/analytics/demographics?${periodToQuery(dateRange)}`
    )
    return res.data
  }

  return {
    fetchOverview,
    fetchRevenueTrend,
    fetchRevenueBreakdown,
    fetchPaymentStatusBreakdown,
    fetchUserGrowth,
    fetchRegistrationsTrend,
    fetchUserDistribution,
    fetchEnrollmentByAcademy,
    fetchCohortFillRates,
    fetchCompletionRates,
    fetchRylsTrend,
    fetchScholarshipBreakdown,
    fetchJobPostingStats,
    fetchRylsAnalyticsSummary,
    fetchRylsAnalyticsTrend,
    fetchRylsAnalyticsDemographics,
  }
}
