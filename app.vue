<script setup>
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <div>
    <Toaster class="pointer-events-auto" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
