<script setup lang="ts">
import type { TabsItem, DropdownMenuItem } from '@nuxt/ui'
import type { AdminCohortDetail } from '~/types/cohort'
import { useAdminCohort } from '@/composables/useAdminCohort'
import { useAdminCohortModules } from '@/composables/useAdminCohortModules'
import { useAdminCohortEnrollments } from '@/composables/useAdminCohortEnrollments'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Cohort Details',
  navbarIcon: 'i-lucide-layout-list',
  middleware: 'admin'
})

const route = useRoute()
const cohortId = route.params.id as string

const { api } = useApi()
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

const tabItems: TabsItem[] = [
  { label: 'Modules', slot: 'modules' },
  { label: 'Statistics', slot: 'statistics' },
  { label: 'Students', slot: 'students' },
  { label: 'Mentors', slot: 'mentors' }
]

const headerMenuItems: DropdownMenuItem[][] = [
  [
    { label: 'Edit Info', icon: 'i-lucide-pencil', onSelect: () => cohort.openEditCohort() },
    {
      label: 'Delete Cohort',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => {
        cohort.isDeleteCohortOpen = true
      }
    }
  ]
]
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3 px-1">
        <div class="flex items-center gap-3 min-w-0">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="sm"
            to="/admin/cohorts"
          />
          <h1 class="text-base font-semibold text-highlighted truncate">
            {{ cohort.detail.name }}
          </h1>
        </div>

        <UDropdownMenu :items="headerMenuItems">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
        </UDropdownMenu>
      </div>
    </template>

    <UTabs
      :items="tabItems"
      variant="link"
      color="primary"
      :unmount-on-hide="false"
      :ui="{
        list: 'p-0!',
        trigger: 'px-3 sm:px-6 whitespace-nowrap'
      }"
    >
      <template #modules>
        <AdminCohortTabModules
          :modules="cohort.detail.modules"
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
          :mentors="cohort.detail.mentors ?? []"
          @invite="cohortEnrollments.openInviteMentorModal"
          @remove="() => {}"
        />
      </template>
    </UTabs>
  </UCard>

  <AdminCohortModuleModal
    mode="add"
    v-model:open="cohortModules.isAddModuleOpen"
    v-model:form="cohortModules.addModuleForm"
    v-model:save-and-add-more="cohortModules.saveAndAddMore"
    :loading="cohortModules.isAddingModule"
    :pending-attachments="cohortModules.pendingAttachments"
    @submit="cohortModules.submitAddModule"
    @cancel="cohortModules.resetAddModuleForm"
    @add-link="cohortModules.addPendingLink"
    @add-file="cohortModules.addPendingFile"
    @remove-attachment="cohortModules.removePendingAttachment"
  />

  <AdminCohortModuleModal
    mode="edit"
    v-model:open="cohortModules.isEditModuleOpen"
    v-model:form="cohortModules.editModuleForm"
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

  <AdminCohortEditInfoModal
    v-model:open="cohort.isEditCohortOpen"
    v-model:form="cohort.editCohortForm"
    :loading="cohort.isEditingCohort"
    @submit="cohort.onEditCohort"
  />

  <AdminConfirmDeleteModal
    v-model:open="cohort.isDeleteCohortOpen"
    :item-name="cohort.detail.name"
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
