<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Contact Us - Rise Social',
  description:
    'Get in touch with Rise Social. Send us a message or visit our office in Bandung, West Java.'
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const toast = useToast()

const submitForm = () => {
  console.log('Form submitted:', form)
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  toast.add({
    title: 'Pesan berhasil dikirim!',
    description: 'Terima kasih telah menghubungi kami.',
    color: 'success'
  })
}
</script>

<template>
  <div class="relative md:h-screen pb-8 md:pb-96">
    <div class="relative h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126916.58532317828!2d107.57311709999999!3d-6.917464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1699000000000!5m2!1sen!2sid"
        width="100%"
        height="100%"
        style="border: 0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="relative md:absolute inset-0 w-full h-96 lg:h-full"
      />
      <div
        class="relative md:absolute left-0 right-0 bottom-0 md:translate-y-1/2 bg-white md:rounded-3xl md:shadow-xl p-8 lg:p-12 max-w-5xl mx-auto md:mx-auto md:left-1/2 md:-translate-x-1/2 md:w-full"
      >
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div class="space-y-6">
            <div>
              <div class="flex items-center gap-4 mb-1">
                <UIcon name="i-lucide-instagram" class="size-4 text-gray-700 shrink-0" />
                <h3 class="font-semibold text-gray-900">Instagram</h3>
              </div>
              <a
                href="https://www.instagram.com/risesocial.official/"
                target="_blank"
                class="pl-8 text-gray-600 hover:text-primary transition-colors"
              >
                @risesocial.official
              </a>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-1">
                <UIcon name="i-lucide-mail" class="size-4 text-gray-700 shrink-0" />
                <h3 class="font-semibold text-gray-900">Email</h3>
              </div>
              <a
                href="mailto:risesocial.official@gmail.com"
                class="pl-8 text-gray-600 hover:text-primary transition-colors"
              >
                risesocial.official@gmail.com
              </a>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-1">
                <UIcon name="i-lucide-map-pin" class="size-4 text-gray-700 shrink-0" />
                <h3 class="font-semibold text-gray-900">Address</h3>
              </div>
              <p class="pl-8 text-gray-600">Bandung, West Java 40286, ID</p>
            </div>
          </div>
          <form class="flex flex-col gap-4" @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UInput v-model="form.name" type="text" placeholder="Your Name" required size="lg" />
              <UInput v-model="form.subject" type="text" placeholder="Subject" required size="lg" />
            </div>
            <UInput v-model="form.email" type="email" placeholder="Your Email" required size="lg" />
            <UTextarea
              v-model="form.message"
              placeholder="Your Message..."
              required
              :rows="4"
              size="lg"
            />
            <UButton type="submit" color="primary" size="lg"> Send Message </UButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
