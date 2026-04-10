<script setup lang="ts">
import type { TabsItem, DropdownMenuItem } from '@nuxt/ui'
import type { Ref } from 'vue'
import type { AdminCohortDetail } from '~/types/cohort'
import { useAdminCohort } from '@/composables/useAdminCohort'
import { useAdminCohortModules } from '@/composables/useAdminCohortModules'
import { useAdminCohortEnrollments } from '@/composables/useAdminCohortEnrollments'
import { cohortEditSchema } from '@/schemas/cohort'
import { COHORT_STATUS_COLOR, COHORT_STATUS_LABEL } from '@/constants/cohort'

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

type CohortStatus = AdminCohortDetail['status']
const currentStatus = ref<CohortStatus>(cohortRaw.value!.data!.status)
const isTransitioningStatus = ref(false)

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
  cohort.editCohortForm.status = cohort.detail.status
  cohort.editCohortForm.start_date = cohort.detail.start_date?.split('T')[0] ?? ''
  cohort.editCohortForm.end_date = cohort.detail.end_date?.split('T')[0] ?? ''
  currentStatus.value = cohort.detail.status
})

async function onSave(targetStatus: CohortStatus, successMessage: string, loadingRef: Ref<boolean>) {
  loadingRef.value = true
  try {
    await api(`/admin/cohorts/${cohortId}`, {
      method: 'PUT',
      body: {
        name: cohort.editCohortForm.name,
        description: cohort.editCohortForm.description || null,
        status: targetStatus,
        start_date: cohort.editCohortForm.start_date,
        end_date: cohort.editCohortForm.end_date,
      }
    })
    currentStatus.value = targetStatus
    cohort.editCohortForm.status = targetStatus
    toast.add({ title: successMessage, color: 'success' })
    await cohort.refreshCohort()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    loadingRef.value = false
  }
}

const headerMenuItems = computed<DropdownMenuItem[][]>(() => {
  const statusActions: DropdownMenuItem[] = []
  if (currentStatus.value === 'not_started') {
    statusActions.push({
      label: 'Start Cohort',
      icon: 'i-ph-play-bold',
      onSelect: () => onSave('ongoing', 'Cohort started', isTransitioningStatus)
    })
  } else if (currentStatus.value === 'ongoing') {
    statusActions.push({
      label: 'Complete Cohort',
      icon: 'i-ph-check-circle-bold',
      onSelect: () => onSave('completed', 'Cohort completed', isTransitioningStatus)
    })
    statusActions.push({
      label: 'Reset to Not Started',
      icon: 'i-ph-arrow-counter-clockwise-bold',
      onSelect: () => onSave('not_started', 'Cohort reset', isTransitioningStatus)
    })
  } else {
    statusActions.push({
      label: 'Reopen Cohort',
      icon: 'i-ph-arrow-clockwise-bold',
      onSelect: () => onSave('ongoing', 'Cohort reopened', isTransitioningStatus)
    })
  }
  return [
    statusActions,
    [{ label: 'Delete Cohort', icon: 'i-ph-trash-simple-bold', color: 'error', onSelect: () => { cohort.isDeleteCohortOpen = true } }]
  ]
})
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <div class="flex items-center justify-between gap-3 px-1 shrink-0 mb-6">
      <div class="flex items-center gap-3 min-w-0">
        <UButton icon="i-ph-arrow-left-bold" color="neutral" variant="ghost" to="/admin/cohorts" />
        <h1 class="text-base font-semibold text-highlighted truncate">
          {{ cohort.detail?.academy?.title }} — {{ cohort.detail?.name }}
        </h1>
        <UBadge
          :label="COHORT_STATUS_LABEL[currentStatus]"
          :color="COHORT_STATUS_COLOR[currentStatus]"
          variant="subtle"
          class="shrink-0"
        />
      </div>

      <div class="flex items-center gap-1">
        <UButton
          label="Save Cohort"
          color="primary"
          icon="i-ph-floppy-disk"
          :loading="cohort.isEditingCohort"
          :disabled="cohort.isEditingCohort || isTransitioningStatus"
          @click="formRef?.submit()"
        />
        <UDropdownMenu :items="headerMenuItems">
          <UButton
            icon="i-ph-dots-three-vertical-bold"
            color="neutral"
            variant="ghost"
            :loading="isTransitioningStatus"
            :disabled="isTransitioningStatus || cohort.isEditingCohort"
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
              ref="formRef"
              :schema="cohortEditSchema"
              :state="cohort.editCohortForm as any"
              @submit="cohort.onEditCohort"
            >
              <AdminCohortFormBasicInfo v-model="cohort.editCohortForm" />
            </UForm>
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
</template>
