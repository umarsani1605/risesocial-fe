<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Email Broadcast',
  middleware: ['auth', 'admin', 'admin-permission'],
  requiredPermission: 'admin.broadcast'
})

useSeoMeta({ title: 'Email Broadcast - Rise Social' })

const activeTab = ref('compose')
const historyReloadToken = ref(0)

const tabItems = [
  { label: 'Broadcast', value: 'compose', slot: 'compose', icon: 'i-ph-megaphone-duotone' },
  { label: 'History', value: 'history', slot: 'history', icon: 'i-ph-clock-counter-clockwise-duotone' }
]

function onSent() {
  activeTab.value = 'history'
  historyReloadToken.value++
}
</script>

<template>
  <UTabs
    v-model="activeTab"
    :items="tabItems"
    variant="link"
    color="primary"
    :unmount-on-hide="false"
    :ui="{
      root: 'flex-1 min-h-0 gap-6',
      list: 'p-0! shrink-0',
      content: 'flex-1 min-h-0',
      trigger: 'px-3 sm:px-6 whitespace-nowrap'
    }"
  >
    <template #compose>
      <AdminBroadcastTabCompose @sent="onSent" />
    </template>
    <template #history>
      <AdminBroadcastTabHistory :reload-token="historyReloadToken" />
    </template>
  </UTabs>
</template>
