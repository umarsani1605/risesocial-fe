<script setup>
import { useRylsRegistrationStore } from '@/store/rylsRegistration';

definePageMeta({
  layout: 'blank',
});

const router = useRouter();

if (useRylsRegistrationStore().payment.status !== 'PAID') {
  router.push('/programs/rise-young-leaders-summit/registration');
}

const onBack = () => router.push('/');
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-24 md:py-32" data-layout="blank">
    <div class="text-center space-y-8">
      <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Registration Successful!</h1>
      <div class="space-y-3">
        <p class="text-sm text-gray-600">Thank you for registering for Rise Young Leaders Summit Japan 2025.</p>
        <p class="text-sm text-gray-600">If you have questions or concerns, contact us at risesocial.official@gmail.com.</p>
        <p class="text-sm text-gray-600">See you in Japan! 🇯🇵</p>
      </div>
      <Button type="button" variant="outline" size="sm" @click="onBack">Back to Home</Button>
    </div>
  </section>
</template>
