<script setup lang="ts">
import { userAccountSchema } from '@/schemas/user'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Account Settings - Rise Social'
})

const { api } = useApi()
const toast = useToast()

const { data: profileData } = await useAsyncData('user:profile', () =>
  api<ApiResponse<UserProfile>>('/users/profile')
)

const user = computed(() => profileData.value?.data)

const initials = computed(() => {
  const first = user.value?.first_name?.charAt(0) ?? ''
  const last = user.value?.last_name?.charAt(0) ?? ''
  return (first + last).toUpperCase() || 'U'
})

const isSubmitting = ref(false)
const formRef = useTemplateRef('accountForm')
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const avatarFileInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  first_name: user.value?.first_name ?? '',
  last_name: user.value?.last_name ?? '',
  email: user.value?.email ?? '',
  phone: user.value?.phone ?? '',
  gender: user.value?.gender ?? '',
  country: user.value?.country ?? '',
  province: user.value?.province ?? '',
  city: user.value?.city ?? '',
  last_education: user.value?.last_education ?? '',
  current_job: user.value?.current_job ?? '',
  current_company: user.value?.current_company ?? ''
})

const currentAvatar = computed(() => avatarPreview.value || user.value?.avatar || '')

const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' }
]

const onPickAvatar = () => avatarFileInputRef.value?.click()

const onAvatarFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.add({ title: 'File too large', description: 'Max 5MB', color: 'error' })
    input.value = ''
    return
  }
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const onRemoveAvatar = () => {
  avatarPreview.value = ''
  avatarFile.value = null
  if (avatarFileInputRef.value) avatarFileInputRef.value.value = ''
}

const onSave = async () => {
  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('first_name', form.first_name)
    fd.append('last_name', form.last_name)
    fd.append('email', form.email)
    fd.append('phone', form.phone ?? '')
    fd.append('gender', form.gender ?? '')
    fd.append('country', form.country ?? '')
    fd.append('province', form.province ?? '')
    fd.append('city', form.city ?? '')
    fd.append('last_education', form.last_education ?? '')
    fd.append('current_job', form.current_job ?? '')
    fd.append('current_company', form.current_company ?? '')
    if (avatarFile.value) fd.append('image', avatarFile.value)

    await api('/users/account', { method: 'PUT', body: fd })
    toast.add({ title: 'Account updated', color: 'success' })
  }
  catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <DashboardSettingSidebar>
    <div class="space-y-6">
      <h1 class="text-xl font-bold">Account</h1>

      <UFormField label="Avatar">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-1">
          <UAvatar
            :src="currentAvatar"
            :text="initials"
            color="primary"
            class="shrink-0 size-24 rounded-full"
          />
          <div class="flex flex-col gap-2">
            <input
              ref="avatarFileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onAvatarFileChange"
            />
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              leading-icon="i-ph-image-bold"
              @click="onPickAvatar"
            >
              Change Avatar
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              leading-icon="i-ph-trash-simple-bold"
              :disabled="!currentAvatar"
              @click="onRemoveAvatar"
            >
              Remove Avatar
            </UButton>
            <p class="text-xs text-muted">Max file size: 5MB</p>
          </div>
        </div>
      </UFormField>

      <UForm ref="accountForm" :schema="userAccountSchema" :state="form" class="grid grid-cols-1 gap-4 max-w-lg" @submit="onSave">
        <UFormField name="first_name" label="First name" required>
          <UInput v-model="form.first_name" placeholder="John" class="w-full" />
        </UFormField>

        <UFormField name="last_name" label="Last name" required>
          <UInput v-model="form.last_name" placeholder="Doe" class="w-full" />
        </UFormField>

        <UFormField name="email" label="Email" required>
          <UInput v-model="form.email" type="email" placeholder="john@example.com" class="w-full" />
        </UFormField>

        <UFormField name="phone" label="Phone">
          <UInput v-model="form.phone" placeholder="+62" class="w-full" />
        </UFormField>

        <UFormField name="gender" label="Gender">
          <USelect
            v-model="form.gender"
            :items="genderOptions"
            value-key="value"
            label-key="label"
            placeholder="Select gender"
            class="w-full"
          />
        </UFormField>

        <UFormField name="country" label="Country">
          <UInput v-model="form.country" placeholder="Indonesia" class="w-full" />
        </UFormField>

        <UFormField name="province" label="Province">
          <UInput v-model="form.province" placeholder="Jawa Barat" class="w-full" />
        </UFormField>

        <UFormField name="city" label="City">
          <UInput v-model="form.city" placeholder="Bandung" class="w-full" />
        </UFormField>

        <UFormField name="last_education" label="Last Education">
          <UInput v-model="form.last_education" placeholder="S1 Computer Science" class="w-full" />
        </UFormField>

        <UFormField name="current_job" label="Current Job">
          <UInput v-model="form.current_job" placeholder="Software Engineer" class="w-full" />
        </UFormField>

        <UFormField name="current_company" label="Current Company">
          <UInput v-model="form.current_company" placeholder="Rise Social" class="w-full" />
        </UFormField>
      </UForm>

      <UButton color="primary" :loading="isSubmitting" :disabled="isSubmitting" @click="formRef?.submit()">Save changes</UButton>
    </div>
  </DashboardSettingSidebar>
</template>
