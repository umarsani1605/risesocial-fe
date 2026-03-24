<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { moduleFormSchema } from '@/schemas/cohort'
import type { PendingAttachment, AdminCohortAttachment } from '~/types/cohort'

const {
  mode,
  loading,
  pendingAttachments = [],
  attachments = [],
  isDeletingAttachment = false
} = defineProps<{
  mode: 'add' | 'edit'
  loading: boolean
  pendingAttachments?: PendingAttachment[]
  attachments?: AdminCohortAttachment[]
  isDeletingAttachment?: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  title: string
  description: string
  sessionDate: string
  meetingLink: string
  attendanceLink: string
  assignmentLink: string
  isPublished: boolean
}>('form', { required: true })
const saveAndAddMore = defineModel<boolean>('saveAndAddMore')

const emit = defineEmits<{
  submit: []
  cancel: []
  addLink: [url: string, label: string]
  addFile: [file: File, label: string]
  removeAttachment: [id: string]
  deleteAttachment: [id: number]
}>()

const formRef = useTemplateRef('moduleForm')

const publishStatus = computed({
  get: () => (form.value.isPublished ? 'published' : 'draft'),
  set: (value) => {
    form.value.isPublished = value === 'published'
  }
})

function close() {
  emit('cancel')
  open.value = false
}

// ── Attachment ─────────────────────────────────────────────────────────────────

const attachmentTabItems: TabsItem[] = [
  { label: 'File', slot: 'file' },
  { label: 'Link', slot: 'link' }
]

const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const fileInputRef = useTemplateRef('fileInput')

function addFile(file: File) {
  emit('addFile', file, '')
  selectedFile.value = null
  if (fileInputRef.value) (fileInputRef.value as HTMLInputElement).value = ''
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) addFile(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) addFile(file)
}

const linkUrl = ref('')

function addLink() {
  if (!linkUrl.value) return
  emit('addLink', linkUrl.value, '')
  linkUrl.value = ''
}

// Badge helpers
function getPendingBadgeInfo(att: PendingAttachment) {
  if (att.type === 'file' && att.file) {
    const ext = att.file.name.split('.').pop()?.toLowerCase() ?? ''
    const map: Record<string, { text: string; color: string }> = {
      pdf: { text: 'PDF', color: 'bg-red-500' },
      doc: { text: 'DOCX', color: 'bg-blue-500' },
      docx: { text: 'DOCX', color: 'bg-blue-500' },
      ppt: { text: 'PPTX', color: 'bg-orange-500' },
      pptx: { text: 'PPTX', color: 'bg-orange-500' },
      xls: { text: 'XLSX', color: 'bg-green-600' },
      xlsx: { text: 'XLSX', color: 'bg-green-600' }
    }
    return map[ext] ?? { text: ext.toUpperCase().slice(0, 4) || 'FILE', color: 'bg-gray-500' }
  }
  return { text: 'LINK', color: 'bg-blue-500' }
}

function getPendingAttachmentName(att: PendingAttachment) {
  return att.label || att.url || att.file?.name || 'Attachment'
}

function getRealBadgeInfo(a: AdminCohortAttachment) {
  if (a.type === 'embed_video') return { text: 'VIDEO', color: 'bg-red-500' }
  if (a.type === 'external_link') return { text: 'LINK', color: 'bg-blue-500' }
  const ext = (a.file_mime?.split('/').pop() ?? a.file_path?.split('.').pop() ?? '').toLowerCase()
  const map: Record<string, { text: string; color: string }> = {
    pdf: { text: 'PDF', color: 'bg-red-500' },
    msword: { text: 'DOCX', color: 'bg-blue-500' },
    doc: { text: 'DOCX', color: 'bg-blue-500' },
    docx: { text: 'DOCX', color: 'bg-blue-500' },
    'vnd.openxmlformats-officedocument.wordprocessingml.document': {
      text: 'DOCX',
      color: 'bg-blue-500'
    },
    ppt: { text: 'PPTX', color: 'bg-orange-500' },
    pptx: { text: 'PPTX', color: 'bg-orange-500' },
    'vnd.openxmlformats-officedocument.presentationml.presentation': {
      text: 'PPTX',
      color: 'bg-orange-500'
    },
    xls: { text: 'XLSX', color: 'bg-green-600' },
    xlsx: { text: 'XLSX', color: 'bg-green-600' },
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': { text: 'XLSX', color: 'bg-green-600' }
  }
  return map[ext] ?? { text: 'FILE', color: 'bg-gray-500' }
}

function getRealAttachmentName(a: AdminCohortAttachment) {
  return a.label || a.url || a.file_path?.split('/').pop() || `Attachment #${a.id}`
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="mode === 'add' ? 'Add New Module' : 'Edit Module'"
    :ui="{ content: 'max-w-2xl' }"
  >
    <template #body>
      <UForm
        ref="moduleForm"
        :schema="moduleFormSchema"
        :state="form"
        class="space-y-3"
        @submit="emit('submit')"
      >
        <!-- Form fields: inline label + input -->
        <div class="flex gap-3">
          <label class="text-sm font-medium w-40 shrink-0 pt-2"
            >Title <span class="text-red-500">*</span></label
          >
          <UFormField name="title" class="flex-1">
            <UInput v-model="form.title" placeholder="Module Title" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-3">
          <label class="text-sm font-medium w-40 shrink-0 pt-2">Description</label>
          <UFormField class="flex-1">
            <UTextarea
              v-model="form.description"
              placeholder="Module Description"
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </div>
        <div class="flex gap-3 items-center">
          <label class="text-sm font-medium w-40 shrink-0">Session Date</label>
          <UInput v-model="form.sessionDate" type="datetime-local" class="flex-1" />
        </div>
        <div class="flex gap-3 items-center">
          <label class="text-sm font-medium w-40 shrink-0">Meeting Link</label>
          <UFormField name="meetingLink" class="flex-1">
            <UInput v-model="form.meetingLink" placeholder="Meeting Link" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-3 items-center">
          <label class="text-sm font-medium w-40 shrink-0">Attendance Link</label>
          <UFormField name="attendanceLink" class="flex-1">
            <UInput v-model="form.attendanceLink" placeholder="Attendance Link" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-3 items-center">
          <label class="text-sm font-medium w-40 shrink-0">Assignment Link</label>
          <UFormField name="assignmentLink" class="flex-1">
            <UInput v-model="form.assignmentLink" placeholder="Assignment Link" class="w-full" />
          </UFormField>
        </div>

        <!-- Attachment: inline label + tabs -->
        <div class="flex gap-3">
          <label class="text-sm font-medium w-40 shrink-0 pt-2">Attachment</label>
          <div class="flex-1 space-y-2">
            <UTabs :items="attachmentTabItems" variant="link">
              <template #file>
                <div class="pt-2">
                  <div
                    class="border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-1 text-center cursor-pointer transition-colors select-none"
                    :class="[
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50',
                      isAddingAttachment ? 'opacity-50 pointer-events-none' : ''
                    ]"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="onDrop"
                    @click="(fileInputRef as HTMLInputElement)?.click()"
                  >
                    <UIcon
                      :name="
                        isAddingAttachment ? 'i-lucide-loader-circle' : 'i-lucide-upload-cloud'
                      "
                      class="size-6 text-muted"
                      :class="isAddingAttachment ? 'animate-spin' : ''"
                    />
                    <p class="text-xs">
                      {{ isAddingAttachment ? 'Uploading...' : 'Drop your files here' }}
                    </p>
                    <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
                  </div>
                </div>
              </template>
              <template #link>
                <div class="pt-2 flex gap-2">
                  <UInput v-model="linkUrl" placeholder="https://..." class="flex-1" />
                  <UButton
                    label="Add Link"
                    icon="i-lucide-plus"
                    size="xs"
                    :loading="mode === 'edit' ? isAddingAttachment : false"
                    :disabled="!linkUrl"
                    @click="addLink"
                  />
                </div>
              </template>
            </UTabs>

            <!-- Pending queue (add & edit) -->
            <div v-if="pendingAttachments.length" class="space-y-1.5">
              <div
                v-for="att in pendingAttachments"
                :key="att.id"
                class="flex items-center rounded-lg overflow-hidden border border-default"
              >
                <div
                  class="flex items-center justify-center w-10 h-9 text-white text-[10px] font-bold shrink-0"
                  :class="getPendingBadgeInfo(att).color"
                >
                  {{ getPendingBadgeInfo(att).text }}
                </div>
                <span class="flex-1 text-sm truncate px-2">{{
                  getPendingAttachmentName(att)
                }}</span>
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="mr-0.5 shrink-0"
                  @click="emit('removeAttachment', att.id)"
                />
              </div>
            </div>

            <!-- Existing attachments from API (edit only) -->
            <div v-if="attachments.length" class="space-y-1.5">
              <div
                v-for="a in attachments"
                :key="a.id"
                class="flex items-center rounded-lg overflow-hidden border border-default"
              >
                <div
                  class="flex items-center justify-center w-10 h-9 text-white text-[10px] font-bold shrink-0"
                  :class="getRealBadgeInfo(a).color"
                >
                  {{ getRealBadgeInfo(a).text }}
                </div>
                <span class="flex-1 text-sm truncate px-2">{{ getRealAttachmentName(a) }}</span>
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="mr-0.5 shrink-0"
                  :loading="isDeletingAttachment"
                  @click="emit('deleteAttachment', a.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Status: inline label + segmented -->
        <div class="flex gap-3 items-center">
          <label class="text-sm font-medium w-40 shrink-0">Status</label>
          <div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl flex-1">
            <button
              type="button"
              class="flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors"
              :class="
                publishStatus === 'draft'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-default'
                  : 'text-muted'
              "
              @click="publishStatus = 'draft'"
            >
              Draft
            </button>
            <button
              type="button"
              class="flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors"
              :class="
                publishStatus === 'published' ? 'bg-primary text-white shadow-sm' : 'text-muted'
              "
              @click="publishStatus = 'published'"
            >
              Published
            </button>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UCheckbox v-if="mode === 'add'" v-model="saveAndAddMore" label="Save and add more" />
        <div v-else />
        <div class="flex gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            :disabled="loading"
            @click="close"
          />
          <UButton
            :label="mode === 'add' ? 'Add Module' : 'Save Changes'"
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="formRef?.submit()"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
