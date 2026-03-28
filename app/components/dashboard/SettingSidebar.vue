<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const settingLinks: NavigationMenuItem[] = [
  { label: 'Account', icon: 'i-ph-user-duotone', to: '/dashboard/setting', exact: true },
  { label: 'Notifications', icon: 'i-ph-bell-duotone', to: '/dashboard/setting/notifications' },
  { label: 'Security', icon: 'i-ph-lock-duotone', to: '/dashboard/setting/security' },
  { label: 'Invoices', icon: 'i-ph-receipt-duotone', to: '/dashboard/setting/invoices' }
]
</script>

<template>
  <div class="bg-white rounded-xl border border-default overflow-hidden">
    <div class="flex flex-col sm:flex-row sm:min-h-144">
      <aside class="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-default p-4">
        <p class="text-base font-bold mb-4 px-2">Settings</p>
        <UNavigationMenu
          :items="settingLinks"
          orientation="vertical"
          highlight-color="primary"
          :ui="{
            list: 'gap-0.5',
            link: 'rounded-lg text-sm'
          }"
        />
      </aside>
      <div class="flex-1 p-4 sm:p-8">
        <slot />
      </div>
    </div>
  </div>
</template>
