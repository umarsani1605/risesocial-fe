<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const { user, logout, fullName, initials } = useAuth()
const route = useRoute()

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Dashboard', icon: 'i-ph-squares-four-duotone', to: '/dashboard', active: route.path === '/dashboard' },
  { label: 'Academy', icon: 'i-ph-graduation-cap-duotone', to: '/dashboard/academy', active: route.path.startsWith('/dashboard/academy') },
  { label: 'Jobs', icon: 'i-ph-briefcase-duotone', to: '/dashboard/jobs', active: route.path.startsWith('/dashboard/jobs') },
  { label: 'Programs', icon: 'i-ph-rocket-launch-duotone', to: '/dashboard/programs', active: route.path.startsWith('/dashboard/programs') }
])

const userMenuItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Back to Home',
      icon: 'i-ph-house-duotone',
      to: '/'
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-ph-gear-duotone',
      to: '/dashboard/setting'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-ph-sign-out-duotone',
      onSelect: () => logout()
    }
  ]
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UHeader to="/dashboard" title="Rise Social" class="bg-white border-b border-default shadow-sm">
      <template #title>
        <NuxtImg src="/logo.png" width="78" height="32" alt="Rise Social" class="h-8 w-auto" />
      </template>

      <UNavigationMenu
        :items="navItems"
        variant="link"
        :ui="{
          list: 'gap-2',
          item: '[&_a]:relative [&_a]:inline-flex [&_a]:h-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2 [&_a]:text-sm [&_a]:font-medium [&_a]:text-default [&_a]:transition-colors [&_a[aria-current=page]]:text-primary! [&_a[aria-current=page]]:font-bold [&_a[aria-current=page]]:after:scale-x-100',
          link: 'hover:text-default! text-base'
        }"
      />

      <template #right>
        <div class="flex items-center gap-1">
          <UDropdownMenu :items="userMenuItems" :modal="false">
            <button
              class="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <UAvatar
                :src="user?.avatar ?? ''"
                :alt="fullName"
                :text="initials"
                size="sm"
                color="primary"
                class="bg-primary text-white text-sm rounded-full"
              />
              <span class="hidden sm:block text-sm font-medium">{{ fullName }}</span>
              <UIcon name="i-ph-caret-down-duotone" class="hidden sm:block size-4 text-muted" />
            </button>
          </UDropdownMenu>
        </div>
      </template>

      <template #body>
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          class="-mx-2.5 [&_a]:relative [&_a]:flex [&_a]:items-center [&_a]:px-4 [&_a]:py-3 [&_a]:rounded-lg [&_a]:text-base [&_a]:font-medium [&_a]:text-default [&_a]:transition-colors [&_a[aria-current=page]]:text-primary! [&_a[aria-current=page]]:font-bold [&_a[aria-current=page]]:bg-primary/5"
        />
      </template>
    </UHeader>

    <UMain
      :ui="{ base: 'min-h-[calc(100vh-var(--ui-header-height)-3.25rem)]' }"
      class="bg-slate-50 flex flex-col"
    >
      <UContainer class="pt-8 pb-4 flex-1 flex flex-col">
        <slot />
      </UContainer>
    </UMain>

    <UFooter class="bg-slate-50">
      <p class="text-muted text-sm">Copyright Rise Social © {{ new Date().getFullYear() }}</p>
    </UFooter>
  </div>
</template>
