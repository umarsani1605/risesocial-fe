<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = withDefaults(
  defineProps<{
    variant?: 'dark' | 'light'
  }>(),
  { variant: 'dark' }
)

const route = useRoute()
const { user, isLoggedIn, isAdmin, logout, fullName, initials } = useAuth()

const isLight = computed(() => props.variant === 'light')

const headerClass = computed(() =>
  isLight.value ? 'bg-white border-b border-slate-200' : 'bg-[#062d2c] border-transparent'
)
const headerUi = computed(() =>
  isLight.value
    ? {
        toggle: 'text-slate-900 hover:bg-slate-100 hover:text-slate-900',
        content: 'bg-white divide-none h-fit',
        body: 'bg-white'
      }
    : {
        toggle: 'text-white hover:bg-white/10 hover:text-white',
        content: 'bg-[#062d2c] divide-none h-fit',
        body: 'bg-[#073635]'
      }
)
const navItemClass = computed(() =>
  isLight.value
    ? '[&_a]:relative [&_a]:inline-flex [&_a]:h-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2 [&_a]:text-sm [&_a]:font-medium [&_a]:text-slate-900 [&_a]:hover:bg-slate-100! [&_a]:transition-colors [&_a]:after:content-[\'\'] [&_a]:after:absolute [&_a]:after:bottom-0 [&_a]:after:left-1/4 [&_a]:after:w-1/2 [&_a]:after:h-[3px] [&_a]:after:bg-primary [&_a]:after:rounded-full [&_a]:after:scale-x-0 [&_a]:after:transition-transform [&_a]:after:duration-300 [&_a]:after:ease-in-out [&_a]:hover:after:scale-x-100 [&_a[aria-current=page]]:text-primary! [&_a[aria-current=page]]:hover:text-primary! [&_a[aria-current=page]]:after:scale-x-100'
    : '[&_a]:relative [&_a]:inline-flex [&_a]:h-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2 [&_a]:text-sm [&_a]:font-medium [&_a]:text-white [&_a]:hover:bg-white/5! [&_a]:transition-colors [&_a]:after:content-[\'\'] [&_a]:after:absolute [&_a]:after:bottom-0 [&_a]:after:left-1/4 [&_a]:after:w-1/2 [&_a]:after:h-[3px] [&_a]:after:bg-primary [&_a]:after:rounded-full [&_a]:after:scale-x-0 [&_a]:after:transition-transform [&_a]:after:duration-300 [&_a]:after:ease-in-out [&_a]:hover:after:scale-x-100 [&_a[aria-current=page]]:text-primary! [&_a[aria-current=page]]:hover:text-primary! [&_a[aria-current=page]]:after:scale-x-100'
)
const navLinkClass = computed(() =>
  isLight.value ? 'text-base hover:text-slate-900!' : 'text-base hover:text-white!'
)
const mobileNavLinkClass = computed(() =>
  isLight.value
    ? 'relative flex items-center px-4 py-3 rounded-lg text-base font-medium text-slate-900 transition-colors hover:before:bg-slate-100! hover:text-slate-900! data-[active]:before:bg-slate-100! data-[active]:text-primary! data-[active]:hover:text-primary!'
    : 'relative flex items-center px-4 py-3 rounded-lg text-base font-medium text-white transition-colors hover:before:bg-white/5! hover:text-white! data-[active]:before:bg-white/5! data-[active]:text-primary! data-[active]:hover:text-primary!'
)
const userButtonClass = computed(() =>
  isLight.value
    ? 'flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 transition-colors'
    : 'flex items-center gap-2 rounded-lg p-2 hover:bg-white/10 transition-colors'
)
const userNameClass = computed(() =>
  isLight.value ? 'text-sm font-medium text-slate-900' : 'text-sm font-medium text-white'
)
const userCaretClass = computed(() =>
  isLight.value ? 'size-4 text-slate-500' : 'size-4 text-white/60'
)
const loginButtonClass = computed(() =>
  isLight.value
    ? 'px-4 rounded-lg text-slate-900 hover:bg-slate-100 hover:text-slate-900 active:text-slate-900'
    : 'px-4 rounded-lg text-white hover:bg-white/5 hover:text-white active:text-white'
)

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
  <UHeader to="/" :class="headerClass" :ui="headerUi">
    <template #title>
      <NuxtImg src="/logo.png" width="78" height="32" alt="Rise Social" class="h-8 w-auto" />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{
        list: 'gap-2',
        item: navItemClass,
        link: navLinkClass
      }"
    />
    <template #right>
      <UDropdownMenu v-if="isLoggedIn" :items="userMenuItems" :modal="false">
        <button :class="userButtonClass">
          <UAvatar
            :src="user?.avatar"
            :alt="fullName"
            :text="initials"
            size="sm"
            color="primary"
            class="rounded-full"
          />
          <span :class="userNameClass">{{ fullName }}</span>
          <UIcon name="i-ph-caret-down-bold" :class="userCaretClass" />
        </button>
      </UDropdownMenu>

      <UButton
        v-else
        label="Login"
        icon="i-ph-user-bold"
        color="neutral"
        variant="link"
        :class="loginButtonClass"
        @click="navigateTo('/login')"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :ui="{
          link: mobileNavLinkClass
        }"
      />
    </template>
  </UHeader>
</template>
