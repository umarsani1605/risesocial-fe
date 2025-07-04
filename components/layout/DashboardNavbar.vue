<template>
  <header class="fixed w-full top-0 z-50 bg-white transition-shadow duration-300 shadow-md">
    <div class="container-wrapper">
      <div class="flex gap-10 items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/dashboard" class="flex items-center">
            <NuxtImg src="/images/logo.png" alt="Rise Social" class="h-8 w-auto" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6 ml-auto">
          <NuxtLink
            v-for="item in dashboardNavigation"
            :key="item.name"
            :to="item.path"
            :class="[
              'text-sm font-medium transition-colors duration-200 py-4 ',
              isActiveRoute(item.path) ? 'font-semibold text-primary' : 'text-gray-500 hover:text-gray-600',
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Mobile menu button & User Profile -->
        <div class="flex items-center space-x-2 h-full py-3">
          <!-- User Profile Dropdown -->
          <DropdownMenu :modal="false">
            <DropdownMenuTrigger class="h-full" as-child>
              <Button variant="ghost" class="flex items-center space-x-2 p-2">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="user?.avatar" />
                  <AvatarFallback>{{ initials }}</AvatarFallback>
                </Avatar>
                <span class="hidden sm:block text-sm">{{ fullName }}</span>
                <Icon name="lucide:chevron-down" class="h-4 w-4 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48">
              <DropdownMenuItem @click="navigateTo('/profile')" class="cursor-pointer">
                <Icon name="lucide:user" class="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem @click="navigateTo('/settings')" class="cursor-pointer">
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
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white overflow-hidden">
        <div class="px-4 py-2 space-y-1">
          <NuxtLink
            v-for="item in dashboardNavigation"
            :key="item.name"
            :to="item.path"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200',
              isActiveRoute(item.path) ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const route = useRoute();
const { data: session, signOut } = useAuth();

// Reactive state
const mobileMenuOpen = ref(false);

// Computed properties
const user = computed(() => session.value?.user || null);
const fullName = computed(() => {
  if (!user.value) return 'User';
  return `${user.value.firstName} ${user.value.lastName}`.trim();
});
const initials = computed(() => {
  if (!user.value) return 'U';
  const first = user.value.firstName?.[0] || '';
  const last = user.value.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
});

// Dashboard navigation
const dashboardNavigation = [
  { name: 'Dashboard', path: '/dashboard', icon: 'lucide:layout-dashboard' },
  { name: 'Course', path: '/dashboard/course', icon: 'lucide:book' },
  { name: 'Jobs', path: '/dashboard/jobs', icon: 'lucide:briefcase' },
  { name: 'Programs', path: '/dashboard/programs', icon: 'lucide:school' },
];

// Helper functions
const isActiveRoute = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard';
  }
  return route.path.startsWith(path);
};

const handleLogout = async () => {
  mobileMenuOpen.value = false;
  await signOut();
  await navigateTo('/');
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
