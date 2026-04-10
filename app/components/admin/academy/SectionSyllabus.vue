<script setup lang="ts">
import type { AcademyTheme, SyllabusRow } from '@/types'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  academyId: number
  initialData: AcademyTheme[]
}>()

const { api } = useApi()
const toast = useToast()

const themes = ref<AcademyTheme[]>(structuredClone(props.initialData))

// Use reactive Set so .has()/.add()/.delete() trigger computed recomputation
const expandedThemes = reactive(new Set<number>(themes.value[0] ? [themes.value[0].id] : []))

function toggleTheme(id: number) {
  if (expandedThemes.has(id)) expandedThemes.delete(id)
  else expandedThemes.add(id)
}

// Flat list: theme rows + topic rows (only for expanded themes)
const flatData = computed<SyllabusRow[]>(() => {
  const result: SyllabusRow[] = []
  for (const theme of themes.value) {
    result.push({
      id: theme.id,
      _kind: 'theme',
      order: theme.order,
      title: theme.title,
      description: theme.description
    })
    if (expandedThemes.has(theme.id)) {
      for (const topic of theme.topics) {
        result.push({
          id: topic.id,
          _kind: 'topic',
          order: topic.order,
          title: topic.title,
          description: topic.description ?? '',
          theme_id: topic.theme_id
        })
      }
    }
  }
  return result
})

// Per-row background via table-level meta
const tableMeta = {
  class: {
    tr: (row: { original: SyllabusRow }) =>
      row.original._kind === 'topic' ? 'bg-slate-50 dark:bg-slate-900/30' : ''
  }
}

type DeleteTarget = { kind: 'theme'; item: SyllabusRow } | { kind: 'topic'; item: SyllabusRow }

const deleteTarget = ref<DeleteTarget | null>(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

const deleteItemName = computed(() => deleteTarget.value?.item.title ?? '')

// Theme modal
const isThemeModalOpen = ref(false)
const editingTheme = ref<AcademyTheme | null>(null)

// Topic modal
const isTopicModalOpen = ref(false)
const editingTopic = ref<{
  id: number
  theme_id?: number
  title: string
  description: string
  order: number
} | null>(null)
const topicDefaultThemeId = ref(0)
const topicNextOrder = ref(1)

watch(
  () => props.initialData,
  (val) => {
    themes.value = structuredClone(val)
  },
  { deep: true }
)

const themeOptions = computed(() => themes.value.map((t) => ({ label: t.title, value: t.id })))

async function refresh() {
  const res = await api<ApiResponse<AcademyTheme[]>>(`/admin/academies/${props.academyId}/themes`)
  themes.value = res.data
}

function openAddTheme() {
  editingTheme.value = null
  isThemeModalOpen.value = true
}

function openEditTheme(row: SyllabusRow) {
  editingTheme.value = themes.value.find((t) => t.id === row.id) ?? null
  isThemeModalOpen.value = true
}

function onThemeSaved(newThemeId?: number) {
  refresh()
  if (newThemeId) expandedThemes.add(newThemeId)
}

function openAddTopic(themeId: number) {
  editingTopic.value = null
  topicDefaultThemeId.value = themeId
  const theme = themes.value.find((t) => t.id === themeId)
  topicNextOrder.value = (theme?.topics.length ?? 0) + 1
  expandedThemes.add(themeId)
  isTopicModalOpen.value = true
}

function openEditTopic(row: SyllabusRow) {
  editingTopic.value = {
    id: row.id,
    theme_id: row.theme_id,
    title: row.title,
    description: row.description,
    order: row.order
  }
  topicDefaultThemeId.value = 0
  isTopicModalOpen.value = true
}

function confirmDeleteTheme(row: SyllabusRow) {
  deleteTarget.value = { kind: 'theme', item: row }
  isDeleteModalOpen.value = true
}

function confirmDeleteTopic(row: SyllabusRow) {
  deleteTarget.value = { kind: 'topic', item: row }
  isDeleteModalOpen.value = true
}

async function executeDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    const { kind, item } = deleteTarget.value
    if (kind === 'theme') {
      await api(`/admin/academies/${props.academyId}/themes/${item.id}`, { method: 'DELETE' })
      expandedThemes.delete(item.id)
      toast.add({ title: 'Theme deleted', color: 'success' })
    } else {
      await api(`/admin/academies/${props.academyId}/topics/${item.id}`, { method: 'DELETE' })
      toast.add({ title: 'Topic deleted', color: 'success' })
    }
    await refresh()
    isDeleteModalOpen.value = false
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const columns: TableColumn<SyllabusRow>[] = [
  {
    id: 'expand',
    meta: { class: { th: 'w-px', td: 'w-px' } }
  },
  {
    accessorKey: 'order',
    header: 'Order',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  }
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        label="Add Theme"
        color="primary"
        leading-icon="i-ph-plus-bold"
        @click="openAddTheme"
      />
    </div>

    <div class="p-px overflow-x-auto">
      <UTable
        :data="flatData"
        :columns="columns"
        :meta="tableMeta"
        empty="No themes added yet. Click + Add Theme to get started."
        class="px-0 overflow-visible"
      >
        <template #expand-cell="{ row }">
          <UButton
            v-if="row.original._kind === 'theme'"
            :icon="
              expandedThemes.has(row.original.id) ? 'i-ph-caret-down-bold' : 'i-ph-caret-right-bold'
            "
            color="neutral"
            variant="ghost"
            size="xs"
            square
            @click="toggleTheme(row.original.id)"
          />
        </template>

        <template #order-cell="{ row }">
          <span class="text-sm text-muted">
            {{
              row.original._kind === 'topic'
                ? String.fromCharCode(96 + row.original.order)
                : row.original.order
            }}
          </span>
        </template>

        <template #title-cell="{ row }">
          <span
            :class="
              row.original._kind === 'theme'
                ? 'font-bold text-highlight text-sm'
                : 'text-sm text-muted'
            "
          >
            {{ row.original.title }}
          </span>
        </template>

        <template #description-cell="{ row }">
          <span class="text-sm text-muted">{{ row.original.description }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <template v-if="row.original._kind === 'theme'">
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                label="Add Topic"
                leading-icon="i-ph-plus-bold"
                @click="openAddTopic(row.original.id)"
              />
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                leading-icon="i-ph-pencil-simple-bold"
                label="Edit"
                @click="openEditTheme(row.original)"
              />
              <UButton
                size="sm"
                color="error"
                variant="outline"
                leading-icon="i-ph-trash-simple-bold"
                label="Delete"
                @click="confirmDeleteTheme(row.original)"
              />
            </template>
            <template v-else>
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                leading-icon="i-ph-pencil-simple-bold"
                label="Edit"
                @click="openEditTopic(row.original)"
              />
              <UButton
                size="sm"
                color="error"
                variant="outline"
                leading-icon="i-ph-trash-simple-bold"
                label="Delete"
                @click="confirmDeleteTopic(row.original)"
              />
            </template>
          </div>
        </template>
      </UTable>
    </div>
  </div>

  <AdminAcademyThemeModal
    v-model:open="isThemeModalOpen"
    :academy-id="academyId"
    :item="editingTheme"
    :next-order="themes.length + 1"
    @saved="onThemeSaved"
  />

  <AdminAcademyTopicModal
    v-model:open="isTopicModalOpen"
    :academy-id="academyId"
    :item="editingTopic"
    :themes="themeOptions"
    :default-theme-id="topicDefaultThemeId"
    :next-order="topicNextOrder"
    @saved="refresh"
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteModalOpen"
    :item-name="deleteItemName"
    :loading="isDeleting"
    @confirm="executeDelete"
  />
</template>
