<script setup lang="ts">
const props = defineProps<{
  pageIndex: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  'update:page-index': [value: number]
  'update:page-size': [value: number]
}>()

const start = computed(() => (props.total === 0 ? 0 : props.pageIndex * props.pageSize + 1))
const end = computed(() => Math.min((props.pageIndex + 1) * props.pageSize, props.total))
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col items-center gap-3 sm:hidden">
      <UPagination
        :page="pageIndex + 1"
        :items-per-page="pageSize"
        :total="total"
        size="sm"
        variant="ghost"
        @update:page="(p: number) => emit('update:page-index', p - 1)"
      />
      <div class="flex items-center gap-4">
        <USelect
          :model-value="pageSize"
          :items="[10, 25, 50, 100]"
          size="sm"
          class="w-20"
          @update:model-value="
            (val: number) => {
              emit('update:page-size', Number(val))
              emit('update:page-index', 0)
            }
          "
        />
        <p class="text-sm text-muted shrink-0">
          Showing {{ start }} to {{ end }} of {{ total }} entries
        </p>
      </div>
    </div>

    <div class="hidden items-center justify-between gap-3 sm:flex">
      <div class="flex items-center gap-4">
        <USelect
          :model-value="pageSize"
          :items="[10, 25, 50, 100]"
          size="sm"
          class="w-20"
          @update:model-value="
            (val: number) => {
              emit('update:page-size', Number(val))
              emit('update:page-index', 0)
            }
          "
        />
        <p class="text-sm text-muted shrink-0">
          Showing {{ start }} to {{ end }} of {{ total }} entries
        </p>
      </div>
      <UPagination
        :page="pageIndex + 1"
        :items-per-page="pageSize"
        :total="total"
        size="sm"
        variant="ghost"
        @update:page="(p: number) => emit('update:page-index', p - 1)"
      />
    </div>
  </div>
</template>
