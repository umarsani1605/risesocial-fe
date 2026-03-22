<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { AdminCohortEnrollment } from '~/types/cohort'

defineProps<{
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
        icon: 'i-lucide-user-x',
        color: 'error',
        onSelect: () => emit('remove', enrollmentId)
      }
    ]
  ]
}

function initials(enrollment: AdminCohortEnrollment) {
  return `${enrollment.user.first_name[0] ?? ''}${enrollment.user.last_name[0] ?? ''}`.toUpperCase() || '?'
}
</script>

<template>
  <div class="pt-2 min-h-[400px]">
    <!-- Invite button -->
    <div class="flex justify-end mb-4">
      <UButton
        label="Invite Student"
        icon="i-lucide-user-plus"
        color="primary"
        size="sm"
        @click="emit('invite')"
      />
    </div>

    <div
      v-if="enrollments.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-lucide-users" class="size-10 mb-3 opacity-30" />
      No students enrolled yet.
    </div>

    <div v-else class="rounded-lg border border-default overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-elevated/50">
              <th class="text-left px-4 py-2.5 text-xs font-semibold text-muted w-10">#</th>
              <th class="text-left px-4 py-2.5 text-xs font-semibold text-muted">Name</th>
              <th class="hidden md:table-cell text-left px-4 py-2.5 text-xs font-semibold text-muted">Email</th>
              <th class="hidden md:table-cell text-left px-4 py-2.5 text-xs font-semibold text-muted">Phone</th>
              <th class="w-10" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(enrollment, i) in enrollments"
              :key="enrollment.id"
              class="border-t border-default hover:bg-elevated/30 transition-colors"
            >
              <td class="px-4 py-3.5 text-muted">{{ i + 1 }}</td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2.5">
                  <UAvatar
                    :src="enrollment.user.avatar ?? undefined"
                    :text="initials(enrollment)"
                    size="xs"
                    color="primary"
                  />
                  <span class="font-medium">{{ enrollment.user.first_name }} {{ enrollment.user.last_name }}</span>
                </div>
              </td>
              <td class="hidden md:table-cell px-4 py-3.5 text-muted">{{ enrollment.user.email }}</td>
              <td class="hidden md:table-cell px-4 py-3.5 text-muted">{{ enrollment.user.phone ?? '-' }}</td>
              <td class="px-4 py-3.5 text-right">
                <UDropdownMenu :items="rowMenu(enrollment.id)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
