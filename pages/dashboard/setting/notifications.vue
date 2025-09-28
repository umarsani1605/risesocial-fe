<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

definePageMeta({
  auth: true,
  layout: 'dashboard-setting',
});

const prefs = reactive({
  promo_notification: false,
  job_notification: true,
  course_notification: true,
});

// Load user settings from API
const { data: userSettings, pending, error } = await useFetch('/api/user/settings');

// Initialize preferences from API data
if (userSettings.value) {
  userSettings.value.forEach((setting) => {
    if (prefs.hasOwnProperty(setting.key)) {
      prefs[setting.key] = setting.value;
    }
  });
}

const saveSettings = async () => {
  try {
    const settingsToSave = Object.entries(prefs).map(([key, value]) => ({
      key,
      value,
    }));

    await $fetch('/api/user/settings', {
      method: 'PUT',
      body: { settings: settingsToSave },
    });

    // Show success message
    console.log('Settings saved successfully');
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold">Notifications</h1>
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <Checkbox id="promo" v-model:checked="prefs.promo_notification" />
        <Label for="promo">Promo notifications</Label>
      </div>
      <div class="flex items-center gap-3">
        <Checkbox id="jobs" v-model:checked="prefs.job_notification" />
        <Label for="jobs">Job notifications</Label>
      </div>
      <div class="flex items-center gap-3">
        <Checkbox id="courses" v-model:checked="prefs.course_notification" />
        <Label for="courses">Course notifications</Label>
      </div>
    </div>

    <div class="pt-4">
      <Button @click="saveSettings" :disabled="pending">
        {{ pending ? 'Saving...' : 'Save Settings' }}
      </Button>
    </div>
  </div>
</template>
