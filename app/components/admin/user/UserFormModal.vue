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
  userId?: number
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('userForm')
const activeSchema = computed(() =>
  props.mode === 'create' ? userCreateSchema : userEditSchema
)

// ── Permissions section (SUPERADMIN + edit mode only) ─────────────────────────

const { isSuperAdmin } = useAuth()
const { api } = useApi()
const toast = useToast()

const showPermissions = computed(() => props.mode === 'edit' && !!props.userId && isSuperAdmin.value)

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

watch(open, (val) => { if (val) loadPermissions() })

function getPermission(key: string): UserAdminPermission | undefined {
  return userPermissions.value.find(p => p.key === key)
}

async function togglePermission(key: string, enabled: boolean) {
  if (!props.userId) return
  isSavingPermission.value = key
  try {
    if (!enabled) {
      await api(`/admin/users/${props.userId}/permissions/${key}`, { method: 'DELETE' })
      userPermissions.value = userPermissions.value.filter(p => p.key !== key)
    } else {
      const res = await api<ApiResponse<UserAdminPermission[]>>(
        `/admin/users/${props.userId}/permissions`,
        { method: 'PUT', body: { permissions: [...userPermissions.value, { key, access_level: 'VIEWER' }] } }
      )
      userPermissions.value = res.data
    }
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSavingPermission.value = null
  }
}

async function changeLevel(key: string, level: AdminAccessLevel) {
  if (!props.userId) return
  isSavingPermission.value = key
  try {
    const updated = userPermissions.value.map(p => p.key === key ? { ...p, access_level: level } : p)
    const res = await api<ApiResponse<UserAdminPermission[]>>(
      `/admin/users/${props.userId}/permissions`,
      { method: 'PUT', body: { permissions: updated } }
    )
    userPermissions.value = res.data
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSavingPermission.value = null
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="title" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm ref="userForm" :schema="activeSchema" :state="form" :validate-on="['submit']" class="space-y-4" @submit="emit('submit')">
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

      <template v-if="showPermissions">
        <UDivider class="my-5" />
        <p class="text-sm font-semibold text-highlighted mb-3">Permissions</p>
        <div class="space-y-2">
          <div
            v-for="resource in registry"
            :key="resource.key"
            class="flex items-center justify-between gap-3 rounded-lg border border-default px-3 py-2"
          >
            <span class="text-sm font-medium">{{ resource.name }}</span>
            <div class="flex items-center gap-2">
              <USelect
                v-if="getPermission(resource.key)"
                :model-value="getPermission(resource.key)!.access_level"
                :options="resource.available_levels.map(l => ({ label: l, value: l }))"
                size="xs"
                class="w-24"
                :disabled="isSavingPermission === resource.key"
                @update:model-value="(val: AdminAccessLevel) => changeLevel(resource.key, val)"
              />
              <UToggle
                :model-value="!!getPermission(resource.key)"
                :loading="isSavingPermission === resource.key"
                size="sm"
                @update:model-value="(val: boolean) => togglePermission(resource.key, val)"
              />
            </div>
          </div>
        </div>
      </template>
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
