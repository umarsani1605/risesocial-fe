<script setup lang="ts">
import {
  websiteSettingsSchema,
  WEBSITE_CONTACT_KEY,
  WEBSITE_SOCIAL_MEDIA_KEY,
  EMPTY_WEBSITE_CONTACT,
  EMPTY_WEBSITE_SOCIAL_MEDIA,
  type WebsiteContactValues,
  type WebsiteSocialMediaValues,
  type WebsiteSettingsValues
} from '@/schemas/settings'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Website Settings',
  middleware: ['auth', 'superadmin']
})

useSeoMeta({ title: 'Website Settings - Rise Social' })

const { api } = useApi()
const toast = useToast()

const form = reactive<WebsiteSettingsValues>({
  ...EMPTY_WEBSITE_CONTACT,
  ...EMPTY_WEBSITE_SOCIAL_MEDIA
})
const loading = ref(true)
const saving = ref(false)

async function loadKey<T>(key: string): Promise<T | null> {
  try {
    const res = await api<ApiResponse<{ key: string; value: T | null } | null>>(
      `/admin/system/settings/${key}`
    )
    return res?.data?.value ?? null
  } catch {
    // Setting not created yet, treat as empty.
    return null
  }
}

async function load() {
  loading.value = true
  try {
    const [contact, social] = await Promise.all([
      loadKey<WebsiteContactValues>(WEBSITE_CONTACT_KEY),
      loadKey<WebsiteSocialMediaValues>(WEBSITE_SOCIAL_MEDIA_KEY)
    ])
    if (contact) Object.assign(form, { ...EMPTY_WEBSITE_CONTACT, ...contact })
    if (social) Object.assign(form, { ...EMPTY_WEBSITE_SOCIAL_MEDIA, ...social })
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function onSubmit() {
  saving.value = true
  try {
    const contact: WebsiteContactValues = {
      phone: form.phone,
      email: form.email,
      address: form.address
    }
    const social: WebsiteSocialMediaValues = {
      instagram: form.instagram,
      facebook: form.facebook,
      linkedin: form.linkedin,
      tiktok: form.tiktok
    }

    await Promise.all([
      api(`/admin/system/settings/${WEBSITE_CONTACT_KEY}`, {
        method: 'PUT',
        body: { value: contact, description: 'Website contact information' }
      }),
      api(`/admin/system/settings/${WEBSITE_SOCIAL_MEDIA_KEY}`, {
        method: 'PUT',
        body: { value: social, description: 'Website social media links' }
      })
    ])

    toast.add({ title: 'Website settings saved', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl w-full space-y-6">
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-40 w-full" />
      <USkeleton class="h-56 w-full" />
    </div>

    <UForm
      v-else
      :schema="websiteSettingsSchema"
      :state="form"
      class="space-y-6"
      @submit="onSubmit"
    >
      <div class="border border-default rounded-lg">
        <div class="px-6 py-4 border-b border-default">
          <h2 class="font-medium">Contact</h2>
        </div>

        <div class="p-6 space-y-4">
          <UFormField name="phone" label="Phone Number">
            <UInput
              v-model="form.phone"
              icon="i-ph-phone-duotone"
              placeholder="+62 812 3456 7890"
              class="w-full"
            />
          </UFormField>

          <UFormField name="email" label="Email">
            <UInput
              v-model="form.email"
              icon="i-ph-envelope-duotone"
              placeholder="hello@risesocial.org"
              class="w-full"
            />
          </UFormField>

          <UFormField name="address" label="Address">
            <UTextarea
              v-model="form.address"
              :rows="2"
              placeholder="Bandung, West Java 40286, Indonesia"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div class="border border-default rounded-lg">
        <div class="px-6 py-4 border-b border-default">
          <h2 class="font-medium">Social Media</h2>
        </div>

        <div class="p-6 space-y-4">
          <UFormField name="instagram" label="Instagram">
            <UInput
              v-model="form.instagram"
              icon="i-ph-instagram-logo-duotone"
              placeholder="https://www.instagram.com/risesocial_/"
              class="w-full"
            />
          </UFormField>

          <UFormField name="facebook" label="Facebook">
            <UInput
              v-model="form.facebook"
              icon="i-ph-facebook-logo-duotone"
              placeholder="https://www.facebook.com/risesocial"
              class="w-full"
            />
          </UFormField>

          <UFormField name="linkedin" label="LinkedIn">
            <UInput
              v-model="form.linkedin"
              icon="i-mdi-linkedin"
              placeholder="https://www.linkedin.com/company/rise-social-org/"
              class="w-full"
            />
          </UFormField>

          <UFormField name="tiktok" label="TikTok">
            <UInput
              v-model="form.tiktok"
              icon="i-ic-round-tiktok"
              placeholder="https://www.tiktok.com/@risesocial_"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div class="flex justify-end">
        <UButton type="submit" :loading="saving" :disabled="saving"> Save Changes </UButton>
      </div>
    </UForm>
  </div>
</template>
