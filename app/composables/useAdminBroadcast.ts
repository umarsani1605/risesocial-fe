import { broadcastFormSchema, type BroadcastFormState } from '@/schemas/broadcast'
import { BROADCAST_DAILY_LIMIT, BROADCAST_SEGMENT_OPTIONS } from '@/constants/broadcast'

function buildCriteria(form: BroadcastFormState): BroadcastSegmentCriteria | undefined {
  if (form.segment === 'custom_list') return { emails: form.custom_emails }
  return undefined
}

/** Compose tab: senders, form, debounced recipient preview, and send. */
export function useAdminBroadcastCompose() {
  const { api } = useApi()
  const toast = useToast()

  const senders = ref<BrevoSender[]>([])
  const loadingSenders = ref(false)
  const sending = ref(false)
  const segmentCounts = ref<Record<string, number>>({})

  const form = reactive<BroadcastFormState>({
    sender_email: '',
    subject: '',
    body_text: '',
    segment: undefined as unknown as BroadcastFormState['segment'],
    custom_emails: ''
  })

  const preview = reactive({ count: 0, blocked: false, limit: BROADCAST_DAILY_LIMIT, loading: false, error: '' })

  const senderOptions = computed(() =>
    senders.value
      .filter((s) => s.active)
      .map((s) => ({ label: `${s.name} <${s.email}>`, value: s.email }))
  )

  const needsCriteria = computed(() => form.segment === 'custom_list')

  // Recipient options with the resolved count appended (e.g. "All Users (21 recipients)").
  const segmentOptions = computed(() =>
    BROADCAST_SEGMENT_OPTIONS.map((o) => {
      const count = segmentCounts.value[o.value]
      if (count === undefined) return o
      return { label: `${o.label} (${count})`, value: o.value }
    })
  )

  async function loadSegmentCounts() {
    try {
      const res = await api<ApiResponse<Record<string, number>>>('/admin/broadcasts/segment-counts')
      segmentCounts.value = res.data ?? {}
    } catch {
      // Non-critical: options simply render without counts.
    }
  }

  const canSend = computed(() => !sending.value && preview.count > 0 && !preview.blocked)

  async function loadSenders() {
    loadingSenders.value = true
    try {
      const res = await api<ApiResponse<BrevoSender[]>>('/admin/broadcasts/senders')
      senders.value = res.data ?? []
      const firstActive = senderOptions.value[0]
      if (firstActive && !form.sender_email) form.sender_email = firstActive.value
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      loadingSenders.value = false
    }
  }

  // Monotonic token to discard out-of-order responses (e.g. switching segments
  // faster than a slower request resolves).
  let previewToken = 0

  async function refreshPreview() {
    const token = ++previewToken
    preview.error = ''
    preview.blocked = false

    if (!form.segment) {
      preview.count = 0
      preview.loading = false
      return
    }
    // Hold off until the custom list has at least one address.
    if (form.segment === 'custom_list' && !form.custom_emails?.trim()) {
      preview.count = 0
      preview.loading = false
      return
    }

    preview.loading = true
    try {
      const res = await api<ApiResponse<BroadcastRecipientPreview>>('/admin/broadcasts/preview-recipients', {
        method: 'POST',
        body: { segment: form.segment, segment_criteria: buildCriteria(form) }
      })
      if (token !== previewToken) return
      preview.count = res.data.count
      preview.blocked = res.data.blocked
      preview.limit = res.data.limit
    } catch (error: unknown) {
      if (token !== previewToken) return
      preview.count = 0
      preview.blocked = false
      preview.error = getApiErrorMessage(error)
    } finally {
      if (token === previewToken) preview.loading = false
    }
  }

  // Switching the recipient target clears the stale count and shows the spinner
  // immediately, before the debounced fetch, so the previous count never lingers.
  watch(
    () => form.segment,
    () => {
      previewToken++
      preview.count = 0
      preview.blocked = false
      preview.error = ''
      preview.loading = !!form.segment && form.segment !== 'custom_list'
    }
  )

  watchDebounced(
    () => [form.segment, form.custom_emails],
    () => { refreshPreview() },
    { debounce: 400 }
  )

  async function send() {
    sending.value = true
    try {
      const sender = senders.value.find((s) => s.email === form.sender_email)
      await api<ApiResponse<EmailBroadcast>>('/admin/broadcasts', {
        method: 'POST',
        body: {
          subject: form.subject,
          body_text: form.body_text,
          sender_email: form.sender_email,
          sender_name: sender?.name ?? form.sender_email,
          segment: form.segment,
          segment_criteria: buildCriteria(form)
        }
      })
      toast.add({ title: 'Broadcast is being sent', color: 'success' })
      return true
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
      return false
    } finally {
      sending.value = false
    }
  }

  function reset() {
    form.subject = ''
    form.body_text = ''
    form.segment = undefined as unknown as BroadcastFormState['segment']
    form.custom_emails = ''
    previewToken++
    preview.count = 0
    preview.blocked = false
    preview.error = ''
    preview.loading = false
  }

  return reactive({
    senders,
    senderOptions,
    segmentOptions,
    loadingSenders,
    sending,
    form,
    preview,
    needsCriteria,
    canSend,
    schema: broadcastFormSchema,
    loadSenders,
    loadSegmentCounts,
    refreshPreview,
    send,
    reset
  })
}

/** History tab: list of broadcasts, manual stats refresh, and detail slideover. */
export function useAdminBroadcastHistory() {
  const { api } = useApi()
  const toast = useToast()

  const broadcasts = ref<EmailBroadcast[]>([])
  const loading = ref(false)
  const refreshingId = ref<number | null>(null)
  const statusFilter = ref('all')

  const isDetailOpen = ref(false)
  const selected = ref<EmailBroadcast | null>(null)

  const filtered = computed(() => {
    if (statusFilter.value === 'all') return broadcasts.value
    return broadcasts.value.filter((b) => b.status === statusFilter.value)
  })

  async function load() {
    loading.value = true
    try {
      const res = await api<ApiResponse<EmailBroadcast[]>>('/admin/broadcasts')
      broadcasts.value = res.data ?? []
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      loading.value = false
    }
  }

  async function checkStatus(id: number) {
    refreshingId.value = id
    try {
      // Always re-read the current delivery status from our DB (e.g. SENDING -> SENT).
      let updated = (await api<ApiResponse<EmailBroadcast>>(`/admin/broadcasts/${id}`)).data
      // For a sent broadcast, also pull the latest engagement stats from Brevo.
      if (updated.status === 'SENT') {
        updated = (
          await api<ApiResponse<EmailBroadcast>>(`/admin/broadcasts/${id}/refresh-stats`, {
            method: 'POST'
          })
        ).data
      }
      // Replace the whole array (new reference) so the table re-renders, not just mutate by index.
      broadcasts.value = broadcasts.value.map((b) => (b.id === id ? updated : b))
      if (selected.value?.id === id) selected.value = updated
      toast.add({ title: 'Status updated', color: 'success' })
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      refreshingId.value = null
    }
  }

  function openDetail(broadcast: EmailBroadcast) {
    selected.value = broadcast
    isDetailOpen.value = true
  }

  return reactive({
    broadcasts,
    filtered,
    loading,
    refreshingId,
    statusFilter,
    isDetailOpen,
    selected,
    load,
    checkStatus,
    openDetail
  })
}
