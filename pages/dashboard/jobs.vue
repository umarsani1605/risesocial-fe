<template>
  <div class="bg-gray-50 mt-8">
    <div class="container-wrapper section-py-md">
      <!-- Coming Soon Card -->
      <Card class="p-4 sm:p-6 lg:p-8 text-center h-[300px] flex items-center justify-center">
        <CardContent class="p-0"> Jobs </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Set layout
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

// Meta tags
useSeoMeta({
  title: 'Jobs Management - Rise Social',
  description: 'Manage your saved jobs and applications',
});
</script>
