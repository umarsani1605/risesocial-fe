<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAPI, $api } from '@/composables/useAPI';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard-setting',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
});

const prefs = reactive({
  promo_notification: true,
  job_notification: true,
  program_notification: true,
});

const {
  data: notificationPreferences,
  pending,
  error,
} = await useAPI('/users/notification-preferences', {
  key: 'notification-preferences-data',
  transform: (response) => response?.data || {},
});

console.log('notification preferences:', notificationPreferences.value);

watch(
  () => notificationPreferences.value,
  (val) => {
    if (val && typeof val === 'object') {
      Object.assign(prefs, val);
    }
  },
  { immediate: true }
);

const saveSettings = async () => {
  try {
    await $api('/users/notification-preferences', {
      method: 'PUT',
      body: { preferences: prefs },
    });

    toast.success('Setting saved successfully');
  } catch (error) {
    toast.error('Failed to save notification preferences');
    console.error('Failed to save Setting');
  }
};
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold">Notifications</h1>
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <Checkbox id="promo" v-model="prefs.promo_notification" class="size-5" />
        <Label for="promo">Promo notifications</Label>
      </div>
      <div class="flex items-center gap-3">
        <Checkbox id="jobs" v-model="prefs.job_notification" class="size-5" />
        <Label for="jobs">Job notifications</Label>
      </div>
      <div class="flex items-center gap-3">
        <Checkbox id="programs" v-model="prefs.program_notification" class="size-5" />
        <Label for="programs">Program notifications</Label>
      </div>
    </div>

    <div class="pt-4">
      <Button @click="saveSettings" :disabled="pending">
        {{ pending ? 'Saving...' : 'Save Settings' }}
      </Button>
    </div>
  </div>
</template>
