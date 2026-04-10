<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { moduleFormSchema } from '@/schemas/cohort'
import type { PendingAttachment, AdminCohortAttachment } from '~/types/cohort'
import { ATTACHMENT_MAP, getAttachmentStyle } from '~/utils/attachment'

const {
  mode,
  loading,
  pendingAttachments = [],
  attachments = [],
  isAddingAttachment = false,
  isDeletingAttachment = false
} = defineProps<{
  mode: 'add' | 'edit'
  loading: boolean
  pendingAttachments?: PendingAttachment[]
  attachments?: AdminCohortAttachment[]
  isAddingAttachment?: boolean
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

function resolveStyle(att: PendingAttachment | AdminCohortAttachment) {
  if (att.type === 'external_link') return ATTACHMENT_MAP['external_link']!
  if (att.type === 'embed_video') return ATTACHMENT_MAP['embed_video']!
  if ('file' in att && att.file) return getAttachmentStyle({ file_path: att.file.name })
  return getAttachmentStyle(att as AdminCohortAttachment)
}

function getPendingAttachmentName(att: PendingAttachment) {
  return att.label || att.url || att.file?.name || 'Attachment'
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
          <UFormField name="description" class="flex-1">
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
                      :name="isAddingAttachment ? 'i-ph-spinner-bold' : 'i-ph-cloud-arrow-up-bold'"
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
                    icon="i-ph-plus-bold"
                    :loading="mode === 'edit' ? isAddingAttachment : false"
                    :disabled="!linkUrl"
                    size="sm"
                    @click="addLink"
                  />
                </div>
              </template>
            </UTabs>

            <!-- Pending queue (add & edit) -->
            <div v-if="pendingAttachments.length" class="space-y-1.5">
              <AdminCohortAttachmentItem
                v-for="att in pendingAttachments"
                :key="att.id"
                :name="getPendingAttachmentName(att)"
                :color="resolveStyle(att).color"
                :icon="resolveStyle(att).icon"
                removable
                flexible
                @remove="emit('removeAttachment', att.id)"
              />
            </div>

            <!-- Existing attachments from API (edit only) -->
            <div v-if="attachments.length" class="space-y-1.5">
              <AdminCohortAttachmentItem
                v-for="a in attachments"
                :key="a.id"
                :href="a.file_url ?? undefined"
                :name="getRealAttachmentName(a)"
                :color="resolveStyle(a).color"
                :icon="resolveStyle(a).icon"
                removable
                flexible
                :remove-loading="isDeletingAttachment"
                @remove="emit('deleteAttachment', a.id)"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-3 items-center">
          <label class="text-sm font-medium w-40 shrink-0">Status</label>
          <URadioGroup
            v-model="publishStatus"
            :items="[
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' }
            ]"
            variant="table"
            indicator="hidden"
            orientation="horizontal"
            size="sm"
            color="primary"
            class="flex-1"
            :ui="{ item: 'flex-1' }"
          />
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
