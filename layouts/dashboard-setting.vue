<script setup>
import { Card, CardContent } from '@/components/ui/card';

const items = [
  { label: 'Account', icon: 'lucide:user', to: '/dashboard/setting' },
  { label: 'Notifications', icon: 'lucide:bell', to: '/dashboard/setting/notifications' },
  { label: 'Security', icon: 'lucide:lock', to: '/dashboard/setting/security' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <LayoutDashboardNavbar />

    <main class="flex-1 bg-slate-50 mt-16 md:mt-10">
      <div class="container-wrapper section-py-md">
        <Card class="border border-gray-50 min-h-[50rem]">
          <CardContent class="flex-1 flex flex-col">
            <div class="flex flex-col md:flex-row gap-6 flex-1">
              <aside class="w-full md:basis-1/4 md:max-w-[33%]">
                <nav class="space-y-1">
                  <h1 class="heading-card mb-6">Settings</h1>
                  <ul class="flex md:flex-col gap-2 overflow-auto">
                    <li v-for="item in items" :key="item.to" class="min-w-[12rem]">
                      <NuxtLink
                        :to="item.to"
                        class="w-full inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        :class="[$route.path === item.to ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200']"
                      >
                        <Icon :name="item.icon" class="h-4 w-4" />
                        <span>{{ item.label }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </nav>
              </aside>

              <Separator orientation="vertical" class="hidden md:block w-2 h-full mx-auto" />

              <section class="flex-1 w-full">
                <slot />
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>

    <LayoutDashboardFooter />
  </div>
</template>
