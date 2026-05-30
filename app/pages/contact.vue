<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Contact Us - Rise Social',
  description:
    'Get in touch with Rise Social. Send us a message or visit our office in Bandung, West Java.'
})

const { contact } = useSiteSettings()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const mailtoHref = computed(() => {
  const params = new URLSearchParams()
  const subject = form.subject.trim()
  const sender = form.email.trim()
  const name = form.name.trim()
  const message = form.message.trim()

  if (subject) params.set('subject', subject)

  const bodyParts = [
    name ? `Name: ${name}` : '',
    sender ? `Email: ${sender}` : '',
    '',
    message
  ].filter(Boolean)

  if (bodyParts.length > 0) {
    params.set('body', bodyParts.join('\n'))
  }

  const query = params.toString()
  return `mailto:${contact.value.email}${query ? `?${query}` : ''}`
})
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div class="space-y-6">
            <h1 class="text-3xl font-bold">Contact Us</h1>
            <div v-if="contact.email">
              <div class="flex items-center gap-4 mb-1">
                <UIcon name="i-ph-envelope-bold" class="size-4 text-muted shrink-0" />
                <h3 class="font-semibold">Email</h3>
              </div>
              <a
                :href="`mailto:${contact.email}`"
                class="pl-8 text-muted hover:text-primary transition-colors"
              >
                {{ contact.email }}
              </a>
            </div>
            <div v-if="contact.address">
              <div class="flex items-center gap-4 mb-1">
                <UIcon name="i-ph-map-pin-bold" class="size-4 text-muted shrink-0" />
                <h3 class="font-semibold">Address</h3>
              </div>
              <p class="pl-8 text-muted">{{ contact.address }}</p>
            </div>
          </div>
          <form class="flex flex-col gap-4">
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
            <UButton
              v-if="contact.email"
              :to="mailtoHref"
              color="primary"
              size="lg"
              block
              class="justify-center"
            >
              Send Message
            </UButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
