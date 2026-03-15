<script setup lang="ts">
import type { TabsItem, DropdownMenuItem } from '@nuxt/ui'
import type { CohortModule, CohortStudent, CohortMentor } from '~/components/admin/cohort/TabModules.vue'

// ─── Page meta ───────────────────────────────────────────────────────────────
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Cohort Details',
  navbarIcon: 'i-lucide-layout-list',
  middleware: 'admin',
})

// ─── Static data ─────────────────────────────────────────────────────────────
const cohortTitle = 'Carbon Accounting – Batch 2'
const cohortStatus = 'on_going'

const modules: CohortModule[] = [
  {
    id: 1,
    order: 1,
    title: 'Introduction to Carbon Accounting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: '8 Januari 2026 at 10.00 WIB',
    meetingLink: 'https://us01web.zoom.us/j/xxxxxxxx?pwd=xxxxxxxxxxxxxxxxxxxxxxxx',
    attendanceLink: 'https://docs.google.com/forms/d/e/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/viewform?usp=dialog',
    assignmentLink: 'https://docs.google.com/forms/d/e/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy/viewform?usp=dialog',
    attachments: [
      { id: 1, label: 'materials_1.pdf', type: 'pdf' },
      { id: 2, label: 'materials_2.docx', type: 'docx' },
      { id: 3, label: 'materials_4.pptx', type: 'pptx' },
      { id: 4, label: 'Materials – Google Dr...', type: 'url' },
    ],
  },
  { id: 2, order: 2, title: 'Standards, Principles & Regulations', attachments: [] },
  { id: 3, order: 3, title: 'Scope 1, 2 & 3', attachments: [] },
  { id: 4, order: 4, title: 'Value Chain', attachments: [] },
  { id: 5, order: 5, title: 'Tools & Digital Carbon Accounting', attachments: [] },
  { id: 6, order: 6, title: 'Reporting, Verification, Mitigation Strategies & Decarbonization Roadmap', attachments: [] },
  { id: 7, order: 7, title: 'Carbon Market & Carbon Trading', attachments: [] },
  { id: 8, order: 8, title: 'Case Study', attachments: [] },
]

const students: CohortStudent[] = [
  { id: 1, initials: 'BC', name: 'John Doe', email: 'user1@gmail.com', phone: '08123456789' },
  { id: 2, initials: 'BC', name: 'John Doe', email: 'user2@gmail.com', phone: '08123456789' },
  { id: 3, initials: 'BC', name: 'John Doe', email: 'user3@gmail.com', phone: '08123456789' },
]

const mentors: CohortMentor[] = [
  { id: 1, initials: 'BC', name: 'John Doe', email: 'user1@gmail.com', phone: '08123456789' },
  { id: 2, initials: 'BC', name: 'John Doe', email: 'user2@gmail.com', phone: '08123456789' },
  { id: 3, initials: 'BC', name: 'John Doe', email: 'user3@gmail.com', phone: '08123456789' },
]

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabItems: TabsItem[] = [
  { label: 'Modules', slot: 'modules' },
  { label: 'Statistics', slot: 'statistics' },
  { label: 'Students', slot: 'students' },
  { label: 'Mentors', slot: 'mentors' },
]

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  on_going: 'On Going',
  not_started: 'Not Started',
  cancelled: 'Cancelled',
}
const STATUS_COLOR: Record<string, 'success' | 'warning' | 'neutral' | 'error'> = {
  completed: 'success',
  on_going: 'warning',
  not_started: 'neutral',
  cancelled: 'error',
}

// ─── Header 3-dot menu ────────────────────────────────────────────────────────
const headerMenuItems: DropdownMenuItem[][] = [
  [
    { label: 'Edit Info', icon: 'i-lucide-pencil', onSelect: () => { isEditCohortOpen.value = true } },
    { label: 'Delete Cohort', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { isDeleteCohortOpen.value = true } },
  ],
]

// ─── Add Module modal ─────────────────────────────────────────────────────────
const isAddModuleOpen = ref(false)
const saveAndAddMore = ref(false)
const addModuleForm = reactive({
  title: '',
  description: '',
  sessionDate: '',
  meetingLink: '',
  attendanceLink: '',
  assignmentLink: '',
  isPublished: true,
  attachmentTab: 'files' as 'files' | 'links',
})

function resetAddModuleForm() {
  addModuleForm.title = ''
  addModuleForm.description = ''
  addModuleForm.sessionDate = ''
  addModuleForm.meetingLink = ''
  addModuleForm.attendanceLink = ''
  addModuleForm.assignmentLink = ''
  addModuleForm.isPublished = true
}

// ─── Edit Module modal ────────────────────────────────────────────────────────
const isEditModuleOpen = ref(false)
const editingModule = ref<CohortModule | null>(null)
const editModuleForm = reactive({
  title: '',
  description: '',
  sessionDate: '',
  meetingLink: '',
  attendanceLink: '',
  assignmentLink: '',
  isPublished: true,
})

function openEditModule(module: CohortModule) {
  editingModule.value = module
  editModuleForm.title = module.title
  editModuleForm.description = module.description ?? ''
  editModuleForm.sessionDate = module.date ?? ''
  editModuleForm.meetingLink = module.meetingLink ?? ''
  editModuleForm.attendanceLink = module.attendanceLink ?? ''
  editModuleForm.assignmentLink = module.assignmentLink ?? ''
  editModuleForm.isPublished = true
  isEditModuleOpen.value = true
}

// ─── Delete Module modal ──────────────────────────────────────────────────────
const isDeleteModuleOpen = ref(false)
const deletingModuleId = ref<number | null>(null)

function confirmDeleteModule(moduleId: number) {
  deletingModuleId.value = moduleId
  isDeleteModuleOpen.value = true
}

// ─── Edit Cohort modal ────────────────────────────────────────────────────────
const isEditCohortOpen = ref(false)

// ─── Delete Cohort modal ──────────────────────────────────────────────────────
const isDeleteCohortOpen = ref(false)

// ─── Invite Student modal ─────────────────────────────────────────────────────
const isInviteStudentOpen = ref(false)

// ─── Invite Mentor modal ──────────────────────────────────────────────────────
const isInviteMentorOpen = ref(false)
const mentorForm = reactive({ name: '', jobTitle: '' })

// ─── Status select items ──────────────────────────────────────────────────────
const statusItems = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'On Going', value: 'on_going' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]
</script>

<template>
  <div class="space-y-4">
    <!-- ─── Header card ────────────────────────────────────────────────── -->
    <UCard>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="sm"
            to="/admin/cohorts"
          />
          <div class="min-w-0">
            <h1 class="text-base font-semibold text-highlighted truncate">
              {{ cohortTitle }}
            </h1>
            <div class="flex items-center gap-2 mt-0.5">
              <UBadge
                :color="STATUS_COLOR[cohortStatus] ?? 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ STATUS_LABEL[cohortStatus] ?? cohortStatus }}
              </UBadge>
            </div>
          </div>
        </div>

        <UDropdownMenu :items="headerMenuItems">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </UDropdownMenu>
      </div>
    </UCard>

    <!-- ─── Tabs card ──────────────────────────────────────────────────── -->
    <UCard>
      <UTabs
        :items="tabItems"
        variant="link"
        color="primary"
        :unmount-on-hide="false"
      >
        <!-- Modules tab – delegasi ke AdminCohortTabModules -->
        <template #modules>
          <AdminCohortTabModules
            :modules="modules"
            @add-module="isAddModuleOpen = true"
            @edit-module="openEditModule"
            @delete-module="confirmDeleteModule"
          />
        </template>

        <!-- Statistics tab -->
        <template #statistics>
          <div class="py-16 text-center text-muted text-sm min-h-[400px]">
            On Planning...
          </div>
        </template>

        <!-- Students tab – delegasi ke AdminCohortTabStudents -->
        <template #students>
          <AdminCohortTabStudents
            :students="students"
            @invite="isInviteStudentOpen = true"
            @remove="() => {}"
          />
        </template>

        <!-- Mentors tab – delegasi ke AdminCohortTabMentors -->
        <template #mentors>
          <AdminCohortTabMentors
            :mentors="mentors"
            @invite="isInviteMentorOpen = true"
            @remove="() => {}"
          />
        </template>
      </UTabs>
    </UCard>
  </div>

  <!-- ─── Modal: Add New Module ──────────────────────────────────────────── -->
  <UModal v-model:open="isAddModuleOpen" title="Add New Module">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title" required>
          <UInput v-model="addModuleForm.title" placeholder="Module Title" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="addModuleForm.description" placeholder="Module Description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="Session Date">
          <UInput v-model="addModuleForm.sessionDate" type="datetime-local" class="w-full" />
        </UFormField>
        <UFormField label="Meeting Link">
          <UInput v-model="addModuleForm.meetingLink" placeholder="Meeting Link" class="w-full" />
        </UFormField>
        <UFormField label="Attendance Link">
          <UInput v-model="addModuleForm.attendanceLink" placeholder="Attendance Link" class="w-full" />
        </UFormField>
        <UFormField label="Assignment Link">
          <UInput v-model="addModuleForm.assignmentLink" placeholder="Assignment Link" class="w-full" />
        </UFormField>

        <!-- Attachment upload area -->
        <UFormField label="Attachment">
          <div class="border border-default rounded-lg overflow-hidden">
            <div class="flex border-b border-default">
              <button
                class="flex-1 py-2 text-sm font-medium transition-colors"
                :class="addModuleForm.attachmentTab === 'files' ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted'"
                @click="addModuleForm.attachmentTab = 'files'"
              >
                Files
              </button>
              <button
                class="flex-1 py-2 text-sm font-medium transition-colors"
                :class="addModuleForm.attachmentTab === 'links' ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted'"
                @click="addModuleForm.attachmentTab = 'links'"
              >
                Links
              </button>
            </div>
            <div class="p-4">
              <div class="border-2 border-dashed border-default rounded-lg py-6 flex flex-col items-center gap-2 text-muted">
                <UIcon name="i-lucide-upload" class="size-6" />
                <p class="text-sm">Drop your files here</p>
              </div>
            </div>
          </div>
        </UFormField>

        <!-- Status toggle -->
        <UFormField label="Status">
          <div class="flex rounded-lg overflow-hidden border border-default w-full text-sm">
            <button
              class="flex-1 py-2 font-medium transition-colors"
              :class="!addModuleForm.isPublished ? 'bg-elevated text-default' : 'text-muted'"
              @click="addModuleForm.isPublished = false"
            >
              Draft
            </button>
            <button
              class="flex-1 py-2 font-medium transition-colors"
              :class="addModuleForm.isPublished ? 'bg-primary text-white' : 'text-muted'"
              @click="addModuleForm.isPublished = true"
            >
              Published
            </button>
          </div>
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <label class="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
          <input v-model="saveAndAddMore" type="checkbox" class="rounded border-default" />
          Save and add more
        </label>
        <div class="flex gap-2">
          <UButton label="Cancel" color="neutral" variant="outline" @click="isAddModuleOpen = false; resetAddModuleForm()" />
          <UButton label="Add Module" color="primary" @click="isAddModuleOpen = false" />
        </div>
      </div>
    </template>
  </UModal>

  <!-- ─── Modal: Edit Module ─────────────────────────────────────────────── -->
  <UModal v-model:open="isEditModuleOpen" title="Edit Module">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title" required>
          <UInput v-model="editModuleForm.title" placeholder="Module Title" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="editModuleForm.description" placeholder="Module Description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="Session Date">
          <UInput v-model="editModuleForm.sessionDate" type="datetime-local" class="w-full" />
        </UFormField>
        <UFormField label="Meeting Link">
          <UInput v-model="editModuleForm.meetingLink" placeholder="Meeting Link" class="w-full" />
        </UFormField>
        <UFormField label="Attendance Link">
          <UInput v-model="editModuleForm.attendanceLink" placeholder="Attendance Link" class="w-full" />
        </UFormField>
        <UFormField label="Assignment Link">
          <UInput v-model="editModuleForm.assignmentLink" placeholder="Assignment Link" class="w-full" />
        </UFormField>
        <UFormField label="Status">
          <div class="flex rounded-lg overflow-hidden border border-default w-full text-sm">
            <button
              class="flex-1 py-2 font-medium transition-colors"
              :class="!editModuleForm.isPublished ? 'bg-elevated text-default' : 'text-muted'"
              @click="editModuleForm.isPublished = false"
            >
              Draft
            </button>
            <button
              class="flex-1 py-2 font-medium transition-colors"
              :class="editModuleForm.isPublished ? 'bg-primary text-white' : 'text-muted'"
              @click="editModuleForm.isPublished = true"
            >
              Published
            </button>
          </div>
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="outline" @click="isEditModuleOpen = false" />
        <UButton label="Save Changes" color="primary" @click="isEditModuleOpen = false" />
      </div>
    </template>
  </UModal>

  <!-- ─── Modal: Confirm Delete Module ──────────────────────────────────── -->
  <UModal v-model:open="isDeleteModuleOpen" title="Delete Module">
    <template #body>
      <p class="text-sm text-muted">
        Apakah kamu yakin ingin menghapus module ini? Tindakan ini tidak dapat dibatalkan.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="outline" @click="isDeleteModuleOpen = false" />
        <UButton label="Delete" color="error" @click="isDeleteModuleOpen = false" />
      </div>
    </template>
  </UModal>

  <!-- ─── Modal: Edit Cohort Info ───────────────────────────────────────── -->
  <UModal v-model:open="isEditCohortOpen" title="Edit Cohort Info">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Name">
          <UInput :model-value="cohortTitle" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField label="Status">
          <USelect :model-value="cohortStatus" :items="statusItems" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Start Date">
            <UInput type="date" class="w-full" />
          </UFormField>
          <UFormField label="End Date">
            <UInput type="date" class="w-full" />
          </UFormField>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="outline" @click="isEditCohortOpen = false" />
        <UButton label="Save Changes" color="primary" @click="isEditCohortOpen = false" />
      </div>
    </template>
  </UModal>

  <!-- ─── Modal: Confirm Delete Cohort ──────────────────────────────────── -->
  <UModal v-model:open="isDeleteCohortOpen" title="Delete Cohort">
    <template #body>
      <p class="text-sm text-muted">
        Apakah kamu yakin ingin menghapus cohort <strong>{{ cohortTitle }}</strong>?
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="outline" @click="isDeleteCohortOpen = false" />
        <UButton label="Delete Cohort" color="error" @click="isDeleteCohortOpen = false" />
      </div>
    </template>
  </UModal>

  <!-- ─── Modal: Invite Student ─────────────────────────────────────────── -->
  <UModal v-model:open="isInviteStudentOpen" title="Invite Student">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Email">
          <UInput placeholder="Enter student email" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="outline" @click="isInviteStudentOpen = false" />
        <UButton label="Invite" color="primary" @click="isInviteStudentOpen = false" />
      </div>
    </template>
  </UModal>

  <!-- ─── Modal: Invite Mentor ──────────────────────────────────────────── -->
  <UModal v-model:open="isInviteMentorOpen" title="Invite Mentor">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Name">
          <UInput v-model="mentorForm.name" placeholder="Mentor Name" class="w-full" />
        </UFormField>
        <UFormField label="Job Title">
          <UInput v-model="mentorForm.jobTitle" placeholder="e.g. Senior Consultant" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="outline" @click="isInviteMentorOpen = false" />
        <UButton label="Add Mentor" color="primary" @click="isInviteMentorOpen = false" />
      </div>
    </template>
  </UModal>
</template>
