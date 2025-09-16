<template>
  <div class="space-y-4 h-full">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Bootcamp Management</h1>
    </div>
    <div class="flex flex-col items-center justify-center h-full text-gray-600 gap-6">
      <Icon class="size-32!" name="ph:coffee"></Icon>
      <h1 class="text-2xl font-semibold">We're brewing something special.</h1>
      <p class="">Site under construction. Coming soon.</p>
      <div class="h-32"></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: true,
  layout: 'admin-dashboard',
});
</script>
