<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import type { AdminCohortEnrollment } from '~/types/cohort'

const props = defineProps<{
  enrollments: AdminCohortEnrollment[]
}>()

const emit = defineEmits<{
  invite: []
  remove: [enrollmentId: number]
  generateCert: [enrollmentId: number]
  regenerateCert: [enrollmentId: number]
  dropStudent: [enrollmentId: number]
}>()

function rowMenu(enrollment: AdminCohortEnrollment): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Drop Student',
        icon: 'i-ph-user-x-bold',
        color: 'error' as const,
        onSelect: () => emit('dropStudent', enrollment.id)
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
    id: 'certificate',
    header: 'Certificate'
  },
  {
    id: 'actions',
    header: '',
    size: 160
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
            :label="row.original.certificate ? 'Regenerate Certificate' : 'Generate Certificate'"
            icon="i-ph-certificate-bold"
            variant="light"
            @click="
              row.original.certificate
                ? emit('regenerateCert', row.original.id)
                : emit('generateCert', row.original.id)
            "
          />
          <!-- <UDropdownMenu :items="rowMenu(row.original)">
            <UButton
              icon="i-ph-dots-three-vertical-bold"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UDropdownMenu> -->
        </div>
      </template>
    </UTable>
  </div>
</template>
