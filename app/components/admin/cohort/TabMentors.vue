<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

export interface CohortMentor {
  id: number
  initials: string
  name: string
  jobTitle?: string | null
  email?: string
  phone?: string
}

defineProps<{
  mentors: CohortMentor[]
}>()

const emit = defineEmits<{
  invite: []
  remove: [mentorId: number]
}>()

function rowMenu(mentorId: number): DropdownMenuItem[][] {
  return [[
    {
      label: 'Remove',
      icon: 'i-lucide-user-x',
      color: 'error',
      onSelect: () => emit('remove', mentorId),
    },
  ]]
}
</script>

<template>
  <div class="pt-2 min-h-[400px]">
    <!-- Invite button -->
    <div class="flex justify-end mb-4">
      <UButton
        label="Invite Mentors"
        icon="i-lucide-user-plus"
        color="primary"
        size="sm"
        @click="emit('invite')"
      />
    </div>

    <div v-if="mentors.length === 0" class="flex flex-col items-center justify-center py-16 text-muted text-sm">
      <UIcon name="i-lucide-user-round" class="size-10 mb-3 opacity-30" />
      Belum ada mentor terdaftar.
    </div>

    <!-- Mentors table – identik dengan students -->
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
            v-for="(mentor, i) in mentors"
            :key="mentor.id"
            class="border-t border-default hover:bg-elevated/30 transition-colors"
          >
            <td class="px-4 py-3.5 text-muted">{{ i + 1 }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                <span
                  class="inline-flex items-center justify-center size-8 rounded-md bg-primary-100 text-primary text-xs font-bold shrink-0"
                >
                  {{ mentor.initials }}
                </span>
                <div>
                  <p class="font-medium">{{ mentor.name }}</p>
                  <p v-if="mentor.jobTitle" class="text-xs text-muted">{{ mentor.jobTitle }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-muted">{{ mentor.email ?? '-' }}</td>
            <td class="px-4 py-3.5 text-muted">{{ mentor.phone ?? '-' }}</td>
            <td class="px-4 py-3.5 text-right">
              <UDropdownMenu :items="rowMenu(mentor.id)">
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
