<script setup>
import { useRylsPayment } from '@/composables/useRylsPayment';

definePageMeta({
  layout: 'blank',
});

const route = useRoute();
const router = useRouter();
const submissionId = route.query.id;

// Redirect to registration if no submission ID
if (!submissionId) {
  router.push('/programs/rise-young-leaders-summit/registration');
}

// Payment integration on button click
const { createTransaction, getRegistrationBySubmissionId } = useRylsPayment();
const redirectUrl = ref('');
const creating = ref(false);
const errorMsg = ref('');
const cachedRegistrationId = ref(null);

onMounted(async () => {
  try {
    const reg = await getRegistrationBySubmissionId(submissionId);
    cachedRegistrationId.value = reg?.id || reg?.registration?.id || null;
  } catch (e) {
    // ignore; will retry on click
  }
});

const handlePay = async () => {
  creating.value = true;
  errorMsg.value = '';
  try {
    let regId = cachedRegistrationId.value;
    if (!regId) {
      const reg = await getRegistrationBySubmissionId(submissionId);
      regId = reg?.id || reg?.registration?.id || null;
    }
    if (!regId) throw new Error('Registration not found');

    const trx = await createTransaction(regId);
    redirectUrl.value = trx?.redirect_url || '';
    if (redirectUrl.value && process.client) {
      window.open(redirectUrl.value, '_blank', 'noopener,noreferrer');
    }
  } catch (e) {
    errorMsg.value = e?.message || 'Failed to create invoice';
  } finally {
    creating.value = false;
  }
};
</script>

<template>
  <section class="mx-auto max-w-xl px-4 py-10 md:py-12">
    <!-- Cover Image -->
    <div class="mb-8">
      <img src="/images/ryls_banner.jpg" alt="Rise Young Leaders Summit Japan 2025" class="w-full h-48 object-cover rounded-lg shadow-md" />
    </div>

    <!-- Success Message -->
    <div class="text-center space-y-6">
      <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <div class="space-y-3">
        <h1 class="text-2xl font-bold text-gray-900">Registration Successful!</h1>
        <p class="text-lg text-gray-600">Thank you for registering for Rise Young Leaders Summit Japan 2025</p>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="space-y-2">
          <p class="font-medium text-blue-900">Your Submission ID:</p>
          <p class="text-lg font-mono text-blue-700 bg-white px-3 py-2 rounded border">{{ submissionId }}</p>
          <p class="text-sm text-blue-600">Please save this ID for your records</p>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
        <h3 class="font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ol class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start">
            <span class="inline-block w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5"
              >1</span
            >
            <span>You will receive a confirmation email within 24 hours</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5"
              >2</span
            >
            <span>Our team will review your application</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5"
              >3</span
            >
            <span>Results will be announced via email</span>
          </li>
        </ol>
      </div>

      <div class="space-y-4">
        <div class="flex justify-center">
          <Button :disabled="creating" @click="handlePay" class="px-8">
            {{ creating ? 'Processing...' : 'PAY' }}
          </Button>
        </div>
        <div v-if="errorMsg" class="text-red-600 text-sm text-center">{{ errorMsg }}</div>
        <div v-if="redirectUrl" class="text-center mt-2">
          <a :href="redirectUrl" target="_blank" rel="noopener" class="text-blue-600 underline break-all">{{ redirectUrl }}</a>
        </div>
        <p class="text-sm text-gray-600">
          If you have any questions, please contact us at
          <a href="mailto:risesocial.official@gmail.com" class="text-blue-600 underline">risesocial.official@gmail.com</a>
        </p>

        <div class="flex justify-center gap-4">
          <Button @click="router.push('/')" variant="outline" class="px-6"> Back to Home </Button>
          <Button @click="router.push('/programs')" class="px-6"> View Other Programs </Button>
        </div>
      </div>
    </div>
  </section>
</template>
