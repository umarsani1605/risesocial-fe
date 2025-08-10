<script setup>
import { ref, watch, computed } from 'vue';
import { FlexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 10 },
  totalPages: { type: Number, default: 1 },
  search: { type: String, default: '' },
  role: { type: String, default: '' },
});

const emit = defineEmits(['update:page', 'update:limit', 'update:search', 'update:role', 'create']);

const sorting = ref([]);
const table = useVueTable({
  data: props.data,
  columns: props.columns,
  state: { sorting: sorting.value },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

watch(
  () => props.data,
  () => {
    table.setOptions((prev) => ({ ...prev, data: props.data }));
  }
);

const pageSizes = [10, 20, 30, 50];

const onPrev = () => emit('update:page', Math.max(1, props.page - 1));
const onNext = () => emit('update:page', Math.min(props.totalPages, props.page + 1));

const onSelectLimit = (v) => emit('update:limit', Number(v));
const onSearch = (e) => emit('update:search', e.target.value);
const onSelectRole = (v) => emit('update:role', v);
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto">
        <Input class="w-full sm:w-64" placeholder="Search name/email/username" :value="search" @input="onSearch" />
        <Select :model-value="role" @update:model-value="onSelectRole">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex justify-end">
        <Button @click="emit('create')">New User</Button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <table class="w-full text-sm">
        <thead>
          <tr class="h-10 text-left">
            <th v-for="header in table.getHeaderGroups()[0].headers" :key="header.id" class="px-3">
              <div
                v-if="!header.isPlaceholder"
                class="select-none cursor-pointer inline-flex items-center gap-1"
                @click="header.column.getCanSort() && header.column.toggleSorting()"
              >
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                <span class="text-muted-foreground">
                  <template v-if="header.column.getIsSorted() === 'asc'">▲</template>
                  <template v-else-if="header.column.getIsSorted() === 'desc'">▼</template>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="border-t">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-3 py-2">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td :colspan="table.getAllColumns().length" class="text-center py-6 text-muted-foreground">No data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-2">
        <span class="text-sm">Rows per page</span>
        <Select :model-value="String(limit)" @update:model-value="onSelectLimit">
          <SelectTrigger class="h-8 w-[80px]">
            <SelectValue :placeholder="String(limit)" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="s in pageSizes" :key="s" :value="String(s)">{{ s }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="h-8 px-2" :disabled="page <= 1" @click="onPrev">Prev</Button>
        <span class="text-sm">Page {{ page }} of {{ totalPages }}</span>
        <Button variant="outline" class="h-8 px-2" :disabled="page >= totalPages" @click="onNext">Next</Button>
      </div>
    </div>
  </div>
</template>
