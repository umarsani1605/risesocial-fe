<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import type { AdminCohortMentor } from '~/types/cohort'

const props = defineProps<{
  mentors: AdminCohortMentor[]
}>()

const emit = defineEmits<{
  invite: []
  remove: [mentorId: number]
}>()

function rowMenu(mentorId: number): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Remove',
        icon: 'i-ph-user-x-bold',
        color: 'error',
        onSelect: () => emit('remove', mentorId)
      }
    ]
  ]
}

function initials(mentor: AdminCohortMentor) {
  return (
    mentor.name
      .split(' ')
      .map((n) => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  )
}

const columns: TableColumn<AdminCohortMentor>[] = [
  {
    id: 'no',
    header: '#',
    size: 48,
    cell: ({ row }) => String(row.index + 1)
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name
  },
  {
    id: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email ?? '-'
  },
  {
    id: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.phone ?? '-'
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
        label="Invite Mentor"
        icon="i-ph-user-plus-bold"
        color="primary"
        @click="emit('invite')"
      />
    </div>

    <div
      v-if="mentors.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-ph-user-circle-bold" class="size-10 mb-3 opacity-30" />
      No mentors assigned yet.
    </div>

    <UTable v-else :data="props.mentors" :columns="columns">
      <template #name-cell="{ row }">
        <div class="flex items-center gap-2.5">
          <UAvatar
            :src="row.original.avatar ?? undefined"
            :text="initials(row.original)"
            size="xs"
            color="primary"
          />
          <div>
            <p class="font-medium">{{ row.original.name }}</p>
            <p v-if="row.original.job_title" class="text-xs text-muted">
              {{ row.original.job_title }}
            </p>
          </div>
        </div>
      </template>

      <template #email-cell="{ row }">
        <span class="hidden md:block text-muted">{{ row.original.email ?? '-' }}</span>
      </template>

      <template #phone-cell="{ row }">
        <span class="hidden md:block text-muted">{{ row.original.phone ?? '-' }}</span>
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
