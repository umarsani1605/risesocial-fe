<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col items-center justify-center h-full p-6 gap-y-4">
        <img src="/empty.png" alt="Coming Soon" class="w-48" />
        <p class="text-gray-400 font-medium">Fitur ini akan segera hadir</p>
      </div>
    </CardContent>
  </Card>
</template>
