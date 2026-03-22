import type { AdminCohortDetail } from '~/types/cohort'

export function useAdminCohort(cohortId: string) {
  const { api } = useApi()
  const toast = useToast()

  const { data: cohortData, refresh: refreshCohort } = useAsyncData(
    `admin-cohort-${cohortId}`,
    () => api<ApiResponse<AdminCohortDetail>>(`/admin/cohorts/${cohortId}`)
  )

  const detail = computed(() => cohortData.value?.data)

  const isEditCohortOpen = ref(false)
  const isEditingCohort = ref(false)

  const editCohortForm = reactive({
    name: '',
    description: '',
    status: 'not_started' as AdminCohortDetail['status'],
    start_date: '',
    end_date: '',
    max_students: 0
  })

  function openEditCohort() {
    if (!detail.value) return
    editCohortForm.name = detail.value.name
    editCohortForm.description = detail.value.description ?? ''
    editCohortForm.status = detail.value.status
    editCohortForm.start_date = detail.value.start_date?.split('T')[0] ?? ''
    editCohortForm.end_date = detail.value.end_date?.split('T')[0] ?? ''
    editCohortForm.max_students = detail.value.max_students
    isEditCohortOpen.value = true
  }

  async function onEditCohort() {
    isEditingCohort.value = true
    try {
      await api(`/admin/cohorts/${cohortId}`, {
        method: 'PUT',
        body: {
          name: editCohortForm.name,
          description: editCohortForm.description || null,
          status: editCohortForm.status,
          start_date: editCohortForm.start_date,
          end_date: editCohortForm.end_date,
          max_students: editCohortForm.max_students
        }
      })
      toast.add({ title: 'Cohort updated', color: 'success' })
      isEditCohortOpen.value = false
      await refreshCohort()
    } catch (error: any) {
      toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
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
    } catch (error: any) {
      toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
    } finally {
      isDeletingCohort.value = false
    }
  }

  return reactive({
    detail,
    refreshCohort,
    // edit + delete cohort
    editCohortForm,
    isEditCohortOpen,
    isEditingCohort,
    openEditCohort,
    onEditCohort,
    isDeleteCohortOpen,
    isDeletingCohort,
    onDeleteCohort
  })
}
