<script setup>
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRylsRegistrationStore } from '@/store/rylsRegistration';
import { useRylsPayment } from '@/composables/useRylsPayment';
import { useRylsSubmission } from '@/composables/useRylsSubmission';

definePageMeta({ layout: 'blank' });

const store = useRylsRegistrationStore();
const router = useRouter();
const route = useRoute();
const { createTransaction, openSnapEmbed, isLoading: isProcessingPayment, error: paymentError } = useRylsPayment();
const { uploadPaymentProof, isUploading, uploadError, uploadProgress } = useFileUpload();

const proofFile = ref(/** @type {File|null} */ (null));
const proofFileId = ref(null);
const paypalClicked = ref(false);
const snapDisplayed = ref(false);
const isMidtransProcessing = ref(false);
const midtransError = ref('');
const validationError = ref(false);

const createPaypalTransaction = async (e, componentField) => {
  try {
    isUploading.value = true;

    store.setPaymentType('PAYPAL');

    const file = e.target.files?.[0];
    if (!file) {
      resetFileInput(componentField);
      return;
    }

    proofFile.value = file;
    componentField['onUpdate:modelValue'](file.name);

    const savedFile = await uploadPaymentProof(file);
    const transaction = await createTransaction({
      type: 'PAYPAL',
      data: {
        ...store.getStep1Data,
        paymentProof: savedFile.id,
      },
    });

    // Update store
    store.setPaymentId(transaction.payment_id);
    store.setPaymentType('PAYPAL');
    store.setPaymentStatus('PAID');
    store.setPaymentProof(savedFile.id);
    store.setMidtransData(null);
  } catch (error) {
    store.setPaymentStatus('FAILED');
    alert(error.message);
    resetFileInput(componentField);
  } finally {
    isUploading.value = false;
    validationError.value = false;
  }
};

const createMidtransTransaction = async () => {
  try {
    validationError.value = false;
    isMidtransProcessing.value = true;
    midtransError.value = '';

    const transaction = await createTransaction({
      type: 'MIDTRANS',
      data: store.getStep1Data,
    });

    if (!transaction.token) {
      throw new Error('Failed to create payment transaction');
    }

    snapDisplayed.value = true;

    await nextTick();

    openSnapEmbed(transaction.token, {
      onSuccess: (result) => {
        validationError.value = false;

        store.setPaymentId(transaction.payment_id);
        store.setPaymentType('MIDTRANS');
        store.setPaymentStatus('PAID');
        store.setPaymentProof(null);
        store.setMidtransData(result);
      },
      onPending: (result) => {
        store.setPaymentType('MIDTRANS');
        store.setPaymentStatus('PENDING');
      },
      onError: (error) => {
        store.setPaymentStatus('FAILED');
        midtransError.value = error.message || 'Payment failed. Please try again.';
      },
      onClose: () => {
        snapDisplayed.value = false;
      },
    });
  } catch (error) {
    midtransError.value = error.message || 'Failed to process payment';
    store.setPaymentStatus('FAILED');
    alert(error.message);
  } finally {
    isMidtransProcessing.value = false;
    store.setPaymentType('MIDTRANS');
    store.setPaymentStatus('PENDING');
  }
};

const form = useForm({
  validationSchema: null,
  initialValues: {
    proofOfPayment: '',
  },
});

const onBack = () => router.back();

const openPayPal = () => {
  validationError.value = false;
  paypalClicked.value = true;
  window.open('https://paypal.me/RiseSocialOfficial', '_blank', 'noopener,noreferrer');
};

const resetFileInput = (componentField) => {
  if (componentField) {
    componentField['onUpdate:modelValue']('');
  }
  proofFile.value = null;
  proofFileId.value = null;
};

const onSubmit = form.handleSubmit(async () => {
  try {
    if (!store.payment.type || store.payment.status !== 'PAID') {
      validationError.value = true;
      return;
    }

    const submission = await useRylsSubmission().submitRegistration(store.getAllRegistrationData);

    if (submission) {
      if (store.step1.scholarshipType === 'FULLY_FUNDED') {
        router.push('/programs/rise-young-leaders-summit/registration/fully-funded');
      } else {
        router.push('/programs/rise-young-leaders-summit/registration/success');
      }
    }
  } catch (error) {
    alert(error.message || 'Failed to submit registration');
  }
});

onMounted(() => {
  if (!store.step1.fullName) {
    return router.push('/programs/rise-young-leaders-summit/registration');
  }
});
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-10 md:py-12" data-layout="blank">
    <div v-if="midtransError || paymentError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
        src="/images/ryls_banner.jpg"
        alt="Rise Young Leaders Summit Japan 2025 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
      />
    </div>

    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-4">Complete Your Registration Payment</h1>
      <p class="text-sm text-gray-700">
        To complete your registration, please proceed with the payment using one of the following methods. International participants are recommended
        to use PayPal or Credit Card.
      </p>
    </header>

    <hr class="my-6 border-gray-200" />

    <div class="flex items-center justify-between mb-6 text-gray-700">
      <p class="text-sm">
        Your selection: <span class="font-bold">{{ store.getStep1Data.scholarshipType === 'FULLY_FUNDED' ? 'Fully Funded' : 'Self Funded' }}</span>
      </p>
      <p class="font-bold text-lg">
        {{ store.getStep1Data.scholarshipType === 'FULLY_FUNDED' ? '$15' : '$750' }}
      </p>
    </div>

    <hr class="my-6 border-gray-200" />

    <form @submit="onSubmit" class="space-y-8 text-gray-700">
      <div class="space-y-6 p-4 border rounded-lg border-gray-100">
        <div class="flex flex-col-reverse md:flex-row items-start md:items-center justify-start md:justify-between gap-4">
          <h2 class="text-lg font-semibold">PayPal</h2>
          <NuxtImg src="/images/payment-logo/paypal.png" alt="PayPal" class="h-8" />
        </div>
        <div class="space-y-4">
          <p class="text-sm">
            Click the button below, you will be redirected to PayPal to complete your payment. After you finish the payment, please upload the payment
            proof here.
          </p>
          <Button type="button" variant="outline" class="flex items-center gap-2" @click="openPayPal">
            <Icon name="lucide:external-link" class="size-6" />
            Open PayPal
          </Button>
          <FormField v-if="paypalClicked" v-slot="{ componentField }" name="proofOfPayment">
            <FormItem>
              <FormLabel class="text-sm font-semibold">Upload Payment Receipt (PDF/Image, max 10MB)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf,image/jpeg,image/jpg,image/png"
                  @change="(e) => createPaypalTransaction(e, componentField)"
                />
              </FormControl>
              <FormMessage />
              <p v-if="uploadError" class="text-sm text-red-600 mt-2">{{ uploadError }}</p>
            </FormItem>
          </FormField>
          <div></div>
        </div>
        <div v-if="validationError" class="text-sm text-red-600 mt-2">Please complete the payment and upload the proof.</div>
      </div>

      <div class="space-y-4 p-6 border border-gray-100 rounded-lg">
        <div class="flex flex-col-reverse md:flex-row items-start md:items-center justify-start md:justify-between gap-4">
          <h2 class="text-lg font-semibold">Credit Card or Bank Transfer</h2>
          <NuxtImg src="/images/payment-logo/credit-card.png" alt="Credit Card" class="h-8" />
        </div>
        <div class="space-y-4">
          <p class="text-sm">
            Click the button below to create invoice. Please note that bank transfer only receives payment in Indonesian Rupiah (IDR).
          </p>
          <p v-if="snapDisplayed" class="text-sm">
            <span class="font-semibold">Note:</span> after you selected a bank transfer method, you can't switch to another method. After payment,
            click Check Payment button first.
          </p>
          <Button
            v-if="!snapDisplayed"
            :disabled="isMidtransProcessing"
            type="button"
            variant="outline"
            class="flex items-center gap-2"
            @click="createMidtransTransaction"
          >
            <Icon name="lucide:credit-card" class="size-6" />
            {{ isMidtransProcessing ? 'Processing...' : 'Create Invoice' }}
          </Button>
          <div id="snap-container"></div>
        </div>
        <div v-if="validationError" class="text-sm text-red-600 mt-2">Please select a method and make sure the payment is successful.</div>
      </div>

      <p class="text-sm text-gray-700">
        If you have a trouble with the payment process, please contact us at
        <a href="mailto:risesocial.official@gmail.com" class="underline">risesocial.official@gmail.com</a>.
      </p>

      <div class="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" @click="onBack"> Back </Button>
        <Button type="submit"> {{ store.step1.scholarshipType === 'FULLY_FUNDED' ? 'Next' : 'Submit' }} </Button>
      </div>
    </form>
  </section>
</template>
<style>
#snap-container iframe {
  width: 100% !important;
}
</style>
