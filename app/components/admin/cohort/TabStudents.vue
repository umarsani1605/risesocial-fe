<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  enrollments: AdminCohortPlacement[]
}>()

const emit = defineEmits<{
  invite: []
  remove: [placementId: number]
  generateCert: [placementId: number]
  regenerateCert: [placementId: number]
  dropStudent: [placementId: number]
  editPlacement: [placement: AdminCohortPlacement]
}>()

function initials(enrollment: AdminCohortPlacement) {
  return (
    `${enrollment.user.first_name?.[0] ?? ''}${enrollment.user.last_name?.[0] ?? ''}`.toUpperCase() ||
    '?'
  )
}

const columns: TableColumn<AdminCohortPlacement>[] = [
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
    id: 'certificate',
    header: 'Certificate'
  },
  {
    id: 'actions',
    header: '',
    size: 200
  }
]
</script>

<template>
  <div class="pt-6 min-h-[400px]">
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
            size="md"
            color="primary"
            class="bg-primary text-white text-sm rounded-full"
          />
          <div>
            <p class="font-medium text-sm">
              {{ row.original.user.first_name }} {{ row.original.user.last_name }}
            </p>
            <p class="text-muted hidden md:block">{{ row.original.user.email }}</p>
          </div>
        </div>
      </template>

      <template #certificate-cell="{ row }">
        <UButton
          v-if="row.original.certificate?.file_url"
          :to="row.original.certificate.file_url"
          target="_blank"
          :label="row.original.certificate.certificate_code"
          color="neutral"
          variant="link"
          size="xs"
          icon="i-ph-file-pdf-bold"
          class="font-mono"
        />
        <span v-else class="text-muted text-sm">—</span>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex justify-end gap-2">
          <UButton
            label="Move Cohort"
            color="primary"
            variant="light"
            size="sm"
            leading-icon="i-ph-arrows-left-right-bold"
            @click="emit('editPlacement', row.original)"
          />
          <UButton
            :label="row.original.certificate ? 'Regenerate Certificate' : 'Generate Certificate'"
            icon="i-ph-certificate-bold"
            variant="subtle"
            size="sm"
            @click="
              row.original.certificate
                ? emit('regenerateCert', row.original.id)
                : emit('generateCert', row.original.id)
            "
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
