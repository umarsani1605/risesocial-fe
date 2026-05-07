<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'RYLS Self Funded - Rise Social' })
useHead({ bodyAttrs: { class: 'ryls-blue-theme' } })

const store = useRylsRegistration()
const router = useRouter()
const toast = useToast()
const { uploadHeadshot, isUploading: isUploadingFile, uploadError, uploadProgress } = useRylsFileUpload()
const { saveDraft, loadDraft } = useRylsDraft()
const isSavingDraft = ref(false)

onMounted(async () => {
  if (!store.step1.fullName) {
    const draft = await loadDraft()
    if (draft?.formData) {
      const fd = draft.formData as Record<string, unknown>
      if (fd.step1) store.setStep1(fd.step1 as Parameters<typeof store.setStep1>[0])
      if (fd.passportNumber) {
        store.setSelfFundedData({
          passportNumber: fd.passportNumber as string,
          needVisa: (fd.needVisa as 'YES' | 'NO' | '') || '',
          headshotFile: (fd.headshotFile as string) || '',
          readPolicies: (fd.readPolicies as 'YES' | 'NO' | '') || '',
        })
      }
    }
    else {
      router.push('/programs/rise-young-leaders-summit/registration')
      return
    }
  }
})

const headshotFile = ref<File | null>(null)
const headshotFileId = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const YES_NO_OPTIONS = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
]

const yesNoValues = YES_NO_OPTIONS.map(o => o.value) as [string, ...string[]]

const schema = z.object({
  passportNumber: z.string().min(1, 'Required field'),
  needVisa: z.enum(yesNoValues, { message: 'Please select Yes/No' }),
  headshotFile: z.string().min(1, 'Headshot file is required'),
  readPolicies: z.enum(yesNoValues, { message: 'Please select Yes/No' }).refine((val) => val === 'YES', {
    message: 'You must agree (Yes)',
  }),
})

type Schema = z.output<typeof schema>

const state = reactive({
  passportNumber: store.passportNumber || '',
  needVisa: (store.needVisa || undefined) as string | undefined,
  headshotFile: '',
  readPolicies: (store.readPolicies || undefined) as string | undefined,
})

function onBack() {
  router.push('/programs/rise-young-leaders-summit/registration')
}

async function onHeadshotChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    headshotFile.value = null
    headshotFileId.value = null
    state.headshotFile = ''
    return
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    toast.add({ title: 'File must be JPG, JPEG, or PNG', color: 'error' })
    input.value = ''
    headshotFile.value = null
    headshotFileId.value = null
    state.headshotFile = ''
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.add({ title: 'File size must be <= 10MB', color: 'error' })
    input.value = ''
    headshotFile.value = null
    headshotFileId.value = null
    state.headshotFile = ''
    return
  }

  headshotFile.value = file
  state.headshotFile = file.name

  try {
    const fileId = await uploadHeadshot(file)
    if (fileId) {
      headshotFileId.value = fileId
    }
  }
  catch {
    toast.add({ title: 'Failed to upload headshot file. Please try again.', color: 'error' })
    input.value = ''
    headshotFile.value = null
    headshotFileId.value = null
    state.headshotFile = ''
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!headshotFileId.value) {
    toast.add({ title: 'Please upload headshot photo first', color: 'error' })
    return
  }

  const values = event.data

  store.setSelfFundedData({
    passportNumber: values.passportNumber,
    needVisa: values.needVisa as 'YES' | 'NO' | '',
    headshotFile: headshotFileId.value,
    readPolicies: values.readPolicies as 'YES' | 'NO' | '',
  })

  isSavingDraft.value = true
  try {
    await saveDraft(
      2,
      { step1: store.step1, passportNumber: values.passportNumber, needVisa: values.needVisa, headshotFile: headshotFileId.value, readPolicies: values.readPolicies },
      store.step1.email,
      'SELF_FUNDED',
    )
  }
  catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
    return
  }
  finally {
    isSavingDraft.value = false
  }

  try {
    const { proxy } = useScriptMetaPixel()
    proxy.fbq('track', 'CompleteRegistrationStep2', {
      content_name: 'Self Funded',
    })
  }
  catch {
    // module not available
  }

  router.push('/programs/rise-young-leaders-summit/registration/payment')
}
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-10 md:py-12">
    <div class="mb-6">
      <NuxtImg
        src="/images/rise-young-leaders/2026/banner_ryls.jpg"
        alt="Rise Young Leaders Summit Japan 2026 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
      />
    </div>
    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-6">
        Self Funded Registration
      </h1>
      <div class="text-sm space-y-2">
        Ideal for experienced professionals and executives, this Global Leadership Experience equips you with cutting-edge climate change leadership
        skills and culminates in a prestigious RYLS certification.
      </div>
    </header>

    <hr class="my-6 border-gray-200">

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-8 text-gray-700"
      @submit="onSubmit"
    >
      <UFormField label="Passport Number" name="passportNumber" required>
        <UInput v-model="state.passportNumber" placeholder="e.g. X1234567" class="w-full" />
      </UFormField>

      <UFormField label="Does your country need visa to go to Japan?" name="needVisa" required>
        <URadioGroup
          v-model="state.needVisa"
          :items="YES_NO_OPTIONS"
          value-key="value"
          label-key="label"
        />
      </UFormField>

      <UFormField label="Upload your headshot photo" name="headshotFile" required>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          @change="onHeadshotChange"
        >
        <p class="text-sm text-muted mt-1">
          JPG, JPEG, and PNG only. Max size 10MB.
        </p>
      </UFormField>

      <UFormField name="readPolicies" required>
        <template #label>
          <div class="flex flex-col items-start gap-1">
            <span>I have read all the policies and agree with the policies.<span class="text-red-500">*</span></span>
            <span>
              Read the policies here:
              <a href="https://s.id/SelfFundedRYLS2026" target="_blank" class="underline text-primary">https://s.id/SelfFundedRYLS2026</a>
            </span>
          </div>
        </template>
        <URadioGroup
          v-model="(state.readPolicies as string)"
          :items="YES_NO_OPTIONS"
          value-key="value"
          label-key="label"
        />
      </UFormField>

      <hr class="my-6 border-gray-200">

      <div v-if="uploadError" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">
          {{ uploadError }}
        </p>
      </div>

      <div v-if="isUploadingFile" class="space-y-2">
        <p class="text-sm text-gray-600">
          Uploading headshot photo...
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <UButton type="button" variant="outline" class="px-6" :disabled="isUploadingFile" @click="onBack">
          Back
        </UButton>
        <UButton type="submit" class="px-6" :loading="isSavingDraft" :disabled="isSavingDraft">
          Next
        </UButton>
      </div>
    </UForm>
  </section>
</template>
