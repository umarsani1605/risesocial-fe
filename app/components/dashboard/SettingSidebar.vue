<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const settingLinks: NavigationMenuItem[] = [
  { label: 'Account', icon: 'i-lucide-user', to: '/dashboard/setting', exact: true },
  { label: 'Notifications', icon: 'i-lucide-bell', to: '/dashboard/setting/notifications' },
  { label: 'Security', icon: 'i-lucide-lock', to: '/dashboard/setting/security' }
]
</script>

<template>
  <div class="bg-white rounded-xl border border-default overflow-hidden">
    <div class="flex min-h-144">
      <aside class="w-56 shrink-0 border-r border-default p-4">
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
      <div class="flex-1 p-8">
        <slot />
      </div>
    </div>
  </div>
</template>
