<template>
  <UFooter
    class="bg-deep-teal-950 text-white"
    :ui="{
      bottom: 'bg-[#062d2c] py-6 lg:py-10'
    }"
  >
    <template #top>
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 lg:items-start lg:text-left">
          <div class="flex gap-4 sm:gap-6 lg:gap-6 lg:flex-col items-center lg:items-start">
            <div
              class="flex-2 lg:flex-1 flex items-end lg:items-center justify-center lg:justify-start h-12 sm:h-20 lg:h-22"
            >
              <NuxtImg src="/logo.png" width="224" height="93" alt="Rise Social" format="webp" />
            </div>
            <div class="text-left lg:text-center flex-3 lg:flex-1">
              <p class="text-sm sm:text-lg lg:text-xl text-white leading-relaxed">
                Green Jobs Await "Kickstart Your Sustainable Career Path"
              </p>
            </div>
            <div class="hidden lg:flex h-full items-center justify-start lg:justify-center gap-2">
              <UIcon name="i-lucide-map-pin" class="size-4 text-primary" />
              <span class="text-sm sm:text-base">Indonesia</span>
            </div>
          </div>
          <div class="flex flex-row lg:flex-col-reverse gap-8 items-center">
            <div
              class="flex-2 flex h-full lg:hidden items-center justify-start lg:justify-center gap-2"
            >
              <UIcon name="i-lucide-map-pin" class="size-4 text-primary" />
              <span class="text-sm sm:text-base">Indonesia</span>
            </div>
            <div
              class="flex-3 flex flex-row lg:flex-col gap-4 space-y-4 lg:space-y-6 text-left justify-start lg:justify-center"
            >
              <div class="text-sm sm:text-base lg:text-lg m-0">Follow Us:</div>
              <div class="flex gap-3 sm:gap-4 justify-start lg:justify-center">
                <a
                  v-for="social in socialMediaData"
                  :key="social.id"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="size-8 sm:size-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-all duration-300"
                  :aria-label="social.ariaLabel"
                >
                  <UIcon :name="social.icon" class="size-5! text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </template>
    <template #bottom>
      <UContainer>
        <div
          class="flex flex-col gap-2 md:flex-row justify-between items-center text-center md:text-left"
        >
          <p class="text-xs sm:text-sm text-gray-400 order-2 md:order-1">
            © {{ currentYear }} PT. Rise Edukasi Inspirasi. All Rights Reserved.
          </p>
          <div class="flex gap-4 text-xs order-1 md:order-2">
            <ULink
              to="/term-of-services"
              class="text-gray-400 hover:text-primary transition-colors duration-300"
            >
              Terms Of Services
            </ULink>
            <ULink
              to="/privacy-policy"
              class="text-gray-400 hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </ULink>
          </div>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const socialMediaData = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/risesocial_/',
    icon: 'i-lucide-instagram',
    ariaLabel: 'Follow us on Instagram'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/rise-social-org/',
    icon: 'i-mdi-linkedin',
    ariaLabel: 'Follow us on LinkedIn'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@risesocial_',
    icon: 'i-ic-round-tiktok',
    ariaLabel: 'Follow us on TikTok'
  }
]
</script>
