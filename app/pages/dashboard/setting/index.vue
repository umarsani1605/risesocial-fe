<script setup lang="ts">
import type { UserProfile } from '@/composables/useMockUser'

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

const avatarPreview = ref('')
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
    toast.add({ title: 'File terlalu besar', description: 'Maksimal 5MB', color: 'error' })
    input.value = ''
    return
  }
  avatarPreview.value = URL.createObjectURL(file)
}

const onRemoveAvatar = () => {
  avatarPreview.value = ''
  if (avatarFileInputRef.value) avatarFileInputRef.value.value = ''
}

const onSave = async () => {
  await api('/users/account', {
    method: 'PUT',
    body: {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone
    }
  })
  toast.add({ title: 'Account updated successfully', color: 'success' })
}
</script>

<template>
  <DashboardSettingSidebar>
    <div class="space-y-6">
      <h1 class="text-xl font-bold">Account</h1>

      <UFormField label="Avatar">
        <div class="flex items-center gap-6 mt-1">
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
              leading-icon="i-lucide-image"
              @click="onPickAvatar"
            >
              Change Avatar
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              leading-icon="i-lucide-trash-2"
              :disabled="!currentAvatar"
              @click="onRemoveAvatar"
            >
              Remove Avatar
            </UButton>
            <p class="text-xs text-muted">Max file size: 5MB</p>
          </div>
        </div>
      </UFormField>

      <div class="grid grid-cols-1 gap-4 max-w-lg">
        <UFormField label="First name" required>
          <UInput v-model="form.first_name" placeholder="John" class="w-full" />
        </UFormField>

        <UFormField label="Last name" required>
          <UInput v-model="form.last_name" placeholder="Doe" class="w-full" />
        </UFormField>

        <UFormField label="Email" required>
          <UInput v-model="form.email" type="email" placeholder="john@example.com" class="w-full" />
        </UFormField>

        <UFormField label="Phone">
          <UInput v-model="form.phone" placeholder="+62" class="w-full" />
        </UFormField>

        <UFormField label="Gender">
          <USelect
            v-model="form.gender"
            :items="genderOptions"
            value-key="value"
            label-key="label"
            placeholder="Select gender"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Country">
          <UInput v-model="form.country" placeholder="Indonesia" class="w-full" />
        </UFormField>

        <UFormField label="Province">
          <UInput v-model="form.province" placeholder="Jawa Barat" class="w-full" />
        </UFormField>

        <UFormField label="City">
          <UInput v-model="form.city" placeholder="Bandung" class="w-full" />
        </UFormField>

        <UFormField label="Last Education">
          <UInput v-model="form.last_education" placeholder="S1 Computer Science" class="w-full" />
        </UFormField>

        <UFormField label="Current Job">
          <UInput v-model="form.current_job" placeholder="Software Engineer" class="w-full" />
        </UFormField>

        <UFormField label="Current Company">
          <UInput v-model="form.current_company" placeholder="Rise Social" class="w-full" />
        </UFormField>

        <!-- <UFormField label="Skills">
          <div class="flex flex-wrap gap-2 mt-1">
            <UBadge v-for="skill in user.skills" :key="skill" color="neutral" variant="outline">
              {{ skill }}
            </UBadge>
          </div>
        </UFormField> -->
      </div>

      <UButton color="primary" @click="onSave">Save changes</UButton>
    </div>
  </DashboardSettingSidebar>
</template>
