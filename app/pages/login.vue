<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const error = ref(false)
const isLoading = ref(false)

const { login, isAdmin } = useAuth()
const route = useRoute()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox'
  }
]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    error.value = false
    await login({ email: payload.data.email, password: payload.data.password })
    const redirect = route.query.redirect as string | undefined
    const safeRedirect = redirect && redirect.startsWith('/') ? redirect : undefined
    if (safeRedirect) {
      await navigateTo(safeRedirect)
    } else if (isAdmin.value) {
      await navigateTo('/admin')
    } else {
      await navigateTo('/dashboard')
    }
  }
  catch {
    error.value = true
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard
      class="w-full max-w-md rounded-2xl shadow"
      :ui="{
        container: 'sm:p-10'
      }"
    >
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Masuk ke Akun"
        class="w-90"
        :submit="{
          label: 'Continue',
          class: 'rounded-lg',
          loading: isLoading
        }"
        @submit="onSubmit"
      >
        <template #header>
          <div class="h-8 flex flex-col gap-4 items-center justify-center py-12 mb-4">
            <NuxtImg
              src="/logo.png"
              width="78"
              height="32"
              alt="Rise Social"
              class="size-auto mb-4"
            />
            <div class="text-2xl font-bold">Login to Your Account</div>
          </div>
        </template>
        <template #validation>
          <UAlert v-if="error" color="error" icon="i-lucide-info" title="Error signing in" />
        </template>
        <template #footer>
          Don't you have an account?
          <ULink to="/register" class="text-primary hover:text-primary hover:underline font-medium"
            >Register here</ULink
          >.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
