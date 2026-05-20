<script setup lang="ts">
definePageMeta({ layout: 'empty-white' })

useSeoMeta({ title: 'Registration Complete - Rise Social' })
useHead({ bodyAttrs: { class: 'ryls-blue-theme' } })

const store = useRylsRegistration()
const router = useRouter()
const { trackMetaEvent } = useMetaTracking()

if (!store.submissionCompleted || store.payment.status !== 'PAID') {
  router.push('/programs/rise-young-leaders-summit/registration')
}

onMounted(() => {
  const [firstName, ...lastNameParts] = store.step1.fullName.trim().split(/\s+/)
  const isFullyFunded = store.step1.scholarshipType === 'FULLY_FUNDED'

  void trackMetaEvent({
    eventName: 'Lead',
    customData: {
      content_name: isFullyFunded ? 'Fully Funded' : 'Self Funded',
      content_category: 'RYLS Registration',
      value: isFullyFunded ? 15 : 750,
      currency: 'USD'
    },
    userData: {
      email: store.step1.email,
      phone: store.step1.whatsapp,
      firstName,
      lastName: lastNameParts.join(' ')
    }
  })
  store.setSubmissionCompleted(false)
})

function onBack() {
  store.resetAll()
  router.push('/')
}
</script>

<template>
  <UPageSection :ui="{ container: 'py-24 md:py-32' }">
    <div class="mx-auto max-w-xl text-center space-y-8">
      <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">
        Registration Successful!
      </h1>
      <div class="space-y-3">
        <p class="text-sm text-gray-600">
          Thank you for registering for Rise Young Leaders Summit Japan 2026.
        </p>
        <p class="text-sm text-gray-600">
          If you have questions or concerns, contact us at risesocial.official@gmail.com.
        </p>
        <p class="text-sm text-gray-600">
          See you in Japan! 🇯🇵
        </p>
      </div>
      <UButton type="button" variant="outline" size="sm" @click="onBack">
        Back to Home
      </UButton>
    </div>
  </UPageSection>
</template>
