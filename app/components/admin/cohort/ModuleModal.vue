<script setup lang="ts">
import { Time } from '@internationalized/date'
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
type SessionDate = { year: number; month: number; day: number } | null
type SessionTime = { hour: number; minute: number; second: number; millisecond: number } | null

const form = defineModel<{
  title: string
  description: string
  sessionDate: SessionDate
  sessionStartTime: SessionTime
  sessionEndTime: SessionTime
  meetingLink: string
  attendanceLink: string
  assignmentTitle: string
  assignmentLink: string
  assignmentDeadlineDate: SessionDate
  assignmentDeadlineTime: SessionTime
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
const sessionDateInput = useTemplateRef('sessionDateInput')
const assignmentDeadlineDateInput = useTemplateRef('assignmentDeadlineDateInput')

const showAssignment = ref(
  !!(form.value.assignmentTitle || form.value.assignmentLink || form.value.assignmentDeadlineDate)
)
const showAttachment = ref(attachments.length > 0 || pendingAttachments.length > 0)

function toggleAssignment() {
  if (showAssignment.value) {
    form.value.assignmentTitle = ''
    form.value.assignmentLink = ''
    form.value.assignmentDeadlineDate = null
    form.value.assignmentDeadlineTime = null
  }
  showAssignment.value = !showAssignment.value
}

function toggleAttachment() {
  if (showAttachment.value) {
    for (const att of pendingAttachments) emit('removeAttachment', att.id)
  }
  showAttachment.value = !showAttachment.value
}

function toTime(t: SessionTime) {
  return t ? new Time(t.hour, t.minute, t.second, t.millisecond) : undefined
}

const sessionTimeRange = computed({
  get: () => ({
    start: toTime(form.value.sessionStartTime),
    end: toTime(form.value.sessionEndTime)
  }),
  set: (val: { start: SessionTime; end: SessionTime }) => {
    form.value.sessionStartTime = val?.start ?? null
    form.value.sessionEndTime = val?.end ?? null
  }
})

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
      <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
      <UForm
        ref="moduleForm"
        :schema="moduleFormSchema"
        :state="form as any"
        :validate-on="['submit']"
        class="space-y-4"
        @submit="emit('submit')"
      >
        <div class="flex gap-4">
          <label class="text-sm font-medium w-40 shrink-0 pt-2"
            >Title <span class="text-red-500">*</span></label
          >
          <UFormField name="title" class="flex-1">
            <UInput v-model="form.title" placeholder="Module Title" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-4">
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
        <div class="flex gap-4 items-start">
          <label class="text-sm font-medium w-40 shrink-0 pt-2"
            >Session Date <span class="text-red-500">*</span></label
          >
          <div class="flex-1 flex gap-2">
            <UFormField name="sessionDate" :ui="{ root: 'flex-1' }">
              <UInputDate
                ref="sessionDateInput"
                v-model="(form as any).sessionDate"
                locale="en-GB"
                class="w-full justify-center"
              >
                <template #leading>
                  <UPopover :reference="(sessionDateInput as any)?.inputsRef?.[3]?.$el">
                    <UButton
                      color="neutral"
                      variant="link"
                      size="md"
                      icon="i-ph-calendar-blank-bold"
                      aria-label="Select a date"
                      class="px-0 text-dimmed"
                    />
                    <template #content>
                      <UCalendar v-model="(form as any).sessionDate" class="p-2" />
                    </template>
                  </UPopover>
                </template>
              </UInputDate>
            </UFormField>
            <UFormField name="sessionStartTime">
              <UInputTime
                v-model="sessionTimeRange"
                :hour-cycle="24"
                range
                icon="i-ph-clock-bold"
                separator-icon="i-ph-arrow-right-bold"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <div class="flex gap-4">
          <label class="text-sm font-medium w-40 shrink-0 pt-2"
            >Meeting Link <span class="text-red-500">*</span></label
          >
          <UFormField name="meetingLink" class="flex-1">
            <UInput v-model="form.meetingLink" placeholder="Meeting Link" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-4">
          <label class="text-sm font-medium w-40 shrink-0 pt-2"
            >Attendance Link <span class="text-red-500">*</span></label
          >
          <UFormField name="attendanceLink" class="flex-1">
            <UInput v-model="form.attendanceLink" placeholder="Attendance Link" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-4">
          <label class="text-sm font-medium w-40 shrink-0 pt-2">Assignment</label>
          <div class="flex-1 space-y-2">
            <UButton
              :label="showAssignment ? 'Remove Assignment' : 'Add Assignment'"
              variant="ghost"
              color="neutral"
              size="sm"
              :icon="showAssignment ? 'i-ph-minus-bold' : 'i-ph-plus-bold'"
              class="pt-3"
              @click="toggleAssignment"
            />
            <div
              class="grid transition-[grid-template-rows] duration-300 ease-in-out"
              :class="showAssignment ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden space-y-2">
                <UFormField
                  label="Title"
                  name="assignmentTitle"
                  orientation="horizontal"
                  class="flex-1"
                  :ui="{ label: 'w-20 shrink-0', container: 'flex-1' }"
                >
                  <UInput
                    v-model="form.assignmentTitle"
                    placeholder="Assignment Title"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Link"
                  name="assignmentLink"
                  orientation="horizontal"
                  class="flex-1"
                  :ui="{ label: 'w-20 shrink-0', container: 'flex-1' }"
                >
                  <UInput
                    v-model="form.assignmentLink"
                    placeholder="Assignment Link"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Deadline"
                  name="assignmentDeadlineDate"
                  orientation="horizontal"
                  class="flex-1"
                  :ui="{ label: 'w-20 shrink-0', container: 'flex-1' }"
                >
                  <div class="flex gap-2">
                    <UInputDate
                      ref="assignmentDeadlineDateInput"
                      v-model="(form as any).assignmentDeadlineDate"
                      locale="en-GB"
                      class="w-full justify-center"
                    >
                      <template #leading>
                        <UPopover
                          :reference="(assignmentDeadlineDateInput as any)?.inputsRef?.[3]?.$el"
                        >
                          <UButton
                            color="neutral"
                            variant="link"
                            size="md"
                            icon="i-ph-calendar-blank-bold"
                            aria-label="Select a date"
                            class="px-0 text-dimmed"
                          />
                          <template #content>
                            <UCalendar v-model="(form as any).assignmentDeadlineDate" class="p-2" />
                          </template>
                        </UPopover>
                      </template>
                    </UInputDate>
                    <UInputTime
                      v-model="(form as any).assignmentDeadlineTime"
                      :hour-cycle="24"
                      icon="i-ph-clock-bold"
                      class="w-full"
                    />
                  </div>
                </UFormField>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <label class="text-sm font-medium w-40 shrink-0 pt-2">Attachment</label>
          <div class="flex-1 space-y-2">
            <UButton
              :label="showAttachment ? 'Remove Attachment' : 'Add Attachment'"
              variant="ghost"
              color="neutral"
              size="sm"
              :icon="showAttachment ? 'i-ph-minus-bold' : 'i-ph-plus-bold'"
              class="pt-3"
              @click="toggleAttachment"
            />
            <div
              class="grid transition-[grid-template-rows] duration-300 ease-in-out"
              :class="showAttachment ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
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
                            isAddingAttachment ? 'i-ph-spinner-bold' : 'i-ph-cloud-arrow-up-bold'
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
                        icon="i-ph-plus-bold"
                        :loading="mode === 'edit' ? isAddingAttachment : false"
                        :disabled="!linkUrl"
                        size="sm"
                        @click="addLink"
                      />
                    </div>
                  </template>
                </UTabs>
              </div>
            </div>

            <!-- Pending queue (add & edit) -->
            <div v-if="pendingAttachments.length" class="space-y-1.5">
              <AdminCohortAttachmentItem
                v-for="att in pendingAttachments"
                :key="att.id"
                :name="getPendingAttachmentName(att)"
                :background="resolveStyle(att).background"
                :foreground="resolveStyle(att).foreground"
                :border="resolveStyle(att).border"
                :icon="resolveStyle(att).icon"
                removable
                @remove="emit('removeAttachment', att.id)"
              />
            </div>

            <!-- Existing attachments from API (edit only) -->
            <div v-if="attachments.length" class="mt-2 flex flex-col gap-1.5">
              <div class="text-sm font-medium text-muted">Uploaded</div>
              <AdminCohortAttachmentItem
                v-for="a in attachments"
                :key="a.id"
                :href="a.file_url ?? undefined"
                :name="getRealAttachmentName(a)"
                :background="resolveStyle(a).background"
                :foreground="resolveStyle(a).foreground"
                :border="resolveStyle(a).border"
                :icon="resolveStyle(a).icon"
                removable
                :remove-loading="isDeletingAttachment"
                @remove="emit('deleteAttachment', a.id)"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <label class="text-sm font-medium w-40 shrink-0 pt-2">Status</label>
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
