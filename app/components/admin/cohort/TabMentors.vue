<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  mentors: AdminCohortMentor[]
}>()

const emit = defineEmits<{
  invite: []
  edit: [mentor: AdminCohortMentor]
  remove: [mentor: AdminCohortMentor]
}>()

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
    id: 'job_title',
    header: 'Job Title',
    cell: ({ row }) => row.original.job_title ?? '-'
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    size: 180
  }
]
</script>

<template>
  <div class="pt-6 min-h-[400px]">
    <div class="flex justify-end mb-4">
      <UButton label="+ Add" color="primary" class="shrink-0" @click="emit('invite')" />
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
            color="primary"
            class="bg-primary text-white text-sm rounded-full"
          />
          <div>
            <p class="font-medium">{{ row.original.name }}</p>
            <p v-if="row.original.job_title" class="text-xs text-muted">
              {{ row.original.job_title }}
            </p>
          </div>
        </div>
      </template>

      <template #job_title-cell="{ row }">
        <span class="text-muted">{{ row.original.job_title ?? '-' }}</span>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <UButton
            size="sm"
            color="primary"
            variant="light"
            leading-icon="i-ph-pencil-simple-bold"
            label="Edit"
            @click="emit('edit', row.original)"
          />
          <UButton
            size="sm"
            color="error"
            variant="light"
            leading-icon="i-ph-trash-simple-bold"
            label="Remove"
            @click="emit('remove', row.original)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
