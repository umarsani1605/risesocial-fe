<script setup lang="ts" generic="T">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { ColumnPinningState, PaginationState } from '@tanstack/table-core'
import { PINNED_COLUMN_SHADOW_UI } from '@/constants/table'

const props = withDefaults(
  defineProps<{
    data: T[]
    columns: TableColumn<T>[]
    search?: string
    searchPlaceholder?: string
    searchClass?: string
    loading?: boolean
    tableUi?: Record<string, any>
    tableClass?: string
    pinnedShadow?: boolean
    columnPinning?: ColumnPinningState
  }>(),
  {
    search: undefined,
    searchPlaceholder: 'Search...',
    searchClass: 'w-full sm:w-64',
    loading: false,
    tableUi: undefined,
    tableClass: undefined,
    pinnedShadow: false,
    columnPinning: () => ({ right: ['actions'] })
  }
)

const emit = defineEmits<{
  'update:search': [value: string]
}>()

defineOptions({ inheritAttrs: false })

const table = useTemplateRef('table')

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })
const columnPinning = ref<ColumnPinningState>(props.columnPinning)
const paginationRowModel = getPaginationRowModel()

const mergedTableUi = computed(() => {
  const base = {
    tbody: '[&>tr]:hover:bg-elevated/50 [&>tr]:transition-colors',
    ...(props.pinnedShadow ? PINNED_COLUMN_SHADOW_UI : {})
  }
  return props.tableUi ? { ...base, ...props.tableUi } : base
})

const slots = useSlots()
const filteredSlots = computed(() =>
  Object.fromEntries(
    Object.entries(slots).filter(
      ([name]) => !['toolbar', 'toolbar-left', 'toolbar-right', 'footer'].includes(name)
    )
  )
)

defineExpose({
  tableApi: computed(() => (table.value as any)?.tableApi),
  pagination
})
</script>

<template>
  <AdminTableCard>
    <template #toolbar>
      <slot v-if="$slots.toolbar" name="toolbar" />
      <div v-else class="flex flex-wrap items-center justify-between">
        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <UInput
            v-if="search !== undefined"
            :model-value="search"
            icon="i-ph-magnifying-glass-bold"
            :placeholder="searchPlaceholder"
            :class="searchClass"
            @update:model-value="emit('update:search', String($event))"
          />
          <slot name="toolbar-left" />
        </div>
        <slot name="toolbar-right" />
      </div>
    </template>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:column-pinning="columnPinning"
      :pagination-options="{ getPaginationRowModel: paginationRowModel }"
      :data="data"
      :columns="columns"
      :loading="loading"
      :ui="mergedTableUi"
      :class="tableClass"
      v-bind="$attrs"
    >
      <template v-for="(_, name) in filteredSlots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </UTable>

    <template #footer>
      <slot v-if="$slots.footer" name="footer" :pagination="pagination" />
      <AdminTablePaginationFooter
        v-else
        :page-index="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :total="data.length"
        @update:page-index="(p) => (pagination = { ...pagination, pageIndex: p })"
        @update:page-size="(s) => (pagination = { ...pagination, pageSize: s, pageIndex: 0 })"
      />
    </template>
  </AdminTableCard>
</template>
