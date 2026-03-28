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

const pricing = computed(() => academy.value.pricing?.find((p) => p.id === pricingId))

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
        if (transactionCode.value)
          await syncTransactionStatus(transactionCode.value).catch(() => {})
        paymentStatus.value = 'paid'
        toast.add({ title: 'Enrollment successful', color: 'success' })
      },
      onPending: async () => {
        if (transactionCode.value)
          await syncTransactionStatus(transactionCode.value).catch(() => {})
        paymentStatus.value = 'pending'
        toast.add({ title: 'Payment pending, please complete payment', color: 'warning' })
      },
      onError: (err) => {
        paymentStatus.value = 'failed'
        const errMsg =
          typeof err?.message === 'string' ? err.message : 'Payment failed. Please try again.'
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
  <div class="mx-auto">
    <UAlert
      v-if="paymentError"
      color="error"
      variant="subtle"
      icon="i-ph-info-bold"
      title="Payment Error"
      :description="paymentError"
    />

    <UCard :ui="{ root: 'w-[500px]', body: 'border-t border-default' }">
      <template #header>
        <h1 class="text-2xl font-bold">Complete Your Payment</h1>
      </template>
      <div class="space-y-4">
        <!-- Academy info row -->
        <div class="flex gap-4">
          <NuxtImg
            :src="academy.image_url"
            :alt="academy.title"
            width="56"
            height="56"
            class="rounded-lg object-cover shrink-0 size-14"
          />
          <div class="flex-1">
            <p class="font-semibold leading-tight truncate">{{ academy.title }}</p>
            <p v-if="academy.active_cohort" class="text-sm text-muted mt-0.5 truncate">
              {{ academy.active_cohort.name }}
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="font-semibold">{{ formatPrice(pricing!.discount_price) }}</p>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Payment widget / status -->
        <UAlert
          v-if="paymentStatus === 'paid'"
          color="success"
          variant="subtle"
          icon="i-ph-check-circle-bold"
          title="Payment Successful"
          :description="`You are now enrolled in ${academy.title}`"
        />

        <UAlert
          v-else-if="paymentStatus === 'pending'"
          color="warning"
          variant="subtle"
          icon="i-ph-clock-bold"
          title="Payment Pending"
          description="Please complete your payment to finish enrollment"
        />

        <template v-else>
          <p v-if="snapDisplayed" class="text-sm text-muted">
            After selecting a payment method, complete the payment below.
          </p>
        </template>

        <ClientOnly>
          <div id="snap-container" class="max-h-[400px] overflow-hidden" />
        </ClientOnly>

        <!-- Subtotal + Total -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{{ formatPrice(pricing!.discount_price) }}</span>
          </div>
          <div class="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{{ formatPrice(pricing!.discount_price) }}</span>
          </div>
        </div>
      </div>

      <!-- Pay Now -->
      <template #footer>
        <UButton
          v-if="!snapDisplayed && paymentStatus === null"
          label="Pay Now"
          color="primary"
          size="lg"
          :loading="isProcessingPayment"
          :disabled="isProcessingPayment"
          block
          @click="onPay"
        />
        <UButton
          v-if="paymentStatus === 'paid'"
          label="Go to Dashboard"
          color="primary"
          size="lg"
          block
          @click="navigateTo('/dashboard/academy')"
        />

        <p class="text-xs text-muted text-center mt-4">
          Having trouble? Contact us at
          <a href="mailto:risesocial.official@gmail.com" class="underline"
            >risesocial.official@gmail.com</a
          >
        </p>
      </template>
    </UCard>
  </div>
</template>

<style>
#snap-container iframe {
  width: 100% !important;
}
</style>
