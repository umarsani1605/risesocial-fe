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

let metaPixelProxy: ReturnType<typeof useScriptMetaPixel>['proxy'] | undefined
if (academy.value.pixel_id) {
  try {
    const { proxy } = useScriptMetaPixel({ id: academy.value.pixel_id })
    metaPixelProxy = proxy
  } catch {
    // meta pixel script unavailable
  }
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

// Check if already enrolled, then auto-open snap
onMounted(async () => {
  metaPixelProxy?.fbq('track', 'InitiateCheckout', {
    content_ids: [String(pricing.value!.id)],
    content_name: academy.value.title,
    content_type: 'product',
    value: pricing.value!.discount_price,
    currency: 'IDR'
  })

  try {
    const result = await checkEnrollment(academy.value.id)
    if (result.enrolled) {
      toast.add({ title: 'You are already enrolled in this academy', color: 'info' })
      router.replace(`/academy/${academySlug}`)
      return
    }
  } catch {
    // silently fail
  }

  await onPay()
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
        metaPixelProxy?.fbq('track', 'Purchase', {
          content_ids: [String(pricing.value!.id)],
          content_name: academy.value.title,
          content_type: 'product',
          value: pricing.value!.discount_price,
          currency: 'IDR'
        })
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
    toast.add({ title: getApiErrorMessage(error, 'Failed to process payment'), color: 'error' })
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-t from-orange-50 to-white flex items-center justify-center p-4 sm:p-8"
  >
    <UPageCard
      class="w-full max-w-6xl rounded-xl shadow-subtle overflow-hidden"
      :ui="{ container: 'p-0!' }"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        <!-- Left panel: order summary -->
        <aside class="bg-primary text-white flex flex-col gap-8 px-8 py-10 lg:px-12 lg:py-12">
          <UButton
            to="/academy"
            variant="ghost"
            color="neutral"
            icon="i-lucide-arrow-left"
            class="self-start text-white hover:bg-white/10 hover:text-white -ml-2"
          >
            Back
          </UButton>

          <div class="max-w-md">
            <NuxtImg
              :src="academy.image_url"
              :alt="academy.title"
              width="160"
              height="160"
              class="rounded-xl object-cover size-40"
            />
            <h1 class="mt-6 text-2xl lg:text-3xl font-bold leading-tight">{{ academy.title }}</h1>
            <p class="mt-3 text-2xl font-semibold">{{ formatPrice(pricing!.discount_price) }}</p>
          </div>
          <dl class="space-y-3 text-sm">
            <hr class="my-8 border-white/15" />
            <div class="flex justify-between text-white/80">
              <dt>Subtotal</dt>
              <dd>{{ formatPrice(pricing!.discount_price) }}</dd>
            </div>
            <div class="pt-3 border-t border-white/15 flex justify-between font-semibold text-base">
              <dt>Total</dt>
              <dd>{{ formatPrice(pricing!.discount_price) }}</dd>
            </div>
          </dl>
        </aside>

        <!-- Right panel: payment -->
        <section class="flex flex-col">
          <UAlert
            v-if="paymentError"
            color="error"
            variant="subtle"
            icon="i-ph-info-bold"
            title="Payment Error"
            :description="paymentError"
            class="mb-6"
          />

          <UAlert
            v-if="paymentStatus === 'paid'"
            color="success"
            variant="subtle"
            icon="i-ph-check-circle-bold"
            title="Payment Successful"
            :description="`You are now enrolled in ${academy.title}`"
            class="mb-6"
          />

          <UAlert
            v-else-if="paymentStatus === 'pending'"
            color="warning"
            variant="subtle"
            icon="i-ph-clock-bold"
            title="Payment Pending"
            description="Please complete your payment to finish enrollment"
            class="mb-6"
          />

          <ClientOnly>
            <div id="snap-container" class="w-full" />
          </ClientOnly>

          <UButton
            v-if="paymentStatus === 'paid'"
            label="Go to Dashboard"
            color="primary"
            size="lg"
            block
            class="mt-6"
            @click="navigateTo('/dashboard/academy')"
          />

          <p class="text-xs text-muted text-center mt-6">
            Having trouble? Contact us at
            <a href="mailto:risesocial.official@gmail.com" class="underline"
              >risesocial.official@gmail.com</a
            >
          </p>
        </section>
      </div>
    </UPageCard>
  </div>
</template>

<style>
#snap-container iframe {
  width: 100% !important;
}
</style>
