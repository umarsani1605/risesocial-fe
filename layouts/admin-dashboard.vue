<script setup>
import AppSidebar from '@/components/AppSidebar.vue';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div class="text-sm font-semibold">Admin</div>
        <Button as="a" href="/" variant="ghost" size="sm" class="cursor-pointer">
          <Icon name="lucide:home" class="size-4" />
          <span>Back to Home</span>
        </Button>
      </header>
      <main class="p-4 h-full">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
