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

const programItems = [{ title: 'Rise Young Leaders', to: '/admin/rise-young-leaders', icon: Users2 }];

const managementItems = [
  { title: 'Dashboard', to: '/admin', icon: Home },
  { title: 'Jobs Management', to: '/admin/jobs', icon: BriefcaseBusiness },
  { title: 'Users Management', to: '/admin/users', icon: Users },
  { title: 'Administrators', to: '/admin/administrators', icon: UserCog },
];

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
              <SidebarMenuButton asChild :class="{ 'data-[active=true]': route.path === item.to }">
                <NuxtLink :to="item.to">
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
              <SidebarMenuButton asChild :class="{ 'data-[active=true]': route.path === item.to }">
                <NuxtLink :to="item.to">
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
