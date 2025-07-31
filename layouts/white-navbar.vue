<template>
  <div class="min-h-screen bg-white">
    <!-- Navbar -->
    <LayoutNavbarWhite />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <LayoutFooter />
  </div>
</template>

<script lang="ts" setup>
// No imports needed as components are auto-imported in Nuxt
</script>

<style>
/* Global styles can be added here if needed */
</style>
