<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Academy',
    to: '/academy',
    active: route.path.startsWith('/academy')
  },
  {
    label: 'Jobs',
    to: '/opportunities',
    active: route.path.startsWith('/opportunities')
  },
  {
    label: 'Programs',
    to: '/programs',
    active: route.path.startsWith('/programs')
  },
  {
    label: 'About Us',
    to: '/about-us',
    active: route.path.startsWith('/about-us')
  },
  {
    label: 'Contact Us',
    to: '/contact',
    active: route.path.startsWith('/contact')
  }
])
</script>

<template>
  <UHeader title="Rise Social" class="bg-[#062d2c] border-b-0">
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
      <UButton
        label="Login"
        icon="i-lucide-user"
        color="neutral"
        variant="ghost"
        class="px-4 rounded-lg text-white hover:bg-white/5 hover:text-white"
        @click="navigateTo('/login')"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5 [&_a]:relative [&_a]:flex [&_a]:items-center [&_a]:px-4 [&_a]:py-3 [&_a]:rounded-lg [&_a]:text-base [&_a]:font-medium [&_a]:text-white [&_a]:transition-colors [&_a]:hover:bg-white/10! [&_a[aria-current=page]]:text-orange-400 [&_a[aria-current=page]]:bg-white/5"
      />

      <USeparator class="my-6 opacity-20" />

      <UButton
        label="Login"
        icon="i-lucide-user"
        color="neutral"
        variant="ghost"
        class="px-4 rounded-lg text-white hover:bg-white/5 hover:text-white"
      />
    </template>
  </UHeader>
</template>
