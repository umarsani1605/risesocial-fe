export const useAnalytics = () => {
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
    fetchJobPostingStats
  }
}
