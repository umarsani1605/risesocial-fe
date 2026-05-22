<script setup lang="ts">
definePageMeta({ layout: 'empty-white' })

useSeoMeta({ title: 'RYLS Fully Funded - Rise Social' })
useHead({ bodyAttrs: { class: 'ryls-blue-theme' } })

const store = useRylsRegistration()
const router = useRouter()
const toast = useToast()
const { submit } = useRylsSubmission()
const { deleteDraft, resumeToken } = useRylsDraft()
const { trackMetaEvent } = useMetaTracking()
const isSubmitting = ref(false)
const submitted = ref(false)

onMounted(() => {
  if (
    !store.step1.fullName
    || store.step1.scholarshipType !== 'FULLY_FUNDED'
    || !store.payment.id
    || store.payment.status !== 'PAID'
  ) {
    router.push('/programs/rise-young-leaders-summit/registration')
  }
})

const onBack = () => router.push('/programs/rise-young-leaders-summit/registration/payment')

function getRylsUserData() {
  const [firstName, ...lastNameParts] = store.step1.fullName.trim().split(/\s+/)

  return {
    email: store.step1.email,
    phone: store.step1.whatsapp,
    firstName,
    lastName: lastNameParts.join(' ')
  }
}

const onNext = async () => {
  if (isSubmitting.value || submitted.value) {
    return
  }

  isSubmitting.value = true
  try {
    const submission = await submit(resumeToken.value ?? undefined)
    if (!submission) {
      toast.add({ title: 'Failed to submit registration', color: 'error' })
      return
    }

    submitted.value = true
    store.setSubmissionCompleted(true)
    void trackMetaEvent({
      eventName: 'CompleteRegistrationStep3',
      customData: {
        content_name: 'Fully Funded',
        content_category: 'RYLS Registration'
      },
      userData: getRylsUserData()
    })
    await deleteDraft()
    await router.push('/programs/rise-young-leaders-summit/registration/success')
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error, 'Failed to submit registration'), color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UPageSection :ui="{ container: 'py-10 md:py-12' }">
    <div class="mx-auto max-w-xl">
      <div class="mb-6">
        <NuxtImg
          src="/images/rise-young-leaders/2026/banner_ryls.jpg"
          alt="Rise Young Leaders Summit Japan 2026 banner"
          class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
        />
      </div>
      <header class="space-y-3 my-8">
        <h1 class="text-2xl md:text-3xl font-semibold mb-6">
          Fully Funded Registration & Essay Submission
        </h1>
        <div class="text-sm space-y-2">
          Ideal for driven students and young professionals eager to seize this transformative experience in Climate Change Leadership.
        </div>
      </header>

      <hr class="my-6 border-gray-200">

      <div class="space-y-2">
        <div class="font-semibold">
          Please submit your essay here:
          <a href="https://s.id/EssaySubmissionRYLS26" class="underline text-primary" target="_blank">https://s.id/EssaySubmissionRYLS26</a>
        </div>
        <div class="text-sm text-muted">
          If you have questions or concerns, contact us at
          <a href="mailto:risesocial.official@gmail.com" class="underline text-primary" target="_blank">risesocial.official@gmail.com.</a>
        </div>
      </div>

      <hr class="my-6 border-gray-200">

      <div class="flex justify-end gap-3 pt-8">
        <UButton type="button" variant="light" class="px-6" @click="onBack">
          Back
        </UButton>
        <UButton type="button" class="px-6" :loading="isSubmitting" :disabled="isSubmitting || submitted" @click="onNext">
          Submit
        </UButton>
      </div>
    </div>
  </UPageSection>
</template>
