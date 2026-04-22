<script setup lang="ts">
import { userPasswordSchema } from '@/schemas/user'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({ title: 'Security Settings - Rise Social' })

const toast = useToast()
const { api } = useApi()

const form = reactive({
  password: '',
  repeatPassword: ''
})

const formRef = useTemplateRef('securityForm')
const isSubmitting = ref(false)

async function onChangePassword() {
  isSubmitting.value = true
  try {
    await api('/users/security', { method: 'PUT', body: { password: form.password } })
    form.password = ''
    form.repeatPassword = ''
    toast.add({ title: 'Password updated', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <DashboardSettingSidebar>
    <h1 class="text-xl font-bold mb-2">Security</h1>

    <UForm
      ref="securityForm"
      :schema="userPasswordSchema"
      :state="form"
      class="space-y-4 max-w-lg"
      @submit="onChangePassword"
    >
      <UFormField name="password" label="Password">
        <UInput
          v-model="form.password"
          type="password"
          placeholder="Enter new password"
          class="w-full"
        />
      </UFormField>

      <UFormField name="repeatPassword" label="Repeat password">
        <UInput
          v-model="form.repeatPassword"
          type="password"
          placeholder="Repeat new password"
          class="w-full"
        />
      </UFormField>
    </UForm>

    <div>
      <UButton
        variant="dashboard"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        @click="formRef?.submit()"
      >
        Change Password
      </UButton>
    </div>
  </DashboardSettingSidebar>
</template>
