<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'RYLS Payment - Rise Social' })
useHead({ bodyAttrs: { class: 'ryls-blue-theme' } })

const store = useRylsRegistration()
const router = useRouter()
const toast = useToast()
const {
  createTransaction,
  openSnapEmbed,
  isLoading: isProcessingPayment,
  error: paymentError
} = useRylsPayment()
const { uploadPaymentProof, isUploading, uploadError, uploadProgress } = useRylsFileUpload()
const { submit } = useRylsSubmission()
const { loadDraft, deleteDraft, resumeToken } = useRylsDraft()

const proofFile = ref<File | null>(null)
const proofFileId = ref<string | null>(null)
const paypalClicked = ref(false)
const snapDisplayed = ref(false)
const isMidtransProcessing = ref(false)
const midtransError = ref('')
const validationError = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

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
    }
  }
})

const resetFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  proofFile.value = null
  proofFileId.value = null
}

const createPaypalTransaction = async (e: Event) => {
  try {
    store.setPaymentType('PAYPAL')

    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) {
      resetFileInput()
      return
    }

    proofFile.value = file

    const savedFile = await uploadPaymentProof(file)
    if (!savedFile?.id) {
      throw new Error('Failed to upload payment proof')
    }

    const transaction = await createTransaction({
      type: 'PAYPAL',
      data: {
        ...store.getStep1Data,
        paymentProof: savedFile.id
      }
    })

    store.setPaymentId(transaction.payment_id)
    store.setPaymentType('PAYPAL')
    store.setPaymentStatus('PAID')
    store.setPaymentProof(savedFile.id as unknown as File)
    store.setMidtransData(null as unknown as Record<string, unknown>)
  } catch (error: unknown) {
    store.setPaymentStatus('FAILED')
    const message = error instanceof Error ? error.message : 'An error occurred'
    toast.add({ title: message, color: 'error' })
    resetFileInput()
  } finally {
    validationError.value = false
  }
}

const createMidtransTransaction = async () => {
  try {
    validationError.value = false
    isMidtransProcessing.value = true
    midtransError.value = ''

    const transaction = await createTransaction({
      type: 'MIDTRANS',
      data: store.getStep1Data
    })

    if (!transaction.token) {
      throw new Error('Failed to create payment transaction')
    }

    snapDisplayed.value = true

    await nextTick()

    openSnapEmbed(transaction.token, {
      onSuccess: (result) => {
        validationError.value = false
        store.setPaymentId(transaction.payment_id)
        store.setPaymentType('MIDTRANS')
        store.setPaymentStatus('PAID')
        store.setPaymentProof(null as unknown as File)
        store.setMidtransData(result)
      },
      onPending: () => {
        store.setPaymentType('MIDTRANS')
        store.setPaymentStatus('PENDING')
      },
      onError: (err) => {
        store.setPaymentStatus('FAILED')
        const errMsg = (err as Record<string, unknown>).message
        midtransError.value =
          (typeof errMsg === 'string' ? errMsg : '') || 'Payment failed. Please try again.'
      },
      onClose: () => {
        snapDisplayed.value = false
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process payment'
    midtransError.value = message
    store.setPaymentStatus('FAILED')
    toast.add({ title: message, color: 'error' })
  } finally {
    isMidtransProcessing.value = false
    store.setPaymentType('MIDTRANS')
    store.setPaymentStatus('PENDING')
  }
}

const onBack = () => router.back()

const openPayPal = () => {
  validationError.value = false
  paypalClicked.value = true
  if (import.meta.client) {
    window.open('https://paypal.me/RiseSocialOfficial', '_blank', 'noopener,noreferrer')
  }
}

const onSubmit = async () => {
  try {
    const { proxy } = useScriptMetaPixel()
    if (store.step1.scholarshipType === 'FULLY_FUNDED') {
      proxy.fbq('track', 'CompleteRegistrationStep2', {
        content_name: 'Fully Funded'
      })
    } else {
      proxy.fbq('track', 'CompleteRegistrationStep3', {
        content_name: 'Self Funded'
      })
    }
  } catch {
    // module not available
  }

  try {
    if (!store.payment.type || store.payment.status !== 'PAID') {
      validationError.value = true
      return
    }

    const submission = await submit(resumeToken.value ?? undefined)

    if (submission) {
      await deleteDraft()
      store.resetAll()
      if (store.step1.scholarshipType === 'FULLY_FUNDED') {
        router.push('/programs/rise-young-leaders-summit/registration/fully-funded')
      }
      else {
        router.push('/programs/rise-young-leaders-summit/registration/success')
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit registration'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-10 md:py-12">
    <div
      v-if="midtransError || paymentError"
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ midtransError || paymentError }}
          </h3>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <NuxtImg
        src="/images/rise-young-leaders/2026/banner_ryls.jpg"
        alt="Rise Young Leaders Summit Japan 2026 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
      />
    </div>

    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-4">Complete Your Registration Payment</h1>
      <p class="text-sm text-gray-700">
        To complete your registration, please proceed with the payment using one of the following
        methods. International participants are recommended to use PayPal or Credit Card.
      </p>
    </header>

    <hr class="my-6 border-gray-200" />

    <div class="flex items-center justify-between mb-6 text-gray-700">
      <p class="text-sm">
        Your selection:
        <span class="font-bold">{{
          store.getStep1Data.scholarshipType === 'FULLY_FUNDED' ? 'Fully Funded' : 'Self Funded'
        }}</span>
      </p>
      <p class="font-bold text-lg">
        {{ store.getStep1Data.scholarshipType === 'FULLY_FUNDED' ? '$10' : '$800' }}
      </p>
    </div>

    <hr class="my-6 border-gray-200" />

    <form class="space-y-8 text-gray-700" @submit.prevent="onSubmit">
      <div class="space-y-6 p-4 border rounded-lg border-gray-100">
        <div
          class="flex flex-col-reverse md:flex-row items-start md:items-center justify-start md:justify-between gap-4"
        >
          <h2 class="text-lg font-semibold">PayPal</h2>
          <NuxtImg src="/images/payment-logo/paypal.png" alt="PayPal" class="h-8" />
        </div>
        <div class="space-y-4">
          <p class="text-sm">
            Click the button below, you will be redirected to PayPal to complete your payment. After
            you finish the payment, please upload the payment proof here.
          </p>
          <UButton
            type="button"
            variant="outline"
            class="flex items-center gap-2"
            @click="openPayPal"
          >
            <UIcon name="i-ph-arrow-square-out-bold" class="size-6" />
            Open PayPal
          </UButton>
          <div v-if="paypalClicked" class="space-y-2">
            <label class="text-sm font-semibold"
              >Upload Payment Receipt (PDF/Image, max 10MB)</label
            >
            <input
              ref="fileInputRef"
              type="file"
              accept="application/pdf,image/jpeg,image/jpg,image/png"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              @change="createPaypalTransaction"
            />
            <p v-if="uploadError" class="text-sm text-red-600 mt-2">
              {{ uploadError }}
            </p>
          </div>
        </div>
        <div v-if="validationError" class="text-sm text-red-600 mt-2">
          Please complete the payment and upload the proof.
        </div>
      </div>

      <div class="space-y-4 p-6 border border-gray-100 rounded-lg">
        <div
          class="flex flex-col-reverse md:flex-row items-start md:items-center justify-start md:justify-between gap-4"
        >
          <h2 class="text-lg font-semibold">Credit Card or Bank Transfer</h2>
          <NuxtImg src="/images/payment-logo/credit-card.png" alt="Credit Card" class="h-8" />
        </div>
        <div class="space-y-4">
          <p class="text-sm">
            Click the button below to create invoice. Please note that bank transfer only receives
            payment in Indonesian Rupiah (IDR).
          </p>
          <p v-if="snapDisplayed" class="text-sm">
            <span class="font-semibold">Note:</span> after you selected a bank transfer method, you
            can't switch to another method. After payment, click Check Payment button first.
          </p>
          <UButton
            v-if="!snapDisplayed"
            :disabled="isMidtransProcessing"
            type="button"
            variant="outline"
            class="flex items-center gap-2"
            @click="createMidtransTransaction"
          >
            <UIcon name="i-ph-credit-card-bold" class="size-6" />
            {{ isMidtransProcessing ? 'Processing...' : 'Create Invoice' }}
          </UButton>
          <ClientOnly>
            <div id="snap-container" />
          </ClientOnly>
        </div>
        <div v-if="validationError" class="text-sm text-red-600 mt-2">
          Please select a method and make sure the payment is successful.
        </div>
      </div>

      <p class="text-sm text-gray-700">
        If you have a trouble with the payment process, please contact us at
        <a href="mailto:risesocial.official@gmail.com" class="underline"
          >risesocial.official@gmail.com</a
        >.
      </p>

      <div class="flex justify-end gap-4 pt-4">
        <UButton type="button" variant="outline" @click="onBack"> Back </UButton>
        <UButton type="submit">
          {{ store.step1.scholarshipType === 'FULLY_FUNDED' ? 'Next' : 'Submit' }}
        </UButton>
      </div>
    </form>
  </section>
</template>

<style>
#snap-container iframe {
  width: 100% !important;
}
</style>
