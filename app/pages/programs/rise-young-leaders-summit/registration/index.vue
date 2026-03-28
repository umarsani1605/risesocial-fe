<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'default' })

useHead({ bodyAttrs: { class: 'ryls-blue-theme' } })

const store = useRylsRegistration()
const router = useRouter()

const genderValues = GENDER_OPTIONS.map(o => o.value) as [string, ...string[]]
const discoverValues = DISCOVER_SOURCES.map(o => o.value) as [string, ...string[]]
const scholarshipValues = SCHOLARSHIP_TYPES.map(o => o.value) as [string, ...string[]]

const schema = z
  .object({
    fullName: z.string().min(1, 'Required field'),
    email: z.string().email('Invalid email'),
    residence: z.string().min(1, 'Required field'),
    nationality: z.string().min(1, 'Required field'),
    secondNationality: z.string().optional(),
    whatsapp: z.string().min(1, 'Required field'),
    institution: z.string().min(1, 'Required field'),
    dateOfBirth: z.string().min(1, 'Required field'),
    gender: z.enum(genderValues, { message: 'Please select one option' }),
    discoverSource: z.enum(discoverValues, { message: 'Please select one option' }),
    discoverOtherText: z.string().optional(),
    scholarshipType: z.enum(scholarshipValues, { message: 'Please select one option' })
  })
  .refine(
    (data) => {
      if (data.discoverSource === 'OTHER' && (!data.discoverOtherText || !data.discoverOtherText.trim())) {
        return false
      }
      return true
    },
    {
      message: 'Please specify',
      path: ['discoverOtherText']
    }
  )

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  fullName: store.step1.fullName || '',
  email: store.step1.email || '',
  residence: store.step1.residence || '',
  nationality: store.step1.nationality || '',
  secondNationality: store.step1.secondNationality || '',
  whatsapp: store.step1.whatsapp || '',
  institution: store.step1.institution || '',
  dateOfBirth: store.step1.dateOfBirth || '',
  gender: store.step1.gender || undefined,
  discoverSource: store.step1.discoverSource || undefined,
  discoverOtherText: store.step1.discoverOtherText || '',
  scholarshipType: store.step1.scholarshipType || undefined
})

function onWhatsappInput(e: Event) {
  const input = e.target as HTMLInputElement
  const filtered = input.value.replace(/[^0-9+]/g, '')
  input.value = filtered
  state.whatsapp = filtered
}

function onSubmit(event: FormSubmitEvent<Schema>) {
  const values = event.data

  store.setStep1({
    fullName: values.fullName,
    email: values.email,
    residence: values.residence,
    nationality: values.nationality,
    secondNationality: values.secondNationality ?? '',
    whatsapp: values.whatsapp,
    institution: values.institution,
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
    discoverSource: values.discoverSource,
    discoverOtherText: values.discoverOtherText ?? '',
    scholarshipType: values.scholarshipType as 'FULLY_FUNDED' | 'SELF_FUNDED' | ''
  })

  const base = '/programs/rise-young-leaders-summit/registration'
  if (values.scholarshipType === 'FULLY_FUNDED') {
    router.push(`${base}/payment`)
  } else if (values.scholarshipType === 'SELF_FUNDED') {
    router.push(`${base}/self-funded`)
  }
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
        Rise Young Leaders Summit Japan 2026 - International Climate Change Leadership Forum
      </h1>
      <div class="text-sm space-y-2">
        Hello Rise Peeps, please fill out this form with accurate information and make sure you have a good internet connection.
      </div>
    </header>

    <hr class="my-6 border-gray-200">

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-8 text-gray-700"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 gap-6">
        <UFormField label="Full Name" name="fullName" required>
          <UInput v-model="state.fullName" placeholder="Your full name" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" type="email" placeholder="Your email" class="w-full" />
        </UFormField>

        <UFormField label="City and Country of Residence" name="residence" required>
          <UInput v-model="state.residence" placeholder="City and Country of Residence" class="w-full" />
        </UFormField>

        <UFormField label="Nationality" name="nationality" required>
          <UInput v-model="state.nationality" placeholder="Your nationality" class="w-full" />
        </UFormField>

        <UFormField label="Second Nationality (if there's any)" name="secondNationality">
          <UInput v-model="state.secondNationality" placeholder="Second nationality" class="w-full" />
        </UFormField>

        <UFormField label="WhatsApp Number" name="whatsapp" required>
          <UInput
            :model-value="state.whatsapp"
            type="tel"
            placeholder="+62xxxxxxxxxxx"
            class="w-full"
            @input="onWhatsappInput"
          />
        </UFormField>

        <UFormField label="Institution (work place/university)" name="institution" required>
          <UInput v-model="state.institution" placeholder="Your institution" class="w-full" />
        </UFormField>

        <UFormField label="Date of Birth" name="dateOfBirth" required>
          <div class="relative w-full">
            <UInput
              v-model="state.dateOfBirth"
              type="date"
              class="w-full [&_input::-webkit-calendar-picker-indicator]:opacity-0 [&_input::-webkit-calendar-picker-indicator]:absolute [&_input::-webkit-calendar-picker-indicator]:right-3 [&_input::-webkit-calendar-picker-indicator]:w-4 [&_input::-webkit-calendar-picker-indicator]:h-4 [&_input::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <UIcon
              name="i-ph-calendar-dots-bold"
              class="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>
        </UFormField>

        <UFormField label="Gender" name="gender" required>
          <URadioGroup
            v-model="state.gender"
            :items="GENDER_OPTIONS"
            value-key="value"
            label-key="label"
          />
        </UFormField>

        <div class="space-y-3">
          <UFormField label="Where did you find out about the Rise Young Leaders Summit 2026 program?" name="discoverSource" required>
            <URadioGroup
              v-model="state.discoverSource"
              :items="DISCOVER_SOURCES"
              value-key="value"
              label-key="label"
            />
          </UFormField>

          <UFormField v-if="state.discoverSource === 'OTHER'" name="discoverOtherText">
            <UInput v-model="state.discoverOtherText" placeholder="Please specify" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Which type of scholarship/invitation you choose" name="scholarshipType" required>
          <URadioGroup
            v-model="state.scholarshipType"
            :items="SCHOLARSHIP_TYPES"
            value-key="value"
            label-key="label"
          />
        </UFormField>

        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton type="submit" class="px-6">
            Next
          </UButton>
        </div>
      </div>
    </UForm>
  </section>
</template>
