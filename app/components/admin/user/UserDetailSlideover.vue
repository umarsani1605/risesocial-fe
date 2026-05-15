<script setup lang="ts">
import { z } from 'zod'

const open = defineModel<boolean>('open', { required: true })

const props = withDefaults(
  defineProps<{
    user: UserProfile | null
    loading?: boolean
    userId?: number
    title?: string
    description?: string
    showPermissions?: boolean
    roleItems?: { label: string; value: UserRole }[]
    showDelete?: boolean
    deleteLabel?: string
  }>(),
  {
    loading: false,
    userId: undefined,
    title: 'User Detail',
    description: 'Edit user information.',
    showPermissions: false,
    showDelete: false,
    deleteLabel: 'Hapus',
    roleItems: () => [
      { label: 'User', value: 'USER' },
      { label: 'Admin', value: 'ADMIN' }
    ]
  }
)

const emit = defineEmits<{
  submit: [payload: AdminUserDetailForm]
  delete: []
}>()

const formRef = useTemplateRef('detailForm')
const { isSuperAdmin } = useAuth()
const { api } = useApi()
const toast = useToast()

const form = reactive<AdminUserDetailForm>({
  username: '',
  first_name: '',
  last_name: '',
  avatar: '',
  avatarFile: null,
  email: '',
  phone: '',
  role: 'USER',
  gender: '',
  country: '',
  province: '',
  city: '',
  last_education: '',
  current_job: '',
  current_company: ''
})

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  avatar: z.string(),
  email: z.email('Invalid email address'),
  phone: z.string(),
  role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']),
  gender: z.enum(['', 'MALE', 'FEMALE', 'PREFER_NOT_TO_SAY']),
  country: z.string(),
  province: z.string(),
  city: z.string(),
  last_education: z.string(),
  current_job: z.string(),
  current_company: z.string()
})

const genderItems = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' }
] as const

const rowClass =
  'grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm items-center'

const timestampRows = computed(() => {
  if (!props.user) return []

  return [
    {
      label: 'Account Created',
      value: props.user.created_at ? formatDatetime(props.user.created_at) : '–'
    },
    {
      label: 'Account Updated',
      value: props.user.updated_at ? formatDatetime(props.user.updated_at) : '–'
    }
  ]
})

const avatarFileInputRef = useTemplateRef<HTMLInputElement>('avatarFileInput')
const avatarPreviewUrl = ref('')
const registry = ref<AdminPermissionResource[]>([])
const userPermissions = ref<UserAdminPermission[]>([])
const isSavingPermission = ref<string | null>(null)

const canManagePermissions = computed(
  () => props.showPermissions && !!props.userId && isSuperAdmin.value
)

const avatarText = computed(() => {
  const first = form.first_name.trim().charAt(0).toUpperCase()
  const last = form.last_name.trim().charAt(0).toUpperCase()
  return `${first}${last}`.trim()
})

const avatarPreview = computed(() => {
  return avatarPreviewUrl.value || form.avatar || undefined
})

function syncForm(user: UserProfile | null) {
  form.username = user?.username ?? ''
  form.first_name = user?.first_name ?? ''
  form.last_name = user?.last_name ?? ''
  form.avatar = user?.avatar ?? ''
  form.avatarFile = null
  form.email = user?.email ?? ''
  form.phone = user?.phone ?? ''
  form.role = user?.role ?? 'USER'
  form.gender = user?.gender ?? ''
  form.country = user?.country ?? ''
  form.province = user?.province ?? ''
  form.city = user?.city ?? ''
  form.last_education = user?.last_education ?? ''
  form.current_job = user?.current_job ?? ''
  form.current_company = user?.current_company ?? ''
}

async function loadPermissions() {
  if (!canManagePermissions.value) return

  const [regRes, userRes] = await Promise.all([
    api<ApiResponse<AdminPermissionResource[]>>('/admin/permissions'),
    api<ApiResponse<UserAdminPermission[]>>(`/admin/users/${props.userId}/permissions`)
  ])

  registry.value = regRes.data
  userPermissions.value = userRes.data
}

function getPermission(key: string): UserAdminPermission | undefined {
  return userPermissions.value.find((permission) => permission.key === key)
}

function getPermissionItems(resource: AdminPermissionResource) {
  const availableLevels = new Set(resource.available_levels)

  return [
    { label: 'None', value: 'none', disabled: false },
    { label: 'Viewer', value: 'VIEWER', disabled: !availableLevels.has('VIEWER') },
    { label: 'Editor', value: 'EDITOR', disabled: !availableLevels.has('EDITOR') }
  ]
}

function getPermissionIcon(value: AdminAccessLevel | 'none') {
  if (value === 'none') return 'i-ph-prohibit-bold'
  if (value === 'VIEWER') return 'i-ph-eye-bold'
  if (value === 'EDITOR') return 'i-ph-pencil-simple-bold'
  return undefined
}

async function setPermissionLevel(key: string, level: AdminAccessLevel | 'none') {
  if (!props.userId) return

  isSavingPermission.value = key
  try {
    if (level === 'none') {
      await api(`/admin/users/${props.userId}/permissions/${key}`, { method: 'DELETE' })
      userPermissions.value = userPermissions.value.filter((permission) => permission.key !== key)
      return
    }

    const existing = userPermissions.value.find((permission) => permission.key === key)
    const updated = existing
      ? userPermissions.value.map((permission) =>
          permission.key === key ? { ...permission, access_level: level } : permission
        )
      : [...userPermissions.value, { key, access_level: level }]

    const res = await api<ApiResponse<UserAdminPermission[]>>(
      `/admin/users/${props.userId}/permissions`,
      {
        method: 'PUT',
        body: { permissions: updated }
      }
    )
    userPermissions.value = res.data
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSavingPermission.value = null
  }
}

watch(
  () => props.user,
  (user) => {
    syncForm(user)
  },
  { immediate: true }
)

watch(open, (isOpen) => {
  if (!isOpen) return
  syncForm(props.user)
  loadPermissions()
})

watch(
  () => form.avatarFile,
  (file) => {
    if (avatarPreviewUrl.value) {
      URL.revokeObjectURL(avatarPreviewUrl.value)
      avatarPreviewUrl.value = ''
    }

    if (file) {
      avatarPreviewUrl.value = URL.createObjectURL(file)
    }
  }
)

function onPickAvatar() {
  avatarFileInputRef.value?.click()
}

function onAvatarFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    input.value = ''
    return
  }

  form.avatarFile = file
}

function onRemoveAvatar() {
  form.avatarFile = null
  form.avatar = ''
  if (avatarFileInputRef.value) {
    avatarFileInputRef.value.value = ''
  }
}

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="title"
    :description="description"
    side="right"
    :ui="{ content: 'max-w-xl', body: 'p-0!', footer: 'justify-between' }"
  >
    <template #body>
      <div v-if="user">
        <UForm
          ref="detailForm"
          :schema="formSchema"
          :state="form"
          :validate-on="['submit']"
          class="space-y-0"
          @submit="handleSubmit"
        >
          <div class="p-6 space-y-4">
            <p class="text-xs font-bold uppercase tracking-wide">User Information</p>

            <div class="space-y-4">
              <div :class="rowClass">
                <span class="text-muted">Avatar</span>
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <UAvatar
                      :src="avatarPreview"
                      :text="avatarText"
                      size="3xl"
                      color="primary"
                      class="bg-primary text-white rounded-full"
                    />
                    <UButton
                      v-if="avatarPreview"
                      type="button"
                      color="neutral"
                      variant="solid"
                      size="xs"
                      icon="i-ph-x-bold"
                      class="absolute top-0 right-0 translate-x-1/5 -translate-y-1/5 rounded-full shadow-sm"
                      @click="onRemoveAvatar"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <input
                      ref="avatarFileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      aria-label="Upload avatar image"
                      @change="onAvatarFileChange"
                    />
                    <UButton
                      type="button"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      @click="onPickAvatar"
                    >
                      Change Avatar
                    </UButton>
                    <p class="text-xs text-muted">Max file size: 5MB</p>
                  </div>
                </div>
              </div>

              <div :class="rowClass">
                <span class="text-muted">First Name</span>
                <UFormField name="first_name" required>
                  <UInput v-model="form.first_name" placeholder="First name" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Last Name</span>
                <UFormField name="last_name" required>
                  <UInput v-model="form.last_name" placeholder="Last name" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Username</span>
                <UFormField name="username" required>
                  <UInput v-model="form.username" placeholder="Username" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Email</span>
                <UFormField name="email" required>
                  <UInput
                    v-model="form.email"
                    type="email"
                    placeholder="Email address"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Phone</span>
                <UFormField name="phone">
                  <UInput v-model="form.phone" placeholder="Phone number" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Gender</span>
                <UFormField name="gender">
                  <USelect
                    v-model="form.gender"
                    :items="genderItems"
                    value-key="value"
                    label-key="label"
                    placeholder="Select gender"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Country</span>
                <UFormField name="country">
                  <UInput v-model="form.country" placeholder="Country" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Province</span>
                <UFormField name="province">
                  <UInput v-model="form.province" placeholder="Province" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">City</span>
                <UFormField name="city">
                  <UInput v-model="form.city" placeholder="City" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Last Education</span>
                <UFormField name="last_education">
                  <UInput
                    v-model="form.last_education"
                    placeholder="Last education"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Current Job</span>
                <UFormField name="current_job">
                  <UInput v-model="form.current_job" placeholder="Current job" class="w-full" />
                </UFormField>
              </div>

              <div :class="rowClass">
                <span class="text-muted">Current Company</span>
                <UFormField name="current_company">
                  <UInput
                    v-model="form.current_company"
                    placeholder="Current company"
                    class="w-full"
                  />
                </UFormField>
              </div>
              <div v-for="row in timestampRows" :key="row.label" :class="rowClass">
                <span class="text-muted">{{ row.label }}</span>
                <span>{{ row.value }}</span>
              </div>
            </div>
          </div>

          <USeparator />

          <div class="p-6 space-y-4">
            <p class="text-xs font-bold uppercase tracking-wide">Role</p>
            <div :class="rowClass">
              <span class="text-muted">Role</span>
              <UFormField name="role" required>
                <USelect v-model="form.role" :items="props.roleItems" class="w-full" />
              </UFormField>
            </div>
          </div>

          <template v-if="canManagePermissions">
            <USeparator />

            <div class="p-6 space-y-4">
              <p class="text-xs font-bold uppercase tracking-wide">Permissions</p>
              <div class="space-y-3">
                <div
                  v-for="resource in registry"
                  :key="resource.key"
                  class="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm items-center"
                >
                  <span class="text-muted">{{ resource.name }}</span>
                  <URadioGroup
                    :model-value="getPermission(resource.key)?.access_level ?? 'none'"
                    :items="getPermissionItems(resource)"
                    size="xs"
                    value-key="value"
                    label-key="label"
                    variant="table"
                    orientation="horizontal"
                    indicator="hidden"
                    class="w-full"
                    :disabled="isSavingPermission === resource.key"
                    @update:model-value="
                      (value) =>
                        setPermissionLevel(resource.key, value as AdminAccessLevel | 'none')
                    "
                  >
                    <template #label="{ item }">
                      <div class="flex items-center justify-center gap-2">
                        <UIcon
                          v-if="getPermissionIcon(item.value as AdminAccessLevel | 'none')"
                          :name="getPermissionIcon(item.value as AdminAccessLevel | 'none')!"
                          class="size-4"
                        />
                        <span>{{ item.label }}</span>
                      </div>
                    </template>
                  </URadioGroup>
                </div>
              </div>
            </div>
          </template>

          <!-- <USeparator />

          <div class="p-6">
            <p class="text-xs font-bold uppercase tracking-wide mb-4">Skills</p>
          </div> -->
        </UForm>
      </div>

      <div v-else class="p-6">
        <p class="text-sm text-muted">User detail is unavailable.</p>
      </div>
    </template>

    <template #footer>
      <UButton
        v-if="showDelete"
        :label="deleteLabel"
        color="error"
        variant="light"
        icon="i-ph-trash-simple-bold"
        :disabled="!user || loading"
        @click="emit('delete')"
      />
      <UButton
        label="Ubah"
        color="primary"
        icon="i-ph-pencil-simple-bold"
        :loading="loading"
        :disabled="!user || loading"
        @click="formRef?.submit()"
      />
    </template>
  </USlideover>
</template>
