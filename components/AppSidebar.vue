<script setup>
import NavUser from '@/components/NavUser.vue';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Blocks,
  AlertTriangle,
  Square,
  User,
  Badge,
  ChevronRight,
  Square as ButtonIcon,
  Calendar,
  CreditCard,
  CheckSquare,
  Terminal,
  MessageSquare,
  FormInput,
  Menu,
  MessageCircle,
  Sliders,
  Table2,
  Type,
  ToggleLeft,
  ChevronDown,
} from 'lucide-vue-next';

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: 'icon' },
  class: { type: null, required: false },
});

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Components',
      logo: Blocks,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Accordion',
      href: '#accordion',
      icon: ChevronDown,
    },
    {
      title: 'Alert',
      href: '#alert',
      icon: AlertTriangle,
    },
    {
      title: 'Alert Dialog',
      href: '#alert-dialog',
      icon: AlertTriangle,
    },
    {
      title: 'Aspect Ratio',
      href: '#aspect-ratio',
      icon: Square,
    },
    {
      title: 'Avatar',
      href: '#avatar',
      icon: User,
    },
    {
      title: 'Badge',
      href: '#badge',
      icon: Badge,
    },
    {
      title: 'Breadcrumb',
      href: '#breadcrumb',
      icon: ChevronRight,
    },
    {
      title: 'Button',
      href: '#button',
      icon: ButtonIcon,
    },
    {
      title: 'Calendar',
      href: '#calendar',
      icon: Calendar,
    },
    {
      title: 'Card',
      href: '#card',
      icon: CreditCard,
    },
    {
      title: 'Checkbox',
      href: '#checkbox',
      icon: CheckSquare,
    },
    {
      title: 'Command',
      href: '#command',
      icon: Terminal,
    },
    {
      title: 'Dialog',
      href: '#dialog',
      icon: MessageSquare,
    },
    {
      title: 'Dropdown Menu',
      href: '#dropdown-menu',
      icon: Menu,
    },
    {
      title: 'Input',
      href: '#input',
      icon: FormInput,
    },
    {
      title: 'Navigation Menu',
      href: '#navigation-menu',
      icon: Menu,
    },
    {
      title: 'Popover',
      href: '#popover',
      icon: MessageCircle,
    },
    {
      title: 'Select',
      href: '#select',
      icon: ChevronRight,
    },
    {
      title: 'Slider',
      href: '#slider',
      icon: Sliders,
    },
    {
      title: 'Table',
      href: '#table',
      icon: Table2,
    },
    {
      title: 'Tabs',
      href: '#tabs',
      icon: Square,
    },
    {
      title: 'Textarea',
      href: '#textarea',
      icon: Type,
    },
    {
      title: 'Toggle',
      href: '#toggle',
      icon: ToggleLeft,
    },
  ],
  projects: [],
};
</script>

<style>
:root {
  --header-height: 60px;
  --footer-height: 64px;
}

.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <div class="flex h-[60px] items-center px-6">
        <a href="/" class="flex items-center gap-2 font-semibold">
          <img src="/logo.png" alt="Logo" class="h-10 w-auto" />
        </a>
      </div>
    </SidebarHeader>
    <SidebarContent class="hide-scrollbar">
      <ScrollArea class="h-[calc(100vh-var(--header-height)-var(--footer-height))]">
        <div class="px-4">
          <SidebarGroup>
            <SidebarGroupLabel>Components</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
                  <SidebarMenuButton asChild>
                    <a :href="item.href">
                      <component :is="item.icon" class="h-4 w-4" />
                      <span>{{ item.title }}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </ScrollArea>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
