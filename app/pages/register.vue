<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const error = ref(false)
const isLoading = ref(false)

const { api } = useApi()
const { token, user } = useAuth()

const fields: AuthFormField[] = [
  {
    name: 'first_name',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true
  },
  {
    name: 'last_name',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter your last name',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
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
    name: 'confirm_password',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    required: true
  }
]

const schema = z
  .object({
    first_name: z.string('First name is required'),
    last_name: z.string('Last name is required'),
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirm_password: z
      .string('Confirm password is required')
      .min(8, 'Must be at least 8 characters')
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  })

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    error.value = false
    const res = await api<ApiResponse<{ token: string, user: typeof user.value }>>('/auth/register', {
      method: 'POST',
      body: {
        first_name: payload.data.first_name,
        last_name: payload.data.last_name,
        email: payload.data.email,
        password: payload.data.password
      }
    })
    token.value = res.data.token
    user.value = res.data.user as typeof user.value
    await navigateTo('/dashboard')
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
          label: 'Register',
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
            <div class="text-2xl font-bold">Register an Account</div>
          </div>
        </template>
        <template #validation>
          <UAlert v-if="error" color="error" icon="i-lucide-info" title="Error signing in" />
        </template>
        <template #footer>
          Already have an account?
          <ULink to="/login" class="text-primary hover:text-primary hover:underline font-medium"
            >Login here</ULink
          >.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
