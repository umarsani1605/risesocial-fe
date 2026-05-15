export function useAdminCohort(cohortId: string) {
  const { api } = useApi()
  const toast = useToast()

  const { data: cohortData, refresh: refreshCohort } = useAsyncData(
    `admin-cohort-${cohortId}`,
    () => api<ApiResponse<AdminCohortDetail>>(`/admin/cohorts/${cohortId}`)
  )

  const detail = computed(() => cohortData.value?.data)

  const isEditingCohort = ref(false)

  const editCohortForm = reactive({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  })

  async function onEditCohort() {
    isEditingCohort.value = true
    try {
      await api(`/admin/cohorts/${cohortId}`, {
        method: 'PUT',
        body: {
          name: editCohortForm.name,
          description: editCohortForm.description || null,
          start_date: editCohortForm.start_date,
          end_date: editCohortForm.end_date,
        }
      })
      toast.add({ title: 'Cohort updated', color: 'success' })
      await refreshCohort()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isEditingCohort.value = false
    }
  }

  const isDeleteCohortOpen = ref(false)
  const isDeletingCohort = ref(false)

  async function onDeleteCohort() {
    isDeletingCohort.value = true
    try {
      await api(`/admin/cohorts/${cohortId}`, { method: 'DELETE' })
      toast.add({ title: 'Cohort deleted', color: 'success' })
      await navigateTo('/admin/cohorts')
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDeletingCohort.value = false
    }
  }

  return reactive({
    detail,
    refreshCohort,
    // edit + delete cohort
    editCohortForm,
    isEditingCohort,
    onEditCohort,
    isDeleteCohortOpen,
    isDeletingCohort,
    onDeleteCohort
  })
}
