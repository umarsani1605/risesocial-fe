<script setup lang="ts">
definePageMeta({ layout: 'dashboard-user' })

useSeoMeta({
  title: 'Security Settings - Rise Social'
})

const toast = useToast()

const form = reactive({
  password: '',
  repeatPassword: ''
})

const passwordError = ref('')
const isSubmitting = ref(false)

const onChangePassword = () => {
  passwordError.value = ''

  if (form.password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }
  if (form.password !== form.repeatPassword) {
    passwordError.value = "Passwords don't match"
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    form.password = ''
    form.repeatPassword = ''
    isSubmitting.value = false
    toast.add({ title: 'Password updated successfully', color: 'success' })
  }, 600)
}
</script>

<template>
  <DashboardSettingSidebar>
    <div class="space-y-6">
      <h1 class="text-xl font-bold">Security</h1>

      <div class="space-y-4 max-w-lg">
        <UFormField
          label="Password"
          :error="form.password && form.password.length < 6 ? 'Password must be at least 6 characters' : undefined"
        >
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter new password"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Repeat password" :error="passwordError || undefined">
          <UInput
            v-model="form.repeatPassword"
            type="password"
            placeholder="Repeat new password"
            class="w-full"
          />
        </UFormField>
      </div>

      <UButton color="primary" :loading="isSubmitting" @click="onChangePassword">
        Change Password
      </UButton>
    </div>
  </DashboardSettingSidebar>
</template>
