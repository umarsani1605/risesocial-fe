<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

export interface CohortStudent {
  id: number
  initials: string
  name: string
  email: string
  phone: string
}

defineProps<{
  students: CohortStudent[]
}>()

const emit = defineEmits<{
  invite: []
  remove: [studentId: number]
}>()

function rowMenu(studentId: number): DropdownMenuItem[][] {
  return [[
    {
      label: 'Remove',
      icon: 'i-lucide-user-x',
      color: 'error',
      onSelect: () => emit('remove', studentId),
    },
  ]]
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

    <div v-if="students.length === 0" class="flex flex-col items-center justify-center py-16 text-muted text-sm">
      <UIcon name="i-lucide-users" class="size-10 mb-3 opacity-30" />
      Belum ada student terdaftar.
    </div>

    <!-- Students table – pola dari student dashboard tapi dengan kolom email, phone, actions -->
    <div v-else class="rounded-lg border border-default overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-elevated/50">
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-muted w-10">#</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-muted">Name</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-muted">Email</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-muted">Phone</th>
            <th class="w-10" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, i) in students"
            :key="student.id"
            class="border-t border-default hover:bg-elevated/30 transition-colors"
          >
            <td class="px-4 py-3.5 text-muted">{{ i + 1 }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                <span
                  class="inline-flex items-center justify-center size-8 rounded-md bg-primary-100 text-primary text-xs font-bold shrink-0"
                >
                  {{ student.initials }}
                </span>
                <span class="font-medium">{{ student.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3.5 text-muted">{{ student.email }}</td>
            <td class="px-4 py-3.5 text-muted">{{ student.phone }}</td>
            <td class="px-4 py-3.5 text-right">
              <UDropdownMenu :items="rowMenu(student.id)">
                <UButton
                  icon="i-lucide-ellipsis-vertical"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                />
              </UDropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
