<script setup lang="ts">
import type { TabsItem, DropdownMenuItem } from '@nuxt/ui'
import { useAdminCohort } from '@/composables/useAdminCohort'
import { useAdminCohortModules } from '@/composables/useAdminCohortModules'
import { useAdminCohortEnrollments } from '@/composables/useAdminCohortEnrollments'
import { cohortEditSchema } from '@/schemas/cohort'
import { COHORT_PHASE_COLOR, COHORT_PHASE_LABEL } from '@/constants/cohort'
import { getCohortPhase } from '@/utils/cohort'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Cohort Details',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Cohort Detail - Rise Social' })

const route = useRoute()
const cohortId = route.params.id as string

const { api } = useApi()
const toast = useToast()
const { data: cohortRaw, error: cohortError } = await useAsyncData(`admin-cohort-${cohortId}`, () =>
  api<ApiResponse<AdminCohortDetail>>(`/admin/cohorts/${cohortId}`)
)
if (cohortError.value || !cohortRaw.value?.data) {
  throw createError({ statusCode: 404, message: 'Cohort not found' })
}

const cohort = useAdminCohort(cohortId)

const cohortModules = useAdminCohortModules({
  cohortId,
  refreshCohort: cohort.refreshCohort
})

const cohortEnrollments = useAdminCohortEnrollments({ cohortId })

const formRef = useTemplateRef('formRef')

const currentStatus = ref<string>(cohortRaw.value!.data!.status)
const isCompleting = ref(false)
const isCompleteModalOpen = ref(false)

const currentPhase = computed(() =>
  getCohortPhase({
    status: currentStatus.value,
    start_date: cohort.detail?.start_date ?? null,
  })
)
const isCompleted = computed(() => currentStatus.value === 'completed')
const placementCount = computed(() => cohort.detail?.enrollment_count ?? 0)

const tabItems: TabsItem[] = [
  { label: 'Information', slot: 'information', icon: 'i-ph-info-duotone' },
  { label: 'Modules', slot: 'modules', icon: 'i-ph-stack-duotone' },
  { label: 'Statistics', slot: 'statistics', icon: 'i-ph-chart-line-duotone' },
  { label: 'Students', slot: 'students', icon: 'i-ph-users-duotone' },
  { label: 'Mentors', slot: 'mentors', icon: 'i-ph-user-duotone' }
]

watchEffect(() => {
  if (!cohort.detail) return
  if (cohort.editCohortForm.name) return
  cohort.editCohortForm.name = cohort.detail.name
  cohort.editCohortForm.description = cohort.detail.description ?? ''
  cohort.editCohortForm.start_date = cohort.detail.start_date?.split('T')[0] ?? ''
  cohort.editCohortForm.end_date = cohort.detail.end_date?.split('T')[0] ?? ''
  currentStatus.value = cohort.detail.status
})

async function onCompleteConfirm() {
  isCompleting.value = true
  try {
    await api(`/admin/cohorts/${cohortId}/complete`, { method: 'POST' })
    currentStatus.value = 'completed'
    toast.add({ title: 'Cohort completed', color: 'success' })
    isCompleteModalOpen.value = false
    await cohort.refreshCohort()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isCompleting.value = false
  }
}

// Ellipsis menu: delete only
const ellipsisItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Delete cohort',
      icon: 'i-ph-trash-simple-bold',
      color: 'error' as const,
      onSelect: () => {
        cohort.isDeleteCohortOpen = true
      }
    }
  ]
])
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <!-- Header: back · title · badge · lifecycle actions · ellipsis (delete only) -->
    <div class="flex items-center justify-between gap-3 px-1 shrink-0 mb-6">
      <div class="flex items-center gap-3 min-w-0">
        <UButton icon="i-ph-arrow-left-bold" color="neutral" variant="ghost" to="/admin/cohorts" />
        <h1 class="text-base font-semibold text-highlighted truncate">
          {{ cohort.detail?.academy?.title }} — {{ cohort.detail?.name }}
        </h1>
        <UBadge
          :label="COHORT_PHASE_LABEL[currentPhase]"
          :color="COHORT_PHASE_COLOR[currentPhase]"
          variant="subtle"
          class="shrink-0"
        />
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <UButton
          label="Complete Cohort"
          color="primary"
          :loading="isCompleting"
          :disabled="isCompleting || isCompleted"
          @click="isCompleteModalOpen = true"
        />

        <!-- Ellipsis: delete only -->
        <UDropdownMenu :items="ellipsisItems">
          <UButton
            icon="i-ph-dots-three-vertical-bold"
            color="neutral"
            variant="ghost"
            :disabled="isCompleting || cohort.isEditingCohort"
          />
        </UDropdownMenu>
      </div>
    </div>

    <UTabs
      :items="tabItems"
      variant="link"
      color="primary"
      :unmount-on-hide="false"
      :ui="{
        root: 'flex-1 min-h-0',
        list: 'p-0! shrink-0',
        content: 'flex-1 min-h-0',
        trigger: 'px-3 sm:px-6 whitespace-nowrap'
      }"
    >
      <template #information>
        <div class="flex h-full">
          <div class="flex-1 overflow-y-auto py-6">
            <UForm
              :validate-on="['submit']"
              ref="formRef"
              :schema="cohortEditSchema"
              :state="cohort.editCohortForm as any"
              @submit="cohort.onEditCohort"
            >
              <AdminCohortFormBasicInfo v-model="cohort.editCohortForm" />
            </UForm>

            <div class="mt-6 flex justify-end max-w-5xl">
              <UButton
                label="Save information"
                color="primary"
                :loading="cohort.isEditingCohort"
                :disabled="cohort.isEditingCohort || isCompleting"
                @click="formRef?.submit()"
              />
            </div>
          </div>
        </div>
      </template>

      <template #modules>
        <AdminCohortTabModules
          :modules="cohort.detail?.modules ?? []"
          @add-module="cohortModules.isAddModuleOpen = true"
          @edit-module="cohortModules.openEditModule"
          @delete-module="cohortModules.confirmDeleteModule"
        />
      </template>

      <template #statistics>
        <div class="py-8 sm:py-16 text-center text-muted text-sm min-h-[200px] sm:min-h-[400px]">
          On Planning...
        </div>
      </template>

      <template #students>
        <AdminCohortTabStudents
          :enrollments="cohortEnrollments.enrollments"
          @invite="cohortEnrollments.openInviteStudentModal"
          @remove="() => {}"
          @generate-cert="cohortEnrollments.openGenerateCertModal"
          @regenerate-cert="cohortEnrollments.openRegenerateCertModal"
          @drop-student="cohortEnrollments.submitDropStudent"
          @edit-placement="cohortEnrollments.openAssignModal"
        />
      </template>

      <template #mentors>
        <AdminCohortTabMentors
          :mentors="cohort.detail?.mentors ?? []"
          @invite="cohortEnrollments.openInviteMentorModal"
          @remove="() => {}"
        />
      </template>
    </UTabs>
  </div>

  <AdminCohortModuleModal
    v-model:open="cohortModules.isAddModuleOpen"
    v-model:form="cohortModules.addModuleForm"
    v-model:save-and-add-more="cohortModules.saveAndAddMore"
    mode="add"
    :loading="cohortModules.isAddingModule"
    :pending-attachments="cohortModules.pendingAttachments"
    @submit="cohortModules.submitAddModule"
    @cancel="cohortModules.resetAddModuleForm"
    @add-link="cohortModules.addPendingLink"
    @add-file="cohortModules.addPendingFile"
    @remove-attachment="cohortModules.removePendingAttachment"
  />

  <AdminCohortModuleModal
    v-model:open="cohortModules.isEditModuleOpen"
    v-model:form="cohortModules.editModuleForm"
    mode="edit"
    :loading="cohortModules.isEditingModule"
    :attachments="cohortModules.moduleAttachments"
    :pending-attachments="cohortModules.editPendingAttachments"
    :is-deleting-attachment="cohortModules.isDeletingAttachment"
    @submit="cohortModules.submitEditModule"
    @add-link="cohortModules.addEditPendingLink"
    @add-file="cohortModules.addEditPendingFile"
    @remove-attachment="cohortModules.removeEditPendingAttachment"
    @delete-attachment="cohortModules.submitDeleteAttachment"
  />

  <AdminConfirmDeleteModal
    v-model:open="cohort.isDeleteCohortOpen"
    :item-name="cohort.detail?.name ?? ''"
    :loading="cohort.isDeletingCohort"
    @confirm="cohort.onDeleteCohort"
  />

  <AdminConfirmDeleteModal
    v-model:open="cohortModules.isDeleteModuleOpen"
    :loading="cohortModules.isDeletingModule"
    @confirm="cohortModules.submitDeleteModule"
  />

  <AdminCohortInviteStudentModal
    v-model:open="cohortEnrollments.isInviteStudentOpen"
    v-model:email="cohortEnrollments.inviteStudentEmail"
    :loading="cohortEnrollments.isInvitingStudent"
    @submit="cohortEnrollments.submitInviteStudent"
  />

  <AdminCohortInviteMentorModal
    v-model:open="cohortEnrollments.isInviteMentorOpen"
    v-model:form="cohortEnrollments.mentorForm"
    :loading="cohortEnrollments.isInvitingMentor"
    @submit="cohortEnrollments.submitInviteMentor"
  />

  <AdminCohortGenerateCertificateModal
    v-model:open="cohortEnrollments.isGenerateCertOpen"
    v-model:form="cohortEnrollments.certGradesForm"
    :loading="cohortEnrollments.isGeneratingCert"
    @submit="cohortEnrollments.submitGenerateCert"
    @cancel="cohortEnrollments.isGenerateCertOpen = false"
  />

  <AdminCohortAssignCohortSlideover
    :open="cohortEnrollments.isAssignOpen"
    :placement="cohortEnrollments.assignTarget"
    :academy-name="cohort.detail?.academy?.title"
    :cohorts="cohortEnrollments.availableCohorts"
    :selected-cohort-id="cohortEnrollments.selectedCohortId"
    :is-loading-cohorts="cohortEnrollments.isLoadingCohorts"
    :is-assigning="cohortEnrollments.isAssigning"
    :is-dropping-student="cohortEnrollments.isDroppingStudent"
    @update:open="cohortEnrollments.isAssignOpen = $event"
    @update:selected-cohort-id="cohortEnrollments.selectedCohortId = $event"
    @confirm="cohortEnrollments.submitAssign"
    @drop="cohortEnrollments.submitDropFromCohort(cohortEnrollments.assignTarget!.id)"
  />

  <UModal
    v-model:open="isCompleteModalOpen"
    title="Complete Cohort"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p class="text-sm">
        This will issue certificates for
        <span class="font-semibold">{{ placementCount }}</span>
        {{ placementCount === 1 ? 'student' : 'students' }} and cannot be undone. Continue?
      </p>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="isCompleting"
        @click="isCompleteModalOpen = false"
      />
      <UButton
        label="Complete cohort"
        color="primary"
        :loading="isCompleting"
        :disabled="isCompleting"
        @click="onCompleteConfirm"
      />
    </template>
  </UModal>
</template>
