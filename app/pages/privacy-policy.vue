<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Privacy Policy - Rise Social',
  description: 'Learn about how Rise Social collects, uses, and protects your personal information.'
})
</script>

<template>
  <UPageSection>
    <UCard
      :ui="{
        root: 'p-8 sm:p-10'
      }"
    >
      <template #header>
        <h1 class="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
      </template>
      <div class="space-y-10 leading-relaxed">
        <section>
          <h2 class="text-xl font-bold mb-3">1. Introduction</h2>
          <p class="mb-3">
            PT. Rise Edukasi Inspirasi ("we," "our," or "us") is committed to protecting and
            respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website and use our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this
            Privacy Policy, please do not access the site or use our services.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">2. Information We Collect</h2>
          <h3 class="text-base font-semibold mb-2">2.1 Personal Information</h3>
          <p class="mb-3">
            We may collect personally identifiable information that you voluntarily provide to us
            when you:
          </p>
          <ul class="list-disc pl-6 space-y-1 mb-5">
            <li>Register for an account</li>
            <li>Apply for job opportunities</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us directly</li>
            <li>Participate in our programs</li>
          </ul>
          <h3 class="text-base font-semibold mb-2">2.2 Non-Personal Information</h3>
          <p class="mb-3">
            We may also collect non-personal information about you automatically when you interact
            with our services, including:
          </p>
          <ul class="list-disc pl-6 space-y-1">
            <li>Browser and device information</li>
            <li>IP address and location data</li>
            <li>Website usage statistics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">3. How We Use Your Information</h2>
          <p class="mb-3">We use the information we collect for various purposes, including:</p>
          <ul class="list-disc pl-6 space-y-1">
            <li>Providing and maintaining our services</li>
            <li>Processing job applications and program registrations</li>
            <li>Sending you relevant job opportunities and updates</li>
            <li>Improving our website and services</li>
            <li>Communicating with you about our programs and services</li>
            <li>Complying with legal obligations</li>
            <li>Preventing fraud and ensuring security</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">4. Information Sharing and Disclosure</h2>
          <p class="mb-3">
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except in the following circumstances:
          </p>
          <ul class="list-disc pl-6 space-y-1">
            <li>
              With trusted service providers who assist us in operating our website and services
            </li>
            <li>
              With potential employers when you apply for job opportunities (with your consent)
            </li>
            <li>When required by law or to protect our rights and safety</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or electronic storage
            is 100% secure.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">6. Your Rights</h2>
          <p class="mb-3">
            Depending on your location, you may have the following rights regarding your personal
            information:
          </p>
          <ul class="list-disc pl-6 space-y-1">
            <li>The right to access and receive a copy of your personal data</li>
            <li>The right to rectify or update your personal information</li>
            <li>The right to erase your personal data</li>
            <li>The right to restrict processing of your personal data</li>
            <li>The right to data portability</li>
            <li>The right to object to processing</li>
            <li>The right to withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">7. Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies are small data
            files stored on your device. You can choose to accept or decline cookies through your
            browser settings.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you are a parent or guardian and
            believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-3">10. Contact Us</h2>
          <p class="mb-4">
            If you have any questions about this Privacy Policy or our privacy practices, please
            contact us at:
          </p>
          <div class="bg-gray-50 rounded-lg p-5 space-y-2 text-sm">
            <p>
              <span class="font-semibold">Email:</span>
              risesocial.official@gmail.com
            </p>
            <p><span class="font-semibold">Address:</span> Bandung, West Java 40286, Indonesia</p>
            <p>
              <span class="font-semibold">Website:</span>
              <NuxtLink to="/contact" class="text-primary hover:underline ml-1">
                Contact Us Page
              </NuxtLink>
            </p>
          </div>
        </section>
      </div>
    </UCard>
  </UPageSection>
</template>
