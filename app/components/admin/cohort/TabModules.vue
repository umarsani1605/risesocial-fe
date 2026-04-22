<script setup lang="ts">
import type { AdminCohortModule } from '~/types/cohort'

const props = defineProps<{
  modules: AdminCohortModule[]
}>()

const emit = defineEmits<{
  'add-module': []
  'edit-module': [module: AdminCohortModule]
  'delete-module': [moduleId: number]
}>()

const openModules = ref<Set<number>>(new Set(props.modules.slice(0, 1).map((m) => m.id)))

watch(
  () => props.modules,
  (newModules) => {
    if (openModules.value.size === 0 && newModules.length > 0) {
      openModules.value = new Set(newModules.slice(0, 1).map((m) => m.id))
    }
  }
)

function toggleModule(id: number) {
  if (openModules.value.has(id)) openModules.value.delete(id)
  else openModules.value.add(id)
}

function isOpen(id: number) {
  return openModules.value.has(id)
}

const isAnyOpen = computed(() => openModules.value.size > 0)

function toggleAll() {
  if (isAnyOpen.value) {
    openModules.value = new Set()
  } else {
    openModules.value = new Set(props.modules.map((m) => m.id))
  }
}
</script>

<template>
  <div class="space-y-3 pt-4 min-h-[400px]">
    <div class="flex items-center justify-between px-2 mb-4">
      <UButton
        label="Add Module"
        icon="i-ph-plus-bold"
        color="primary"
        size="md"
        @click="emit('add-module')"
      />
      <UButton
        v-if="modules.length > 0"
        :label="isAnyOpen ? 'Collapse All' : 'Expand All'"
        icon="i-ph-arrows-down-up"
        color="neutral"
        variant="link"
        class="w-36"
        @click="toggleAll"
      />
    </div>

    <div
      v-if="modules.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-ph-book-open-bold" class="size-10 mb-3 opacity-30" />
      No modules yet. Click "Add Module" to get started.
    </div>

    <AdminCohortModuleItem
      v-for="module in modules"
      :key="module.id"
      :module="module"
      :is-open="isOpen(module.id)"
      @toggle="toggleModule(module.id)"
      @edit="emit('edit-module', $event)"
      @delete="emit('delete-module', $event)"
    />
  </div>
</template>
