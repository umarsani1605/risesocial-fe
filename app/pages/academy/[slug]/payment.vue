<script setup lang="ts">
import type { Academy } from '@/types'

definePageMeta({
  layout: 'empty',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const academySlug = route.params.slug as string
const pricingId = Number(route.query.pricing_id)

if (!academySlug || !pricingId) {
  throw createError({ statusCode: 400, statusMessage: 'Missing academy or pricing information' })
}

const { api } = useApi()
const { data: academyData, error: academyError } = await useAsyncData(
  `academy:${academySlug}`,
  () => api<ApiResponse<Academy>>(`/academies/${academySlug}`)
)

if (academyError.value || !academyData.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Academy not found' })
}

const academy = computed(() => academyData.value!.data)

const pricing = computed(() =>
  academy.value.pricing?.find(p => p.id === pricingId)
)

if (!pricing.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pricing tier not found' })
}

useSeoMeta({
  title: computed(() => `Payment - ${academy.value.title} - Rise Social`)
})


const {
  createEnrollment,
  openSnapEmbed,
  checkEnrollment,
  syncTransactionStatus,
  isLoading: isProcessingPayment,
  error: paymentError
} = useAcademyPayment()

const snapDisplayed = ref(false)
const paymentStatus = ref<string | null>(null)
const transactionCode = ref<string | null>(null)

// Check if already enrolled
onMounted(async () => {
  try {
    const result = await checkEnrollment(academy.value.id)
    if (result.enrolled) {
      toast.add({ title: 'You are already enrolled in this academy', color: 'info' })
      router.replace(`/academy/${academySlug}`)
    }
  } catch {
    // silently fail
  }
})

const onPay = async () => {
  try {
    const result = await createEnrollment(academy.value.id, pricingId)

    if (!result.token) {
      throw new Error('Failed to create payment transaction')
    }

    transactionCode.value = result.transaction_code
    snapDisplayed.value = true
    await nextTick()

    openSnapEmbed(result.token, {
      onSuccess: async () => {
        if (transactionCode.value) await syncTransactionStatus(transactionCode.value).catch(() => {})
        paymentStatus.value = 'paid'
        toast.add({ title: 'Enrollment successful', color: 'success' })
      },
      onPending: async () => {
        if (transactionCode.value) await syncTransactionStatus(transactionCode.value).catch(() => {})
        paymentStatus.value = 'pending'
        toast.add({ title: 'Payment pending, please complete payment', color: 'warning' })
      },
      onError: (err) => {
        paymentStatus.value = 'failed'
        const errMsg = typeof err?.message === 'string' ? err.message : 'Payment failed. Please try again.'
        toast.add({ title: errMsg as string, color: 'error' })
      },
      onClose: () => {
        snapDisplayed.value = false
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process payment'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
    <div class="w-full max-w-xl">
      <div class="max-w-xl mx-auto">
        <div v-if="paymentError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ paymentError }}</p>
        </div>

        <UCard>
          <div class="p-6 space-y-6">
            <h1 class="text-2xl font-bold">Complete Your Payment</h1>

            <div class="space-y-3 text-sm text-gray-700">
              <div class="flex items-center justify-between">
                <span>Program</span>
                <span class="font-semibold">{{ academy.title }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Tier</span>
                <span class="font-semibold">{{ pricing!.name }}</span>
              </div>
              <div v-if="pricing!.original_price !== pricing!.discount_price" class="flex items-center justify-between">
                <span>Original Price</span>
                <span class="line-through text-muted">{{ pricing!.formatted_original_price || formatPrice(pricing!.original_price) }}</span>
              </div>
              <hr class="border-gray-200" />
              <div class="flex items-center justify-between text-base">
                <span class="font-semibold">Total</span>
                <span class="font-bold text-lg">{{ pricing!.formatted_discount_price || formatPrice(pricing!.discount_price) }}</span>
              </div>
            </div>

            <div v-if="paymentStatus === 'paid'" class="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <UIcon name="i-lucide-check-circle" class="size-8 text-green-600 mb-2" />
              <p class="font-semibold text-green-800">Payment Successful</p>
              <p class="text-sm text-green-700 mt-1">You are now enrolled in {{ academy.title }}</p>
              <UButton
                label="Go to Dashboard"
                color="primary"
                class="mt-4"
                @click="navigateTo('/dashboard')"
              />
            </div>

            <div v-else-if="paymentStatus === 'pending'" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <UIcon name="i-lucide-clock" class="size-8 text-yellow-600 mb-2" />
              <p class="font-semibold text-yellow-800">Payment Pending</p>
              <p class="text-sm text-yellow-700 mt-1">Please complete your payment to finish enrollment</p>
            </div>

            <template v-else>
              <UButton
                v-if="!snapDisplayed"
                label="Pay Now"
                color="primary"
                size="lg"
                :loading="isProcessingPayment"
                :disabled="isProcessingPayment"
                class="w-full flex items-center justify-center"
                @click="onPay"
              />

              <p v-if="snapDisplayed" class="text-sm text-muted">
                After selecting a payment method, complete the payment below. Click <strong>Check Payment</strong> when done.
              </p>
            </template>

            <ClientOnly>
              <div id="snap-container" />
            </ClientOnly>

            <p class="text-sm text-muted">
              Having trouble? Contact us at
              <a href="mailto:risesocial.official@gmail.com" class="underline">risesocial.official@gmail.com</a>
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style>
#snap-container iframe {
  width: 100% !important;
}
</style>
