<script setup lang="ts">
const route = useRoute()
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navigationMenus = computed(() => [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    isActive: route.path === '/'
  },
  {
    id: 'academy',
    name: 'Academy',
    path: '/academy',
    isActive: route.path.startsWith('/academy')
  },
  {
    id: 'opportunities',
    name: 'Jobs',
    path: '/opportunities',
    isActive: route.path.startsWith('/opportunities')
  },
  {
    id: 'programs',
    name: 'Programs',
    path: '/programs',
    isActive: route.path.startsWith('/programs')
  },
  {
    id: 'about-us',
    name: 'About Us',
    path: '/about-us',
    isActive: route.path.startsWith('/about-us')
  },
  {
    id: 'contact',
    name: 'Contact Us',
    path: '/contact',
    isActive: route.path.startsWith('/contact')
  }
])

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
  
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('header')) {
      mobileMenuOpen.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="relative">
    <header
      :class="[
        'fixed w-full top-0 z-50 bg-[#062d2c] transition-shadow duration-300',
        isScrolled ? 'shadow-md' : ''
      ]"
    >
      <div class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center">
              <NuxtImg
                src="/images/logo_white.png"
                width="78"
                height="32"
                alt="Rise Social"
                format="webp"
              />
            </NuxtLink>
          </div>

          <!-- Desktop Navigation Menu -->
          <nav class="hidden lg:block">
            <ul class="flex items-center space-x-1">
              <li v-for="menu in navigationMenus" :key="menu.id">
                <UButton
                  :to="menu.path"
                  variant="ghost"
                  :class="[
                    'text-white hover:bg-white/10 font-medium',
                    menu.isActive ? 'text-orange-400 bg-white/5' : ''
                  ]"
                >
                  {{ menu.name }}
                </UButton>
              </li>
            </ul>
          </nav>

          <!-- Desktop Auth Section -->
          <div class="hidden lg:flex items-center">
            <UButton
              variant="ghost"
              class="text-white hover:bg-white/5"
              icon="i-lucide-user"
            >
              Login / Register
            </UButton>
          </div>

          <!-- Mobile menu button -->
          <div class="lg:hidden flex items-center">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-lucide-menu"
              @click="toggleMobileMenu"
              class="text-white hover:bg-white/5"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 -translate-y-4"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="mobileMenuOpen"
          class="lg:hidden absolute top-full left-0 right-0 bg-secondary text-white backdrop-blur-sm shadow-lg z-40"
        >
          <div class="max-w-7xl mx-auto px-6 pt-4 pb-6">
            <!-- Mobile Navigation Links -->
            <nav class="space-y-1">
              <NuxtLink
                v-for="menu in navigationMenus"
                :key="menu.id"
                :to="menu.path"
                class="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
                :class="menu.isActive ? 'text-orange-400 bg-white/5' : 'text-white'"
                @click="mobileMenuOpen = false"
              >
                {{ menu.name }}
              </NuxtLink>
            </nav>

            <!-- Login/Register Button Mobile -->
            <div class="mt-4 pt-4 border-t border-white/10">
              <UButton
                color="primary"
                class="w-full"
                icon="i-lucide-user"
              >
                Login / Register
              </UButton>
            </div>
          </div>
        </div>
      </Transition>
    </header>
  </div>
</template>
