<script setup lang="ts">
import { userCreateSchema, userEditSchema } from '@/schemas/user'

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
  role?: string
}>('form', { required: true })

const props = defineProps<{
  loading: boolean
  title: string
  mode: 'create' | 'edit'
  userId?: number
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('userForm')
const activeSchema = computed(() => (props.mode === 'create' ? userCreateSchema : userEditSchema))

const { isSuperAdmin } = useAuth()
const { api } = useApi()
const toast = useToast()

const showRole = computed(() => props.mode === 'edit' && isSuperAdmin.value)
const showPermissions = computed(
  () => props.mode === 'edit' && !!props.userId && isSuperAdmin.value
)

const registry = ref<AdminPermissionResource[]>([])
const userPermissions = ref<UserAdminPermission[]>([])
const isSavingPermission = ref<string | null>(null)

async function loadPermissions() {
  if (!showPermissions.value) return
  const [regRes, userRes] = await Promise.all([
    api<ApiResponse<AdminPermissionResource[]>>('/admin/permissions'),
    api<ApiResponse<UserAdminPermission[]>>(`/admin/users/${props.userId}/permissions`)
  ])
  registry.value = regRes.data
  userPermissions.value = userRes.data
}

watch(open, (val) => {
  if (val) loadPermissions()
})

function getPermission(key: string): UserAdminPermission | undefined {
  return userPermissions.value.find((p) => p.key === key)
}

async function setPermissionLevel(key: string, level: AdminAccessLevel | 'none') {
  if (!props.userId) return
  isSavingPermission.value = key
  try {
    if (level === 'none') {
      await api(`/admin/users/${props.userId}/permissions/${key}`, { method: 'DELETE' })
      userPermissions.value = userPermissions.value.filter((p) => p.key !== key)
    } else {
      const existing = userPermissions.value.find((p) => p.key === key)
      const updated = existing
        ? userPermissions.value.map((p) => (p.key === key ? { ...p, access_level: level } : p))
        : [...userPermissions.value, { key, access_level: level }]
      const res = await api<ApiResponse<UserAdminPermission[]>>(
        `/admin/users/${props.userId}/permissions`,
        { method: 'PUT', body: { permissions: updated } }
      )
      userPermissions.value = res.data
    }
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSavingPermission.value = null
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :class="showPermissions ? 'max-w-4xl' : 'max-w-lg'"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="flex items-start gap-10">
        <UForm
          ref="userForm"
          :schema="activeSchema"
          :state="form"
          :validate-on="['submit']"
          class="flex-1 min-w-0 space-y-4"
          @submit="emit('submit')"
        >
          <UFormField name="first_name" label="First Name" :required="mode === 'create'">
            <UInput v-model="form!.first_name" placeholder="First name" class="w-full" />
          </UFormField>
          <UFormField name="last_name" label="Last Name" :required="mode === 'create'">
            <UInput v-model="form!.last_name" placeholder="Last name" class="w-full" />
          </UFormField>
          <UFormField name="email" label="Email" :required="mode === 'create'">
            <UInput v-model="form!.email" type="email" placeholder="Email address" class="w-full" />
          </UFormField>
          <UFormField
            name="password"
            :label="mode === 'create' ? 'Password' : 'New Password'"
            :required="mode === 'create'"
          >
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
          <UFormField v-if="showRole" name="role" label="Role">
            <USelect
              v-model="form!.role"
              :items="[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' }
              ]"
              class="w-full"
            />
          </UFormField>
        </UForm>

        <template v-if="showPermissions">
          <div class="flex-1 w-64 shrink-0">
            <p class="text-sm font-semibold text-highlighted mb-3">Permissions</p>
            <div class="space-y-1">
              <div
                v-for="resource in registry"
                :key="resource.key"
                class="flex items-center justify-between gap-3 py-1.5"
              >
                <span class="flex-1 text-sm font-medium">{{ resource.name }}</span>
                <USelect
                  :model-value="getPermission(resource.key)?.access_level ?? 'none'"
                  :items="[
                    { label: 'None', value: 'none' },
                    ...resource.available_levels.map((l) => ({
                      label: l.charAt(0) + l.slice(1).toLowerCase(),
                      value: l
                    }))
                  ]"
                  class="w-36"
                  :disabled="isSavingPermission === resource.key"
                  @update:model-value="
                    (val) => setPermissionLevel(resource.key, val as AdminAccessLevel | 'none')
                  "
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="loading"
        @click="emit('cancel')"
      />
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
