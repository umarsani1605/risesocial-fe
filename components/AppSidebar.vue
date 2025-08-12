<script setup>
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

import { useRoute } from 'vue-router';
import { NuxtLink } from '#components';

import { Home, Users, BriefcaseBusiness, UserCog, Users2 } from 'lucide-vue-next';

const route = useRoute();

const programItems = computed(() => [
  {
    title: 'Rise Young Leaders',
    to: '/admin/rise-young-leaders',
    icon: Users2,
    isActive: route.path.startsWith('/admin/rise-young-leaders'),
  },
]);

const managementItems = computed(() => [
  {
    title: 'Dashboard',
    to: '/admin',
    icon: Home,
    isActive: route.path === '/admin',
  },
  {
    title: 'Jobs Management',
    to: '/admin/jobs',
    icon: BriefcaseBusiness,
    isActive: route.path === '/admin/jobs',
  },
  {
    title: 'Users Management',
    to: '/admin/users',
    icon: Users,
    isActive: route.path === '/admin/users',
  },
]);

const user = {
  name: 'Admin',
  email: 'admin@example.com',
};
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex w-full h-14 items-center px-4">
        <NuxtLink to="/admin" class="flex items-center gap-2 font-semibold mx-auto">
          <NuxtImg src="/images/logo_admin.png" alt="Logo" class="h-8 w-auto" format="webp" />
        </NuxtLink>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in managementItems" :key="item.to">
              <SidebarMenuButton asChild class="transition-all duration-200" :class="item.isActive ? 'bg-primary/10! text-orange-500!' : ''">
                <NuxtLink :to="item.to" class="flex items-center gap-2 w-full">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Programs</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in programItems" :key="item.to">
              <SidebarMenuButton asChild :class="item.isActive ? 'bg-primary/10! text-orange-500!' : ''">
                <NuxtLink :to="item.to" class="flex items-center gap-2 w-full">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <div class="text-center text-xs text-gray-500">Rise Social © 2025</div>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
