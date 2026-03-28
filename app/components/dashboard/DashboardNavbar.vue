<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const { user, logout, fullName, initials } = useAuth()

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Dashboard', to: '/dashboard', exact: true },
  { label: 'Academy', to: '/dashboard/academy' },
  { label: 'Jobs', to: '/dashboard/jobs' },
  { label: 'Programs', to: '/dashboard/programs' }
])

const userMenuItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Settings',
      icon: 'i-ph-gear-bold',
      to: '/dashboard/setting'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-ph-sign-out-bold',
      onSelect: () => logout()
    }
  ]
]
</script>

<template>
  <UHeader title="Rise Social" class="bg-white border-b border-default">
    <template #title>
      <NuxtImg src="/logo.png" width="78" height="32" alt="Rise Social" class="h-8 w-auto" />
    </template>

    <UNavigationMenu
      :items="navItems"
      variant="link"
      :ui="{
        list: 'gap-2',
        item: '[&_a]:relative [&_a]:inline-flex [&_a]:h-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2 [&_a]:text-sm [&_a]:font-medium [&_a]:text-default [&_a]:hover:bg-white/5! [&_a]:transition-colors [&_a]:after:content-[\'\'] [&_a]:after:absolute [&_a]:after:bottom-0 [&_a]:after:left-1/4 [&_a]:after:w-1/2 [&_a]:after:h-[3px] [&_a]:after:bg-primary [&_a]:after:rounded-full [&_a]:after:scale-x-0 [&_a]:after:transition-transform [&_a]:after:duration-300 [&_a]:after:ease-in-out [&_a]:hover:after:scale-x-100 [&_a[aria-current=page]]:text-orange-400 [&_a[aria-current=page]]:after:scale-x-100',
        link: 'hover:text-default! text-base'
      }"
    />

    <template #body>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        class="-mx-2.5 [&_a]:relative [&_a]:flex [&_a]:items-center [&_a]:px-4 [&_a]:py-3 [&_a]:rounded-lg [&_a]:text-base [&_a]:font-medium [&_a]:text-default [&_a]:transition-colors [&_a]:hover:bg-white/10! [&_a[aria-current=page]]:text-orange-400 [&_a[aria-current=page]]:bg-white/5"
      />
    </template>

    <template #right>
      <UDropdownMenu :items="userMenuItems" :modal="false">
        <button
          class="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition-colors"
        >
          <UAvatar :src="user?.avatar" :alt="fullName" :text="initials" size="sm" color="primary" />
          <span class="text-sm font-medium hidden sm:block">{{ fullName }}</span>
          <UIcon name="i-ph-caret-down-bold" class="size-4 text-muted hidden sm:block" />
        </button>
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
