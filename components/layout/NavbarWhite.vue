<script setup>
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoginRegisterDialog from '@/components/auth/LoginRegisterDialog.vue';
import { useAuthStore } from '@/store/auth';

const route = useRoute();

// Auth store
const authStore = useAuthStore();
const isInitialized = ref(false);

// Initialize auth state
onMounted(async () => {
  if (!authStore.isInitialized) {
    await authStore.initAuth();
  }
  isInitialized.value = true;
  // sleep 5 sec
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('Auth initialized:', authStore.user);
});

// Computed properties for user data with null checks
const isAuthenticated = computed(() => authStore.isLoggedIn);
const fullName = computed(() => {
  if (!isInitialized.value) return 'Loading...';
  return authStore.user?.fullName || 'User';
});

const initials = computed(() => {
  if (!isInitialized.value || !authStore.user) return 'U';
  return authStore.initials || 'U';
});

// Watch for auth changes for debugging
watch(
  () => authStore.user,
  (newVal) => {
    console.log('Auth user changed:', newVal);
  },
  { immediate: true, deep: true }
);

const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const showLoginDialog = ref(false);

const navigationMenus = computed(() => [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    isActive: route.path === '/',
  },
  {
    id: 'bootcamp',
    name: 'Bootcamp',
    path: '/bootcamp',
    isActive: route.path.startsWith('/bootcamp'),
  },
  {
    id: 'opportunities',
    name: 'Jobs',
    path: '/opportunities',
    isActive: route.path.startsWith('/opportunities'),
  },
  {
    id: 'programs',
    name: 'Programs',
    path: '/programs',
    isActive: route.path.startsWith('/programs'),
  },
  {
    id: 'about-us',
    name: 'About Us',
    path: '/about-us',
    isActive: route.path.startsWith('/about-us'),
  },
  {
    id: 'contact',
    name: 'Contact Us',
    path: '/contact',
    isActive: route.path.startsWith('/contact'),
  },
]);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const openLoginDialog = () => {
  showLoginDialog.value = true;
  mobileMenuOpen.value = false; // Close mobile menu when opening dialog
};

const handleLogout = async () => {
  await authStore.signOut();
  mobileMenuOpen.value = false;
  await navigateTo('/');
};

// Handle scroll detection
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

// Watch for route changes to close mobile menu
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  }
);

// Setup event listeners
onMounted(() => {
  // Click outside handler
  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      mobileMenuOpen.value = false;
    }
  });

  // Scroll handler
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
  console.log('Navbar mounted');
  console.log('User: ' + authStore.user);
});

// Clean up scroll listener
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="relative">
    <header
      :class="[
        'fixed w-full top-0 z-50 bg-white shadow-subtle lg:shadow-none lg:bg-transparent transition-all duration-300',
        isScrolled ? 'lg:bg-white lg:shadow-subtle' : '',
      ]"
    >
      <div class="container-wrapper">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center">
              <NuxtImg src="/images/logo.png" alt="Rise Social" class="h-8 w-auto" loading="eager" format="webp" />
            </NuxtLink>
          </div>

          <!-- Desktop Navigation Menu -->
          <nav class="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem v-for="menu in navigationMenus" :key="menu.id">
                  <NuxtLink
                    :to="menu.path"
                    :class="
                      navigationMenuTriggerStyle({ active: menu.isActive, dark: false }) +
                      ' text-gray-900 hover:text-primary data-[active]:text-primary'
                    "
                    >{{ menu.name }}</NuxtLink
                  >
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <!-- Desktop Auth Section -->
          <div class="relative hidden lg:flex items-center">
            <!-- Authenticated User -->
            <div v-if="isAuthenticated" class="flex items-center space-x-4 h-full py-4">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger class="h-full" as-child>
                  <Button variant="ghost" class="text-gray-700 hover:bg-gray-100">
                    <Avatar class="size-8">
                      <AvatarImage :src="authStore.user?.avatar" />
                      <AvatarFallback>{{ authStore.initials || 'U' }}</AvatarFallback>
                    </Avatar>
                    <span class="hidden sm:block text-sm">{{ authStore.fullName || 'User' }}</span>
                    <Icon name="lucide:chevron-down" class="size-4 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48 bg-white">
                  <DropdownMenuItem @click="navigateTo('/dashboard')" class="cursor-pointer">
                    <Icon name="lucide:layout-dashboard" class="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="navigateTo('#')" class="cursor-pointer">
                    <Icon name="lucide:settings" class="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-600">
                    <Icon name="lucide:log-out" class="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <!-- Not Authenticated -->
            <Button v-else @click="openLoginDialog">
              <Icon name="lucide:user" class="size-4!" />
              Login / Register
            </Button>
          </div>

          <!-- Mobile menu button & User Avatar -->
          <div class="lg:hidden flex items-center space-x-2">
            <!-- User Avatar Dropdown (Mobile) -->
            <div v-if="isAuthenticated" class="flex items-center">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="rounded-full p-1">
                    <Avatar class="h-8 w-8">
                      <AvatarImage :src="authStore.user?.avatar" />
                      <AvatarFallback class="text-white text-sm">{{ initials }}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48 bg-white">
                  <DropdownMenuItem @click="navigateTo('/dashboard')" class="cursor-pointer">
                    <Icon name="lucide:layout-dashboard" class="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="navigateTo('#')" class="cursor-pointer">
                    <Icon name="lucide:user" class="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-600">
                    <Icon name="lucide:log-out" class="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <!-- Hamburger Menu Button -->
            <Button variant="ghost" size="icon" @click="toggleMobileMenu">
              <Icon name="lucide:menu" class="size-6! text-gray-700!" />
            </Button>
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
        <div v-if="mobileMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-white text-gray-700 backdrop-blur-sm shadow-lg z-40">
          <div class="container-wrapper pt-4 pb-6">
            <!-- Mobile Navigation Links -->
            <nav class="space-y-1">
              <NuxtLink
                v-for="menu in navigationMenus"
                :key="menu.id"
                :to="menu.path"
                class="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-gray-50"
                :class="menu.isActive ? 'text-orange-400 bg-gray-100' : 'text-gray-700'"
                @click="mobileMenuOpen = false"
              >
                {{ menu.name }}
              </NuxtLink>
            </nav>

            <!-- Login/Register Button for Non-Authenticated Users -->
            <div v-if="!isAuthenticated" class="mt-4 pt-4 border-t border-gray-100">
              <Button @click="openLoginDialog" class="bg-primary! hover:bg-primary/90! text-white w-full!">
                <Icon name="lucide:user" class="size-4!" />
                Login / Register
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Login/Register Dialog -->
    <LoginRegisterDialog :open="showLoginDialog" @update:open="showLoginDialog = $event" />
  </div>
</template>
<style scoped>
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
