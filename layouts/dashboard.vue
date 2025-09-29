<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <LayoutDashboardNavbar />

    <main class="flex-1">
      <slot />
    </main>

    <LayoutDashboardFooter />
  </div>
</template>
