<script setup lang="ts">
definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({ title: 'Notification Settings - Rise Social' })

const toast = useToast()
const { api } = useApi()

const prefs = reactive<NotificationPreferences>({
  promo: false,
  jobs: false,
  programs: false
})

const isSaving = ref(false)

onMounted(async () => {
  try {
    const res = await api<ApiResponse<NotificationPreferences>>('/users/notification-preferences')
    Object.assign(prefs, res.data)
  } catch {
    // non-critical, keep defaults
  }
})

async function saveSettings() {
  isSaving.value = true
  try {
    await api('/users/notification-preferences', { method: 'PUT', body: { ...prefs } })
    toast.add({ title: 'Notification preferences saved', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <DashboardSettingSidebar>
    <h1 class="text-xl font-bold mb-2">Notifications</h1>

    <div class="space-y-4">
      <UCheckbox v-model="prefs.promo" label="Promo notifications" color="primary" />
      <UCheckbox v-model="prefs.jobs" label="Job notifications" color="primary" />
      <UCheckbox v-model="prefs.programs" label="Program notifications" color="primary" />
    </div>

    <div>
      <UButton variant="dashboard" :loading="isSaving" :disabled="isSaving" @click="saveSettings">
        Save Settings
      </UButton>
    </div>
  </DashboardSettingSidebar>
</template>
