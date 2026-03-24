<script setup lang="ts">
interface Student {
  id: number
  status: string
  user: { id: number; first_name: string; last_name: string; avatar: string | null }
}

defineProps<{ students: Student[] }>()

function initials(s: Student) {
  return `${s.user.first_name[0] ?? ''}${s.user.last_name[0] ?? ''}`.toUpperCase() || '?'
}
</script>

<template>
  <div class="pt-2 min-h-[400px]">
    <div v-if="students.length === 0" class="flex flex-col items-center justify-center py-16 text-muted text-sm">
      <UIcon name="i-lucide-users" class="size-10 mb-3 opacity-30" />
      No students enrolled yet.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <div
        v-for="student in students"
        :key="student.id"
        class="flex items-center gap-3 p-3 rounded-lg border border-default"
      >
        <UAvatar
          :src="student.user.avatar ?? undefined"
          :text="initials(student)"
          size="md"
          color="primary"
        />
        <span class="font-medium text-sm truncate">
          {{ student.user.first_name }} {{ student.user.last_name }}
        </span>
      </div>
    </div>
  </div>
</template>
