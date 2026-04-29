<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const route = useRoute()
const { user, isLoggedIn, isAdmin, logout, fullName, initials } = useAuth()

const items = computed(() => [
  { label: 'Home', to: '/', active: route.path === '/' },
  { label: 'Academy', to: '/academy', active: route.path.startsWith('/academy') },
  { label: 'Jobs', to: '/opportunities', active: route.path.startsWith('/opportunities') },
  { label: 'Programs', to: '/programs', active: route.path.startsWith('/programs') },
  { label: 'About Us', to: '/about-us', active: route.path.startsWith('/about-us') },
  { label: 'Contact Us', to: '/contact', active: route.path.startsWith('/contact') }
])

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: isAdmin.value ? 'Admin Panel' : 'Dashboard',
      icon: isAdmin.value ? 'i-ph-shield-bold' : 'i-ph-squares-four-bold',
      to: isAdmin.value ? '/admin' : '/dashboard'
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
])
</script>

<template>
  <UHeader
    to="/"
    class="bg-[#062d2c] border-transparent"
    :ui="{
      toggle: 'text-white hover:bg-white/10 hover:text-white',
      content: 'bg-[#062d2c]',
      body: 'bg-[#062d2c]',
    }"
  >
    <template #title>
      <NuxtImg src="/logo.png" width="78" height="32" alt="Rise Social" class="h-8 w-auto" />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{
        list: 'gap-2',
        item: '[&_a]:relative [&_a]:inline-flex [&_a]:h-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2 [&_a]:text-sm [&_a]:font-medium [&_a]:text-white [&_a]:hover:bg-white/5! [&_a]:transition-colors [&_a]:after:content-[\'\'] [&_a]:after:absolute [&_a]:after:bottom-0 [&_a]:after:left-1/4 [&_a]:after:w-1/2 [&_a]:after:h-[3px] [&_a]:after:bg-primary [&_a]:after:rounded-full [&_a]:after:scale-x-0 [&_a]:after:transition-transform [&_a]:after:duration-300 [&_a]:after:ease-in-out [&_a]:hover:after:scale-x-100 [&_a[aria-current=page]]:text-orange-400 [&_a[aria-current=page]]:after:scale-x-100',
        link: 'hover:text-white! text-base'
      }"
    />

    <template #right>
      <UDropdownMenu v-if="isLoggedIn" :items="userMenuItems" :modal="false">
        <button class="flex items-center gap-2 rounded-lg p-2 hover:bg-white/10 transition-colors">
          <UAvatar
            :src="user?.avatar"
            :alt="fullName"
            :text="initials"
            size="sm"
            color="primary"
            class="rounded-full"
          />
          <span class="text-sm font-medium text-white">{{ fullName }}</span>
          <UIcon name="i-ph-caret-down-bold" class="size-4 text-white/60" />
        </button>
      </UDropdownMenu>

      <UButton
        v-else
        label="Login"
        icon="i-ph-user-bold"
        color="neutral"
        variant="link"
        class="px-4 rounded-lg text-white hover:bg-white/5 hover:text-white active:text-white"
        @click="navigateTo('/login')"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5 [&_a]:relative [&_a]:flex [&_a]:items-center [&_a]:px-4 [&_a]:py-3 [&_a]:rounded-lg [&_a]:text-base [&_a]:font-medium [&_a]:text-white [&_a]:transition-colors [&_a]:hover:bg-white/10! [&_a[aria-current=page]]:text-orange-400! [&_a[aria-current=page]]:bg-white/5!"
      />

      <USeparator class="my-6 opacity-20" />

      <template v-if="isLoggedIn">
        <div class="flex items-center gap-3 px-4 py-2 mb-2">
          <UAvatar
            :src="user?.avatar"
            :alt="fullName"
            :text="initials"
            size="sm"
            color="primary"
            class="rounded-full"
          />
          <span class="text-sm font-medium text-white">{{ fullName }}</span>
        </div>
        <UButton
          :label="isAdmin ? 'Admin Panel' : 'Dashboard'"
          :icon="isAdmin ? 'i-ph-shield-bold' : 'i-ph-squares-four-bold'"
          color="neutral"
          variant="link"
          class="px-4 rounded-lg text-white hover:bg-white/5 hover:text-white active:text-white"
          :to="isAdmin ? '/admin' : '/dashboard'"
        />
        <UButton
          label="Logout"
          icon="i-ph-sign-out-bold"
          color="neutral"
          variant="link"
          class="px-4 rounded-lg text-white hover:bg-white/5 hover:text-white active:text-white"
          @click="logout()"
        />
      </template>

      <UButton
        v-else
        label="Login"
        icon="i-ph-user-bold"
        color="neutral"
        variant="link"
        class="px-4 rounded-lg text-white hover:bg-white/5 hover:text-white active:text-white"
        @click="navigateTo('/login')"
      />
    </template>
  </UHeader>
</template>
