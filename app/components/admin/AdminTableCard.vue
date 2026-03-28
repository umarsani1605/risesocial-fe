<template>
  <AdminCard :ui="{ root: 'overflow-scroll' }">
    <template v-if="$slots.toolbar" #header>
      <slot name="toolbar" />
    </template>
    <div class="overflow-x-auto">
      <slot />
    </div>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </AdminCard>
</template>
