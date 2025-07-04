<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Logo & Copyright -->
        <div class="flex items-center space-x-4 mb-4 md:mb-0">
          <NuxtImg src="/images/logo.png" alt="Rise Social" class="h-6 w-auto" />
          <p class="text-sm text-gray-600">© {{ currentYear }} Rise Social. All rights reserved.</p>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-wrap items-center gap-6 text-sm">
          <NuxtLink to="/privacy-policy" class="text-gray-600 hover:text-gray-900 transition-colors"> Privacy Policy </NuxtLink>
          <NuxtLink to="/term-of-services" class="text-gray-600 hover:text-gray-900 transition-colors"> Terms of Service </NuxtLink>
          <NuxtLink to="/contact" class="text-gray-600 hover:text-gray-900 transition-colors"> Contact Us </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Computed property untuk tahun saat ini
const currentYear = computed(() => new Date().getFullYear());
</script>
