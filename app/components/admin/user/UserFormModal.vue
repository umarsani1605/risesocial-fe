<script setup lang="ts">
import { userCreateSchema, userEditSchema } from '@/schemas/user'

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
}>('form', { required: true })

const props = defineProps<{
  loading: boolean
  title: string
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('userForm')
const activeSchema = computed(() =>
  props.mode === 'create' ? userCreateSchema : userEditSchema
)
</script>

<template>
  <UModal v-model:open="open" :title="title" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm ref="userForm" :schema="activeSchema" :state="form" class="space-y-4" @submit="emit('submit')">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField name="first_name" label="First Name" :required="mode === 'create'">
            <UInput v-model="form!.first_name" placeholder="First name" class="w-full" />
          </UFormField>
          <UFormField name="last_name" label="Last Name" :required="mode === 'create'">
            <UInput v-model="form!.last_name" placeholder="Last name" class="w-full" />
          </UFormField>
        </div>
        <UFormField name="email" label="Email" :required="mode === 'create'">
          <UInput v-model="form!.email" type="email" placeholder="Email address" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField name="password" :label="mode === 'create' ? 'Password' : 'New Password'" :required="mode === 'create'">
            <UInput
              v-model="form!.password"
              type="password"
              :placeholder="mode === 'create' ? 'Min. 6 characters' : 'Leave empty to keep current'"
              class="w-full"
            />
          </UFormField>
          <UFormField name="confirmPassword" label="Confirm Password" :required="mode === 'create'">
            <UInput
              v-model="form!.confirmPassword"
              type="password"
              :placeholder="mode === 'create' ? 'Repeat password' : 'Repeat new password'"
              class="w-full"
            />
          </UFormField>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="loading" @click="emit('cancel')" />
      <UButton
        :label="mode === 'create' ? 'Create' : 'Save'"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
