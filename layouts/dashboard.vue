<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Dashboard Navbar -->
    <LayoutDashboardNavbar />

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Dashboard Footer -->
    <LayoutDashboardFooter />
  </div>
</template>

<script setup>
// Layout khusus untuk dashboard
// Komponen akan auto-imported dari folder components/layout/
</script>
