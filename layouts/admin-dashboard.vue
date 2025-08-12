<script setup>
import AppSidebar from '@/components/AppSidebar.vue';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <div class="text-sm font-semibold">Admin</div>
      </header>
      <main class="p-4 h-full">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
