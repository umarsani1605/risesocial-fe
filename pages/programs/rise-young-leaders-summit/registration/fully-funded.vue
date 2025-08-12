<script setup>
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { useRouter } from 'vue-router';
import { useRylsRegistrationStore } from '@/store/rylsRegistration';

definePageMeta({ layout: 'blank' });

const store = useRylsRegistrationStore();
const router = useRouter();

onMounted(() => {
  if (store.step1.scholarshipType !== 'FULLY_FUNDED') {
    return router.push('/programs/rise-young-leaders-summit/registration');
  }
});

const onBack = () => router.push('/programs/rise-young-leaders-summit/registration');
const onNext = () => router.push('/programs/rise-young-leaders-summit/registration/payment');
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-10 md:py-12">
    <div class="mb-6">
      <NuxtImg
        src="/images/ryls_banner.jpg"
        alt="Rise Young Leaders Summit Japan 2025 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
      />
    </div>
    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-6">Fully Funded Registration & Essay Submission</h1>
      <div class="text-sm space-y-2">
        Ideal for driven students and young professionals eager to seize this transformative experience in Climate Change Leadership.
      </div>
    </header>

    <hr class="my-6 border-gray-200" />

    <div class="space-y-2">
      <div class="font-semibold">
        Please submit your essay here:
        <a href="https://s.id/EssaySubmissionRYLS25" class="underline text-primary">https://s.id/EssaySubmissionRYLS25</a>
      </div>
      <div class="text-sm text-muted-foreground">
        If you have questions or concerns, contact us at
        <a href="mailto:risesocial.official@gmail.com">risesocial.official@gmail.com.</a>
      </div>
    </div>

    <hr class="my-6 border-gray-200" />

    <div class="flex justify-end gap-3 pt-8">
      <Button type="button" variant="outline" @click="onBack" class="px-6">Back</Button>
      <Button type="button" @click="onNext" class="px-6">Next</Button>
    </div>
  </section>
</template>
