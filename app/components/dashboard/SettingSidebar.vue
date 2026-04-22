<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const settingLinks: NavigationMenuItem[] = [
  { label: 'Account', icon: 'i-ph-user-duotone', to: '/dashboard/setting', exact: true },
  { label: 'Invoices', icon: 'i-ph-receipt-duotone', to: '/dashboard/setting/invoices' },
  { label: 'Notifications', icon: 'i-ph-bell-duotone', to: '/dashboard/setting/notifications' },
  { label: 'Security', icon: 'i-ph-lock-duotone', to: '/dashboard/setting/security' }
]
</script>

<template>
  <UCard class="min-h-[300px] border border-default/50" :ui="{ header: 'p-0!', body: 'p-0!' }">
    <div class="flex flex-col sm:flex-row gap-4">
      <aside class="w-full sm:w-64 border-r border-default/50 p-6">
        <UNavigationMenu
          :items="settingLinks"
          orientation="vertical"
          highlight-color="primary"
          :ui="{
            list: 'gap-1.5',
            link: 'rounded-lg text-sm'
          }"
        />
      </aside>
      <div class="flex-1 flex flex-col gap-4 p-6">
        <slot />
      </div>
    </div>
  </UCard>
</template>
