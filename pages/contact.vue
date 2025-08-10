<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Contact Us - Rise Social',
  meta: [{ name: 'description', content: 'Get in touch with Rise Social. Send us a message or visit our office in Bandung, West Java.' }],
});

// Form state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

// Handle form submission
const submitForm = () => {
  // Here you would typically send the form data to your backend
  console.log('Form submitted:', form.value);
  // Reset form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  // Show success message (you can implement toast notification here)
  alert('Pesan berhasil dikirim! Terima kasih telah menghubungi kami.');
};
</script>

<template>
  <section class="relative md:h-screen mt-20 pb-8 md:pb-72">
    <div class="relative h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126916.58532317828!2d107.57311709999999!3d-6.917464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1699000000000!5m2!1sen!2sid"
        width="100%"
        height="100%"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="relative md:absolute inset-0 w-full h-96 lg:h-full"
      ></iframe>
      <div class="relative md:absolute container-wrapper left-0 right-0 bottom-0 md:translate-y-1/2 bg-white md:rounded-3xl md:shadow-xl p-8 lg:p-12">
        <h1 class="heading-section mb-8">Contact Us</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div class="space-y-4">
              <div>
                <span class="flex items-center gap-4 mb-2">
                  <Icon name="lucide:instagram" class="size-4!" />
                  <h3 class="heading-card-sm text-base">Instagram</h3>
                </span>
                <a href="https://www.instagram.com/risesocial.official/" class="pl-8 hover:text-primary transition-colors"> @risesocial.official </a>
              </div>
              <div>
                <span class="flex items-center gap-4 mb-2">
                  <Icon name="lucide:mail" class="size-4!" />
                  <h3 class="heading-card-sm text-base">Email</h3>
                </span>
                <a href="mailto:risesocial.official@gmail.com" class="pl-8 hover:text-primary transition-colors"> risesocial.official@gmail.com </a>
              </div>
              <div>
                <span class="flex items-center gap-4 mb-2">
                  <Icon name="lucide:map-pin" class="size-4!" />
                  <h3 class="heading-card-sm text-base">Address</h3>
                </span>
                <p class="inline pl-8">Bandung, West Java 40286, ID</p>
              </div>
            </div>
          </div>

          <div>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input type="text" placeholder="Your Name" v-model="form.name" required />
                </div>
                <div>
                  <Input type="text" placeholder="Subject" v-model="form.subject" required />
                </div>
              </div>
              <Input type="email" placeholder="Your Email" v-model="form.email" required />
              <Textarea placeholder="Your Message..." v-model="form.message" required rows="4" />
              <Button type="submit"> Send Message </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
