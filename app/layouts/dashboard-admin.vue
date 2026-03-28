<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const route = useRoute()

const open = ref(false)

const { user, logout, fullName, initials } = useAuth()

const menuItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Back to Home',
      icon: 'i-ph-house-bold',
      to: '/'
    }
  ],
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

const mainLinks = [
  {
    label: 'Dashboard',
    icon: 'i-ph-squares-four-duotone',
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
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Users',
    icon: 'i-ph-users-three-duotone',
    to: '/admin/analytics/users',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Academies',
    icon: 'i-ph-graduation-cap-duotone',
    to: '/admin/analytics/academies',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Programs',
    icon: 'i-ph-medal-duotone',
    to: '/admin/analytics/programs',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const academyLinks = [
  {
    label: 'All Academy',
    icon: 'i-ph-graduation-cap-duotone',
    to: '/admin/academies',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Cohorts',
    icon: 'i-ph-list-dashes-duotone',
    to: '/admin/cohorts',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const financeLinks = [
  {
    label: 'Transactions',
    icon: 'i-ph-receipt-duotone',
    to: '/admin/transactions',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const userLinks = [
  {
    label: 'All Users',
    icon: 'i-ph-users-duotone',
    to: '/admin/users',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Administrator',
    icon: 'i-ph-shield-duotone',
    to: '/admin/administrators',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const jobLinks = [
  {
    label: 'All Jobs',
    icon: 'i-ph-briefcase-duotone',
    to: '/admin/jobs',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]

const programLinks = [
  {
    label: 'Rise Young Leaders',
    icon: 'i-ph-medal-duotone',
    to: '/admin/programs',
    onSelect: () => {
      open.value = false
    }
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UDashboardGroup unit="%">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      resizable
      collapsible
      :default-size="14"
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
            <NuxtImg
              v-if="collapsed"
              src="/images/logo_small.png"
              alt="Rise Social"
              class="h-8 w-auto"
            />
          </NuxtLink>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="mainLinks" orientation="vertical" tooltip />
        <div>
          <p v-if="!collapsed" class="px-2.5 mb-2 font-medium text-xs text-dimmed tracking-wider">
            Academy
          </p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="academyLinks"
            orientation="vertical"
            tooltip
          />
        </div>

        <div>
          <p v-if="!collapsed" class="px-2.5 mb-2 font-medium text-xs text-dimmed tracking-wider">
            Finance
          </p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="financeLinks"
            orientation="vertical"
            tooltip
          />
        </div>

        <div>
          <p v-if="!collapsed" class="px-2.5 mb-2 font-medium text-xs text-dimmed tracking-wider">
            Users
          </p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="userLinks"
            orientation="vertical"
            tooltip
          />
        </div>

        <div>
          <p v-if="!collapsed" class="px-2.5 mb-2 font-medium text-xs text-dimmed tracking-wider">
            Jobs
          </p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="jobLinks"
            orientation="vertical"
            tooltip
          />
        </div>

        <div>
          <p v-if="!collapsed" class="px-2.5 mb-2 font-medium text-xs text-dimmed tracking-wider">
            Programs
          </p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="programLinks"
            orientation="vertical"
            tooltip
          />
        </div>

        <div>
          <p v-if="!collapsed" class="px-2.5 mb-2 font-medium text-xs text-dimmed tracking-wider">
            Statistics
          </p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="analyticsLinks"
            orientation="vertical"
            tooltip
          />
        </div>
      </template>

      <template #footer="{ collapsed }">
        <UDashboardSidebarCollapse
          icon="i-ph-sidebar-simple-bold"
          :label="collapsed ? '' : 'Collapse'"
          :ui="{
            base: 'text-dimmed'
          }"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel
      v-if="!route.meta.noDashboardPanel"
      id="main"
      :ui="{
        body: 'p-2 sm:p-5'
      }"
    >
      <template #header>
        <UDashboardNavbar
          :title="(route.meta.navbarTitle as string) || ''"
          :icon="(route.meta.navbarIcon as string) || undefined"
          :ui="{ right: 'gap-3' }"
          class="bg-white h-18!"
        >
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
                <UIcon name="i-ph-caret-down-duotone" class="hidden sm:block size-4 text-muted" />
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
