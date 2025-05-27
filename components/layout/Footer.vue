<template>
  <footer class="bg-secondary text-white">
    <!-- Main Footer Content -->
    <div class="section-py-md pb-8 lg:pb-14">
      <div class="container-wrapper">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start lg:text-left">
          <!-- Left Side - Logo and Info -->
          <div class="flex gap-8 lg:gap-6 lg:flex-col items-end lg:items-start">
            <!-- Logo -->
            <div class="flex-2 lg:flex-1 flex items-end lg:items-center justify-center lg:justify-start h-12 sm:h-20 lg:h-22">
              <NuxtImg src="/images/logo.png" alt="Rise Social" class="w-auto lg:w-56" loading="lazy" format="webp" />
            </div>
            <!-- Tagline -->
            <div class="text-left lg:text-center flex-3 lg:flex-1">
              <p class="text-sm sm:text-lg lg:text-xl text-white leading-relaxed">Green Jobs Await "Kickstart Your Sustainable Career Path"</p>
            </div>
            <div class="hidden lg:flex h-full items-center justify-start lg:justify-center space-x-2">
              <Icon name="lucide:map-pin" class="h-4 w-4 text-primary" />
              <span class="text-sm sm:text-base">Indonesia</span>
            </div>
          </div>

          <!-- Right Side - Social Media -->
          <div class="flex flex-row lg:flex-col-reverse gap-8 items-center">
            <div class="flex-2 flex h-full lg:hidden items-center justify-start lg:justify-center space-x-2">
              <Icon name="lucide:map-pin" class="h-4 w-4 text-primary" />
              <span class="text-sm sm:text-base">Indonesia</span>
            </div>
            <div class="flex-3 flex flex-row lg:flex-col gap-4 space-y-4 lg:space-y-6 text-left justify-start lg:justify-center">
              <div class="text-sm sm:text-base lg:text-lg m-0">Follow Us:</div>
              <div class="flex space-x-3 sm:space-x-4 justify-start lg:justify-center">
                <a
                  v-for="social in socialMediaData"
                  :key="social.id"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="size-7 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-300"
                  :aria-label="social.ariaLabel"
                >
                  <Icon :name="social.icon" class="size-4! text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="pt-4 pb-0 sm:py-6 bg-[#062d2c]">
      <div class="container-wrapper">
        <div class="flex flex-col gap-2 md:flex-row justify-between items-center space-y-3 text-center md:text-left">
          <!-- Copyright -->
          <div class="text-xs sm:text-sm text-muted-foreground order-2 md:order-1">© 2024 PT. Rise Edukasi Inspirasi. All Rights Reserved.</div>

          <!-- Links -->
          <div class="flex flex-row space-x-4 text-xs order-1 md:order-2">
            <a href="/term-of-services" class="text-muted-foreground hover:text-primary transition-colors duration-300"> Terms Of Services </a>
            <a href="/privacy-policy" class="text-muted-foreground hover:text-primary transition-colors duration-300"> Privacy Policy </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const socialMediaData = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/risesocial_/',
    icon: 'lucide:instagram',
    ariaLabel: 'Follow us on Instagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/rise-social-org/',
    icon: 'mdi:linkedin',
    ariaLabel: 'Follow us on LinkedIn',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@risesocial_',
    icon: 'ic:round-tiktok',
    ariaLabel: 'Follow us on TikTok',
  },
];
</script>
