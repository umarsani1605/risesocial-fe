<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const route = useRoute()

const open = ref(false)

const { user, logout, fullName, initials } = useAuth()

const menuItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Back to Home',
      icon: 'i-lucide-home',
      to: '/'
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/dashboard/setting'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => logout()
    }
  ]
]

const mainLinks = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/admin',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const analyticsLinks = [
  {
    label: 'Revenue',
    icon: 'i-ph-chart-line-duotone',
    to: '/admin/analytics/revenue',
    onSelect: () => { open.value = false }
  },
  {
    label: 'Users',
    icon: 'i-ph-users-three-duotone',
    to: '/admin/analytics/users',
    onSelect: () => { open.value = false }
  },
  {
    label: 'Academies',
    icon: 'i-ph-graduation-cap-duotone',
    to: '/admin/analytics/academies',
    onSelect: () => { open.value = false }
  },
  {
    label: 'Programs',
    icon: 'i-ph-medal-duotone',
    to: '/admin/analytics/programs',
    onSelect: () => { open.value = false }
  }
] satisfies NavigationMenuItem[]

const academyLinks = [
  {
    label: 'All Academy',
    icon: 'i-lucide-graduation-cap',
    to: '/admin/academies',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Cohorts',
    icon: 'i-lucide-layout-list',
    to: '/admin/cohorts',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const financeLinks = [
  {
    label: 'Transactions',
    icon: 'i-lucide-receipt',
    to: '/admin/transactions',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const userLinks = [
  {
    label: 'All Users',
    icon: 'i-lucide-users',
    to: '/admin/users',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Administrator',
    icon: 'i-lucide-shield',
    to: '/admin/administrators',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const jobLinks = [
  {
    label: 'All Jobs',
    icon: 'i-lucide-briefcase',
    to: '/admin/jobs',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const programLinks = [
  {
    label: 'Rise Young Leaders',
    icon: 'i-lucide-medal',
    to: '/admin/programs',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-white"
      :ui="{ header: 'border-b border-default h-18!', footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center h-14 w-full" :class="collapsed ? 'justify-center' : 'px-1'">
          <NuxtLink to="/admin" class="flex items-center justify-center w-full">
            <NuxtImg
              src="/images/logo_admin.png"
              alt="Rise Social"
              class="h-8 w-auto"
              :class="collapsed ? 'hidden' : 'block'"
            />
            <UIcon v-if="collapsed" name="i-lucide-layers" class="size-7 text-primary" />
          </NuxtLink>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="mainLinks" orientation="vertical" tooltip />
        <p
          v-if="!collapsed"
          class="px-2.5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Analytics
        </p>
        <div v-else class="mt-3" />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="analyticsLinks"
          orientation="vertical"
          tooltip
        />
        <p
          v-if="!collapsed"
          class="px-2.5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Academy
        </p>
        <div v-else class="mt-3" />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="academyLinks"
          orientation="vertical"
          tooltip
        />

        <p
          v-if="!collapsed"
          class="px-2.5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Finance
        </p>
        <div v-else class="mt-3" />
        <UNavigationMenu :collapsed="collapsed" :items="financeLinks" orientation="vertical" tooltip />

        <p
          v-if="!collapsed"
          class="px-2.5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Users
        </p>
        <div v-else class="mt-3" />
        <UNavigationMenu :collapsed="collapsed" :items="userLinks" orientation="vertical" tooltip />

        <p
          v-if="!collapsed"
          class="px-2.5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Jobs
        </p>
        <div v-else class="mt-3" />
        <UNavigationMenu :collapsed="collapsed" :items="jobLinks" orientation="vertical" tooltip />

        <p
          v-if="!collapsed"
          class="px-2.5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Programs
        </p>
        <div v-else class="mt-3" />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="programLinks"
          orientation="vertical"
          tooltip
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel
      v-if="!route.meta.noDashboardPanel"
      id="main"
      :ui="{
        body: 'bg-slate-50 p-2 sm:p-5'
      }"
    >
      <template #header>
        <UDashboardNavbar
          :title="(route.meta.navbarTitle as string) || ''"
          :icon="(route.meta.navbarIcon as string) || undefined"
          :ui="{ right: 'gap-3' }"
          class="bg-white h-18!"
        >
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <UDropdownMenu :items="menuItems" :modal="false">
              <button
                class="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <UAvatar
                  :src="user?.avatar"
                  :alt="fullName"
                  :text="initials"
                  size="sm"
                  color="primary"
                  class="rounded-full"
                />
                <span class="hidden sm:block text-sm font-medium">{{ fullName }}</span>
                <UIcon name="i-lucide-chevron-down" class="hidden sm:block size-4 text-muted" />
              </button>
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>

    <template v-else>
      <slot />
    </template>

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
