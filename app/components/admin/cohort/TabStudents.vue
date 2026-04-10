<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import type { AdminCohortEnrollment } from '~/types/cohort'

const props = defineProps<{
  enrollments: AdminCohortEnrollment[]
}>()

const emit = defineEmits<{
  invite: []
  remove: [enrollmentId: number]
}>()

function rowMenu(enrollmentId: number): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Remove',
        icon: 'i-ph-user-x-bold',
        color: 'error',
        onSelect: () => emit('remove', enrollmentId)
      }
    ]
  ]
}

function initials(enrollment: AdminCohortEnrollment) {
  return (
    `${enrollment.user.first_name[0] ?? ''}${enrollment.user.last_name[0] ?? ''}`.toUpperCase() ||
    '?'
  )
}

const columns: TableColumn<AdminCohortEnrollment>[] = [
  {
    id: 'no',
    header: '#',
    size: 48,
    cell: ({ row }) => String(row.index + 1)
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => `${row.original.user.first_name} ${row.original.user.last_name}`
  },
  {
    id: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.user.email
  },
  {
    id: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.user.phone ?? '-'
  },
  {
    id: 'actions',
    header: '',
    size: 56
  }
]
</script>

<template>
  <div class="pt-2 min-h-[400px]">
    <!-- Invite button -->
    <div class="flex justify-end mb-4">
      <UButton
        label="Invite Student"
        icon="i-ph-user-plus-bold"
        color="primary"
        @click="emit('invite')"
      />
    </div>

    <div
      v-if="enrollments.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-ph-users-bold" class="size-10 mb-3 opacity-30" />
      No students enrolled yet.
    </div>

    <UTable v-else :data="props.enrollments" :columns="columns">
      <template #name-cell="{ row }">
        <div class="flex items-center gap-2.5">
          <UAvatar
            :src="row.original.user.avatar ?? undefined"
            :text="initials(row.original)"
            size="xs"
            color="primary"
          />
          <span class="font-medium">
            {{ row.original.user.first_name }} {{ row.original.user.last_name }}
          </span>
        </div>
      </template>

      <template #email-cell="{ row }">
        <span class="hidden md:block text-muted">{{ row.original.user.email }}</span>
      </template>

      <template #phone-cell="{ row }">
        <span class="hidden md:block text-muted">{{ row.original.user.phone ?? '-' }}</span>
      </template>

      <template #actions-cell="{ row }">
        <div class="text-right">
          <UDropdownMenu :items="rowMenu(row.original.id)">
            <UButton
              icon="i-ph-dots-three-vertical-bold"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UTable>
  </div>
</template>
