<script setup lang="ts">
definePageMeta({ layout: 'dashboard-user' })

useSeoMeta({
  title: 'Notification Settings - Rise Social'
})

const toast = useToast()

const prefs = reactive({
  promo: true,
  jobs: true,
  programs: true
})

const saveSettings = () => {
  toast.add({ title: 'Settings saved successfully', color: 'success' })
}
</script>

<template>
  <DashboardSettingSidebar>
    <div class="space-y-6">
      <h1 class="text-xl font-bold">Notifications</h1>

      <div class="space-y-4">
        <UCheckbox v-model="prefs.promo" label="Promo notifications" color="primary" />
        <UCheckbox v-model="prefs.jobs" label="Job notifications" color="primary" />
        <UCheckbox v-model="prefs.programs" label="Program notifications" color="primary" />
      </div>

      <UButton color="primary" @click="saveSettings">Save Settings</UButton>
    </div>
  </DashboardSettingSidebar>
</template>
