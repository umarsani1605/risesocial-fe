<script setup>
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
const route = useRoute();

const { data: user, status, signOut } = useAuth();

const mobileMenuOpen = ref(false);

const fullName = computed(() => {
  if (!user.value) return 'User';
  return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim() || 'User';
});

const initials = computed(() => {
  if (!user.value) return 'U';
  const first = user.value.first_name?.[0] || '';
  const last = user.value.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
});

const dashboardNavigation = computed(() => [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'lucide:layout-dashboard',
    isActive: route.path === '/dashboard',
  },
  {
    id: 'academy',
    name: 'Academy',
    path: '/dashboard/academy',
    icon: 'lucide:book',
    isActive: route.path.startsWith('/dashboard/academy'),
  },
  {
    id: 'jobs',
    name: 'Jobs',
    path: '/dashboard/jobs',
    icon: 'lucide:briefcase',
    isActive: route.path.startsWith('/dashboard/jobs'),
  },
  {
    id: 'programs',
    name: 'Programs',
    path: '/dashboard/programs',
    icon: 'lucide:school',
    isActive: route.path.startsWith('/dashboard/programs'),
  },
]);

// Helper functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogout = async () => {
  signOut({ callbackUrl: '/' });
  mobileMenuOpen.value = false;
};

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  }
);

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('header')) {
      mobileMenuOpen.value = false;
    }
  };

  document.addEventListener('click', handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>
<template>
  <header class="fixed w-full top-0 z-50 bg-white transition-shadow duration-300 shadow-sm">
    <div class="container-wrapper">
      <div class="flex gap-5 items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/dashboard" class="flex items-center">
            <NuxtImg src="/images/logo.png" alt="Rise Social" class="h-8 w-auto" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem v-for="menu in dashboardNavigation" :key="menu.id">
                <NuxtLink
                  :to="menu.path"
                  :class="[
                    navigationMenuTriggerStyle({ active: menu.isActive, dark: false }),
                    'after:h-[3px]! px-3! data-[state=open]:text-primary!',
                  ]"
                >
                  {{ menu.name }}
                </NuxtLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <!-- Desktop User Profile -->
        <div class="hidden lg:flex items-center space-x-4 h-full py-4">
          <!-- User Profile Dropdown -->
          <DropdownMenu :modal="false">
            <DropdownMenuTrigger class="h-full" as-child>
              <Button variant="ghost" class="flex items-center p-2">
                <Avatar class="size-8">
                  <AvatarImage :src="user?.avatar" />
                  <AvatarFallback>{{ initials || 'U' }}</AvatarFallback>
                </Avatar>
                <span class="hidden sm:block text-sm">{{ fullName || 'User' }}</span>
                <Icon name="lucide:chevron-down" class="h-4 w-4 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48">
              <DropdownMenuItem @click="navigateTo('/dashboard/setting')" class="cursor-pointer">
                <Icon name="lucide:settings" class="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="navigateTo('/')" class="cursor-pointer">
                <Icon name="lucide:home" class="mr-2 h-4 w-4" />
                Back to Home
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-600">
                <Icon name="lucide:log-out" class="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <!-- Mobile menu button & User Profile -->
        <div class="lg:hidden flex items-center space-x-2">
          <!-- User Profile Dropdown (Mobile) -->
          <div class="flex items-center">
            <DropdownMenu :modal="false">
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="rounded-full p-1">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="user?.avatar" />
                    <AvatarFallback class="text-sm">{{ initials }}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48 dropdown-right-aligned">
                <DropdownMenuItem @click="navigateTo('/dashboard/setting')" class="cursor-pointer">
                  <Icon name="lucide:settings" class="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="navigateTo('/')" class="cursor-pointer">
                  <Icon name="lucide:home" class="mr-2 h-4 w-4" />
                  Back to Home
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
            <Icon name="lucide:menu" class="size-6" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <Transition
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-white backdrop-blur-sm shadow-lg z-40">
        <div class="container-wrapper py-4">
          <!-- Mobile Navigation Links -->
          <nav class="space-y-1">
            <NuxtLink
              v-for="menu in dashboardNavigation"
              :key="menu.id"
              :to="menu.path"
              class="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-gray-50"
              :class="menu.isActive ? 'text-primary bg-gray-100 font-bold' : 'text-gray-700'"
              @click="mobileMenuOpen = false"
            >
              {{ menu.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Custom dropdown positioning untuk profile menu */
:deep(.dropdown-right-aligned) {
  --reka-dropdown-menu-content-transform-origin: 90% 0px !important;
  --reka-popper-transform-origin: 90% 0px !important;
}
</style>
