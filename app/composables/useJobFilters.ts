export const useJobFilters = () => {
  const route = useRoute()
  const router = useRouter()

  const appliedFilters = reactive({
    search: (route.query.search as string) || '',
    location: (route.query.location as string) || '',
    company: (route.query.company as string) || '',
    jobType: (route.query.jobType as string) || '',
    experienceLevel: (route.query.experienceLevel as string) || '',
    isRemote: route.query.isRemote === 'true' ? true : undefined as boolean | undefined,
    page: Number(route.query.page) || 1,
    limit: 12
  })

  const pendingFilters = reactive({
    search: appliedFilters.search,
    location: appliedFilters.location,
    company: appliedFilters.company,
    jobType: appliedFilters.jobType,
    experienceLevel: appliedFilters.experienceLevel,
    isRemote: appliedFilters.isRemote
  })

  const hasActiveFilters = computed(() =>
    !!(
      appliedFilters.search ||
      appliedFilters.location ||
      appliedFilters.company ||
      appliedFilters.jobType ||
      appliedFilters.experienceLevel ||
      appliedFilters.isRemote
    )
  )

  const updateURL = () => {
    const query: Record<string, string> = {}
    if (appliedFilters.search) query.search = appliedFilters.search
    if (appliedFilters.location) query.location = appliedFilters.location
    if (appliedFilters.company) query.company = appliedFilters.company
    if (appliedFilters.jobType) query.jobType = appliedFilters.jobType
    if (appliedFilters.experienceLevel) query.experienceLevel = appliedFilters.experienceLevel
    if (appliedFilters.isRemote) query.isRemote = 'true'
    if (appliedFilters.page > 1) query.page = appliedFilters.page.toString()
    router.push({ query })
  }

  const applyFilters = (onApply?: () => void) => {
    appliedFilters.search = pendingFilters.search
    appliedFilters.location = pendingFilters.location
    appliedFilters.company = pendingFilters.company
    appliedFilters.jobType = pendingFilters.jobType
    appliedFilters.experienceLevel = pendingFilters.experienceLevel
    appliedFilters.isRemote = pendingFilters.isRemote
    appliedFilters.page = 1
    updateURL()
    onApply?.()
  }

  const clearAllFilters = (onClear?: () => void) => {
    pendingFilters.search = ''
    pendingFilters.location = ''
    pendingFilters.company = ''
    pendingFilters.jobType = ''
    pendingFilters.experienceLevel = ''
    pendingFilters.isRemote = undefined

    appliedFilters.search = ''
    appliedFilters.location = ''
    appliedFilters.company = ''
    appliedFilters.jobType = ''
    appliedFilters.experienceLevel = ''
    appliedFilters.isRemote = undefined
    appliedFilters.page = 1

    updateURL()
    onClear?.()
  }

  const goToPage = (page: number, totalPages: number, onNavigate?: () => void) => {
    if (page >= 1 && page <= totalPages) {
      appliedFilters.page = page
      updateURL()
      onNavigate?.()
      if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return {
    appliedFilters,
    pendingFilters,
    hasActiveFilters,
    applyFilters,
    clearAllFilters,
    goToPage
  }
}
