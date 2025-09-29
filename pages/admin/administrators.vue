<template>
  <div>
    <h1>Administrators Management</h1>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-dashboard',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
});
</script>
