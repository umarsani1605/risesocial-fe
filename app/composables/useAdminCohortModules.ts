import { parseDate, parseTime } from '@internationalized/date'
import type { CalendarDate, Time } from '@internationalized/date'
import type { AdminCohortModule, AdminCohortAttachment, PendingAttachment } from '~/types/cohort'

interface UseAdminCohortModulesOptions {
  cohortId: string
  refreshCohort: () => Promise<void>
}

function calendarDateTimeToISO(
  date: { year: number; month: number; day: number } | null | undefined,
  time: { hour: number; minute: number } | null | undefined
): string | null {
  if (!date || !time) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  return new Date(
    `${date.year}-${pad(date.month)}-${pad(date.day)}T${pad(time.hour)}:${pad(time.minute)}:00+07:00`
  ).toISOString()
}

export function useAdminCohortModules(options: UseAdminCohortModulesOptions) {
  const { cohortId, refreshCohort } = options
  const { api } = useApi()
  const toast = useToast()

  // ── Add Module ────────────────────────────────────────────────────────────────

  const isAddModuleOpen = ref(false)
  const isAddingModule = ref(false)
  const saveAndAddMore = ref(false)
  const addModuleForm = reactive({
    title: '',
    description: '',
    sessionDate: null as CalendarDate | null,
    sessionStartTime: null as Time | null,
    sessionEndTime: null as Time | null,
    meetingLink: '',
    attendanceLink: '',
    assignmentTitle: '',
    assignmentLink: '',
    assignmentDeadlineDate: null as CalendarDate | null,
    assignmentDeadlineTime: null as Time | null,
    isPublished: true,
  })

  const pendingAttachments = ref<PendingAttachment[]>([])

  function addPendingLink(url: string, label: string) {
    pendingAttachments.value.push({ id: crypto.randomUUID(), type: 'external_link', label, url })
  }

  function addPendingFile(file: File, label: string) {
    pendingAttachments.value.push({ id: crypto.randomUUID(), type: 'file', label: label || file.name, file })
  }

  function removePendingAttachment(id: string) {
    pendingAttachments.value = pendingAttachments.value.filter(a => a.id !== id)
  }

  function resetAddModuleForm() {
    addModuleForm.title = ''
    addModuleForm.description = ''
    addModuleForm.sessionDate = null
    addModuleForm.sessionStartTime = null
    addModuleForm.sessionEndTime = null
    addModuleForm.meetingLink = ''
    addModuleForm.attendanceLink = ''
    addModuleForm.assignmentTitle = ''
    addModuleForm.assignmentLink = ''
    addModuleForm.assignmentDeadlineDate = null
    addModuleForm.assignmentDeadlineTime = null
    addModuleForm.isPublished = true
    pendingAttachments.value = []
  }

  async function submitAddModule() {
    if (!addModuleForm.title) {
      toast.add({ title: 'Title is required', color: 'error' })
      return
    }
    isAddingModule.value = true
    try {
      const res = await api<ApiResponse<AdminCohortModule>>(`/admin/cohorts/${cohortId}/modules`, {
        method: 'POST',
        body: {
          title: addModuleForm.title,
          description: addModuleForm.description || null,
          session_start_time: calendarDateTimeToISO(addModuleForm.sessionDate, addModuleForm.sessionStartTime),
          session_end_time: calendarDateTimeToISO(addModuleForm.sessionDate, addModuleForm.sessionEndTime),
          meeting_link: addModuleForm.meetingLink || null,
          attendance_link: addModuleForm.attendanceLink || null,
          assignment_title: addModuleForm.assignmentTitle || null,
          assignment_link: addModuleForm.assignmentLink || null,
          assignment_deadline: calendarDateTimeToISO(addModuleForm.assignmentDeadlineDate, addModuleForm.assignmentDeadlineTime),
          is_published: addModuleForm.isPublished
        }
      })

      const moduleId = res.data.id

      let attachmentErrors = 0
      for (const att of pendingAttachments.value) {
        try {
          if (att.type === 'file' && att.file) {
            const fd = new FormData()
            fd.append('type', 'file')
            fd.append('file', att.file)
            if (att.label) fd.append('label', att.label)
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, { method: 'POST', body: fd })
          } else if (att.type === 'external_link' && att.url) {
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, {
              method: 'POST',
              body: { type: 'external_link', url: att.url, label: att.label }
            })
          }
        } catch {
          attachmentErrors++
        }
      }

      if (attachmentErrors > 0) {
        toast.add({ title: `Module added, but ${attachmentErrors} attachment(s) failed to upload`, color: 'warning' })
      } else {
        toast.add({ title: 'Module added', color: 'success' })
      }
      await refreshCohort()
      if (saveAndAddMore.value) {
        resetAddModuleForm()
      } else {
        isAddModuleOpen.value = false
      }
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isAddingModule.value = false
    }
  }

  // ── Edit Module ───────────────────────────────────────────────────────────────

  const isEditModuleOpen = ref(false)
  const isEditingModule = ref(false)
  const editingModule = ref<AdminCohortModule | null>(null)
  const editModuleForm = reactive({
    title: '',
    description: '',
    sessionDate: null as CalendarDate | null,
    sessionStartTime: null as Time | null,
    sessionEndTime: null as Time | null,
    meetingLink: '',
    attendanceLink: '',
    assignmentTitle: '',
    assignmentLink: '',
    assignmentDeadlineDate: null as CalendarDate | null,
    assignmentDeadlineTime: null as Time | null,
    isPublished: true
  })

  const moduleAttachments = ref<AdminCohortAttachment[]>([])
  const isDeletingAttachment = ref(false)

  const editPendingAttachments = ref<PendingAttachment[]>([])

  function addEditPendingLink(url: string, label: string) {
    editPendingAttachments.value.push({ id: crypto.randomUUID(), type: 'external_link', label, url })
  }

  function addEditPendingFile(file: File, label: string) {
    editPendingAttachments.value.push({ id: crypto.randomUUID(), type: 'file', label: label || file.name, file })
  }

  function removeEditPendingAttachment(id: string) {
    editPendingAttachments.value = editPendingAttachments.value.filter(a => a.id !== id)
  }

  function openEditModule(module: AdminCohortModule) {
    editingModule.value = module
    editModuleForm.title = module.title
    editModuleForm.description = module.description ?? ''

    if (module.session_start_time) {
      const dateStr = new Date(module.session_start_time)
        .toLocaleDateString('sv', { timeZone: 'Asia/Jakarta' })
      editModuleForm.sessionDate = parseDate(dateStr)

      const startTimeStr = new Date(module.session_start_time)
        .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
      editModuleForm.sessionStartTime = parseTime(startTimeStr)

      if (module.session_end_time) {
        const endTimeStr = new Date(module.session_end_time)
          .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
        editModuleForm.sessionEndTime = parseTime(endTimeStr)
      } else {
        editModuleForm.sessionEndTime = null
      }
    } else {
      editModuleForm.sessionDate = null
      editModuleForm.sessionStartTime = null
      editModuleForm.sessionEndTime = null
    }

    editModuleForm.meetingLink = module.meeting_link ?? ''
    editModuleForm.attendanceLink = module.attendance_link ?? ''
    editModuleForm.assignmentTitle = module.assignment_title ?? ''
    editModuleForm.assignmentLink = module.assignment_link ?? ''

    if (module.assignment_deadline) {
      const deadlineDateStr = new Date(module.assignment_deadline)
        .toLocaleDateString('sv', { timeZone: 'Asia/Jakarta' })
      editModuleForm.assignmentDeadlineDate = parseDate(deadlineDateStr)

      const deadlineTimeStr = new Date(module.assignment_deadline)
        .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
      editModuleForm.assignmentDeadlineTime = parseTime(deadlineTimeStr)
    } else {
      editModuleForm.assignmentDeadlineDate = null
      editModuleForm.assignmentDeadlineTime = null
    }

    editModuleForm.isPublished = module.is_published
    moduleAttachments.value = [...(module.attachments ?? [])]
    editPendingAttachments.value = []
    isEditModuleOpen.value = true
  }

  async function submitEditModule() {
    if (!editingModule.value) return
    isEditingModule.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/modules/${editingModule.value.id}`, {
        method: 'PUT',
        body: {
          title: editModuleForm.title,
          description: editModuleForm.description || null,
          session_start_time: calendarDateTimeToISO(editModuleForm.sessionDate, editModuleForm.sessionStartTime),
          session_end_time: calendarDateTimeToISO(editModuleForm.sessionDate, editModuleForm.sessionEndTime),
          meeting_link: editModuleForm.meetingLink || null,
          attendance_link: editModuleForm.attendanceLink || null,
          assignment_title: editModuleForm.assignmentTitle || null,
          assignment_link: editModuleForm.assignmentLink || null,
          assignment_deadline: calendarDateTimeToISO(editModuleForm.assignmentDeadlineDate, editModuleForm.assignmentDeadlineTime),
          is_published: editModuleForm.isPublished
        }
      })

      const moduleId = editingModule.value.id
      let attachmentErrors = 0
      for (const att of editPendingAttachments.value) {
        try {
          if (att.type === 'file' && att.file) {
            const fd = new FormData()
            fd.append('type', 'file')
            fd.append('file', att.file)
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, { method: 'POST', body: fd })
          } else if (att.type === 'external_link' && att.url) {
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, {
              method: 'POST', body: { type: 'external_link', url: att.url, label: att.label }
            })
          }
        } catch { attachmentErrors++ }
      }

      if (attachmentErrors > 0) {
        toast.add({ title: `Module updated, but ${attachmentErrors} attachment(s) failed`, color: 'warning' })
      } else {
        toast.add({ title: 'Module updated', color: 'success' })
      }
      isEditModuleOpen.value = false
      await refreshCohort()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isEditingModule.value = false
    }
  }

  async function submitDeleteAttachment(attachmentId: number) {
    if (!editingModule.value) return
    isDeletingAttachment.value = true
    try {
      await api(
        `/admin/cohorts/${cohortId}/modules/${editingModule.value.id}/attachments/${attachmentId}`,
        { method: 'DELETE' }
      )
      moduleAttachments.value = moduleAttachments.value.filter(a => a.id !== attachmentId)
      toast.add({ title: 'Attachment deleted', color: 'success' })
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDeletingAttachment.value = false
    }
  }

  // ── Delete Module ─────────────────────────────────────────────────────────────

  const isDeleteModuleOpen = ref(false)
  const isDeletingModule = ref(false)
  const deletingModuleId = ref<number | null>(null)

  function confirmDeleteModule(moduleId: number) {
    deletingModuleId.value = moduleId
    isDeleteModuleOpen.value = true
  }

  async function submitDeleteModule() {
    if (!deletingModuleId.value) return
    isDeletingModule.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/modules/${deletingModuleId.value}`, { method: 'DELETE' })
      toast.add({ title: 'Module deleted', color: 'success' })
      isDeleteModuleOpen.value = false
      await refreshCohort()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDeletingModule.value = false
    }
  }

  return reactive({
    // add
    isAddModuleOpen,
    isAddingModule,
    saveAndAddMore,
    addModuleForm,
    pendingAttachments,
    addPendingLink,
    addPendingFile,
    removePendingAttachment,
    resetAddModuleForm,
    submitAddModule,
    // edit
    isEditModuleOpen,
    isEditingModule,
    editModuleForm,
    openEditModule,
    submitEditModule,
    // attachments (edit modal)
    moduleAttachments,
    editPendingAttachments,
    addEditPendingLink,
    addEditPendingFile,
    removeEditPendingAttachment,
    isDeletingAttachment,
    submitDeleteAttachment,
    // delete
    isDeleteModuleOpen,
    isDeletingModule,
    confirmDeleteModule,
    submitDeleteModule
  })
}
