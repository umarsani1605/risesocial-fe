<script setup>
import AppSidebar from '@/components/AppSidebar.vue';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
useHead({
  htmlAttrs: {
    class: 'admin-root',
  },
});

const { data: user, status, signOut } = useAuth();

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

const handleLogout = async () => {
  signOut({ callbackUrl: '/' });
};
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center justify-between gap-2 border-b pl-4 pr-6">
          <div class="flex gap-2 items-center justify-center">
            <SidebarTrigger />
            <div class="text-sm font-semibold">Admin</div>
          </div>
          <div v-if="user" class="flex items-center space-x-4 h-full py-4">
            <DropdownMenu :modal="false">
              <DropdownMenuTrigger class="h-full" as-child>
                <Button variant="ghost" class="flex items-center p-2 hover:bg-white/5">
                  <Avatar class="size-8">
                    <AvatarImage :src="user?.avatar" />
                    <AvatarFallback>{{ initials || 'U' }}</AvatarFallback>
                  </Avatar>
                  <span class="hidden sm:block text-sm">{{ fullName || 'User' }}</span>
                  <Icon name="lucide:chevron-down" class="size-4 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48">
                <DropdownMenuItem @click="navigateTo('/')" class="cursor-pointer">
                  <Icon name="lucide:home" class="size-4" />
                  <span>Back to Home</span>
                </DropdownMenuItem>
                <DropdownMenuItem v-if="user?.role === 'USER'" @click="navigateTo('/dashboard/setting')" class="cursor-pointer">
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
        </header>
        <main class="pl-10 pr-16 py-6 h-full overflow-hidden">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
