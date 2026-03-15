<script setup lang="ts">
import type { AcademyTheme } from '@/types'

const props = defineProps<{
  academyId: number
  initialData: AcademyTheme[]
}>()

const { api } = useApi()
const toast = useToast()

const themes = ref<AcademyTheme[]>(structuredClone(props.initialData))
const expandedThemes = ref<Set<number>>(new Set(themes.value[0] ? [themes.value[0].id] : []))

// Theme modal
const isThemeModalOpen = ref(false)
const editingThemeId = ref<number | null>(null)
const isSavingTheme = ref(false)
const themeForm = reactive({ title: '', description: '', order: '' })

// Topic modal
const isTopicModalOpen = ref(false)
const editingTopicId = ref<number | null>(null)
const isSavingTopic = ref(false)
const topicForm = reactive({ title: '', description: '', theme_id: 0, order: '' })

watch(() => props.initialData, (val) => {
  themes.value = structuredClone(val)
}, { deep: true })

const themeOptions = computed(() =>
  themes.value.map((t) => ({ label: t.title, value: t.id }))
)

const isThemeExpanded = (id: number) => expandedThemes.value.has(id)

function toggleTheme(id: number) {
  if (expandedThemes.value.has(id)) expandedThemes.value.delete(id)
  else expandedThemes.value.add(id)
}

async function refresh() {
  const res = await api<ApiResponse<AcademyTheme[]>>(`/admin/academies/${props.academyId}/themes`)
  themes.value = res.data
}

function openAddTheme() {
  editingThemeId.value = null
  themeForm.title = ''
  themeForm.description = ''
  themeForm.order = String(themes.value.length + 1)
  isThemeModalOpen.value = true
}

function openEditTheme(item: AcademyTheme) {
  editingThemeId.value = item.id
  themeForm.title = item.title
  themeForm.description = item.description
  themeForm.order = String(item.order)
  isThemeModalOpen.value = true
}

async function saveTheme() {
  if (!themeForm.title.trim()) {
    toast.add({ title: 'Title is required', color: 'error' })
    return
  }
  isSavingTheme.value = true
  try {
    const body = {
      title: themeForm.title,
      description: themeForm.description,
      order: Number(themeForm.order)
    }
    if (editingThemeId.value !== null) {
      await api(`/admin/academies/${props.academyId}/themes/${editingThemeId.value}`, { method: 'PUT', body })
    } else {
      const res = await api<ApiResponse<AcademyTheme>>(`/admin/academies/${props.academyId}/themes`, { method: 'POST', body })
      expandedThemes.value.add(res.data.id)
    }
    await refresh()
    isThemeModalOpen.value = false
    toast.add({ title: 'Theme saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    isSavingTheme.value = false
  }
}

async function deleteTheme(item: AcademyTheme) {
  try {
    await api(`/admin/academies/${props.academyId}/themes/${item.id}`, { method: 'DELETE' })
    expandedThemes.value.delete(item.id)
    await refresh()
    toast.add({ title: 'Theme deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}

function openAddTopic(themeId: number) {
  editingTopicId.value = null
  topicForm.title = ''
  topicForm.description = ''
  topicForm.theme_id = themeId
  const theme = themes.value.find((t) => t.id === themeId)
  topicForm.order = String((theme?.topics.length ?? 0) + 1)
  expandedThemes.value.add(themeId)
  isTopicModalOpen.value = true
}

function openEditTopic(item: AcademyTopic) {
  editingTopicId.value = item.id
  topicForm.title = item.title
  topicForm.description = item.description
  topicForm.theme_id = item.theme_id
  topicForm.order = String(item.order)
  isTopicModalOpen.value = true
}

async function saveTopic() {
  if (!topicForm.title.trim()) {
    toast.add({ title: 'Title is required', color: 'error' })
    return
  }
  isSavingTopic.value = true
  try {
    const body = {
      theme_id: topicForm.theme_id,
      title: topicForm.title,
      description: topicForm.description,
      topic_order: Number(topicForm.order)
    }
    if (editingTopicId.value !== null) {
      await api(`/admin/academies/${props.academyId}/topics/${editingTopicId.value}`, { method: 'PUT', body })
    } else {
      await api(`/admin/academies/${props.academyId}/topics`, { method: 'POST', body })
    }
    await refresh()
    isTopicModalOpen.value = false
    toast.add({ title: 'Topic saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    isSavingTopic.value = false
  }
}

async function deleteTopic(_themeId: number, item: AcademyTopic) {
  try {
    await api(`/admin/academies/${props.academyId}/topics/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Topic deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton label="+ Add Theme" color="primary" @click="openAddTheme" />
    </div>

    <div class="border border-default rounded-lg overflow-hidden">
      <div class="grid grid-cols-[2.5rem_2.5rem_1fr_1fr_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium">
        <span />
        <span>Order</span>
        <span>Title</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <template v-for="(theme, themeIdx) in themes" :key="theme.id">
        <div class="grid grid-cols-[2.5rem_2.5rem_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-default items-center">
          <button class="flex items-center justify-center" @click="toggleTheme(theme.id)">
            <UIcon
              :name="isThemeExpanded(theme.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
              class="size-4 text-muted"
            />
          </button>
          <span class="text-sm font-medium text-muted">{{ themeIdx + 1 }}</span>
          <span class="text-sm font-semibold">{{ theme.title }}</span>
          <span class="text-sm text-muted truncate">{{ theme.description }}</span>
          <div class="flex items-center gap-2 shrink-0">
            <UButton label="+ Add Topic" size="xs" color="primary" variant="outline" @click="openAddTopic(theme.id)" />
            <UButton label="Edit" size="xs" color="neutral" variant="outline" leading-icon="i-lucide-pencil" @click="openEditTheme(theme)" />
            <UButton label="Delete" size="xs" color="error" variant="outline" leading-icon="i-lucide-trash-2" @click="deleteTheme(theme)" />
          </div>
        </div>

        <!-- Topic rows (visible when theme is expanded) -->
        <template v-if="isThemeExpanded(theme.id)">
          <div
            v-for="(topic, topicIdx) in theme.topics"
            :key="topic.id"
            class="grid grid-cols-[2.5rem_2.5rem_1fr_1fr_auto] gap-4 pl-10 pr-4 py-2.5 border-b border-default last:border-b-0 items-center bg-elevated/20"
          >
            <span />
            <span class="text-sm text-muted">{{ topicIdx + 1 }}.</span>
            <span class="text-sm">{{ topic.title }}</span>
            <span class="text-sm text-muted truncate">{{ topic.description }}</span>
            <div class="flex items-center gap-2 shrink-0">
              <UButton label="Edit" size="xs" color="neutral" variant="outline" leading-icon="i-lucide-pencil" @click="openEditTopic(topic)" />
              <UButton label="Delete" size="xs" color="error" variant="outline" leading-icon="i-lucide-trash-2" @click="deleteTopic(theme.id, topic)" />
            </div>
          </div>
          <div v-if="theme.topics.length === 0" class="pl-10 pr-4 py-3 border-b border-default text-sm text-muted bg-elevated/20">
            No topics yet. Click "+ Add Topic" to add one.
          </div>
        </template>
      </template>

      <div v-if="themes.length === 0" class="px-4 py-8 text-center text-sm text-muted">
        No themes added yet. Click "+ Add Theme" to get started.
      </div>
    </div>
  </div>

  <UModal v-model:open="isThemeModalOpen" :title="editingThemeId !== null ? 'Edit Theme' : 'Add Theme'" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title">
          <UInput v-model="themeForm.title" placeholder="e.g. Introduction to Carbon Accounting" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="themeForm.description" placeholder="Theme description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="Order">
          <UInput v-model="themeForm.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isThemeModalOpen = false" />
      <UButton label="Save" color="primary" :loading="isSavingTheme" :disabled="isSavingTheme" @click="saveTheme" />
    </template>
  </UModal>

  <UModal v-model:open="isTopicModalOpen" :title="editingTopicId !== null ? 'Edit Topic' : 'Add Topic'" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Theme">
          <USelect v-model="topicForm.theme_id" :items="themeOptions" placeholder="Select theme" class="w-full" />
        </UFormField>
        <UFormField label="Title">
          <UInput v-model="topicForm.title" placeholder="e.g. What is Carbon Accounting?" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="topicForm.description" placeholder="Topic description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="Order">
          <UInput v-model="topicForm.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isTopicModalOpen = false" />
      <UButton label="Save" color="primary" :loading="isSavingTopic" :disabled="isSavingTopic" @click="saveTopic" />
    </template>
  </UModal>
</template>
