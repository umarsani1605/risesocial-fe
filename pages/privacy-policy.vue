<script setup>
// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Privacy Policy - Rise Social',
  meta: [{ name: 'description', content: 'Learn about how Rise Social collects, uses, and protects your personal information.' }],
});
</script>

<template>
  <div class="bg-gray-50 mt-12">
    <!-- Main Content -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <div class="bg-white rounded-lg border p-6 sm:p-8 lg:p-12">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="heading-section-hero text-gray-900 mb-4">Privacy Policy</h1>
            <p class="text-gray-600">
              Last updated: {{ new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>

          <!-- Content -->
          <div class="prose prose-gray max-w-none">
            <section class="mb-8">
              <h2 class="heading-card mb-4">1. Introduction</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                PT. Rise Edukasi Inspirasi ("we," "our," or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p class="text-gray-600 leading-relaxed">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or
                use our services.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">2. Information We Collect</h2>

              <h3 class="heading-card-sm mb-3">2.1 Personal Information</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                We may collect personally identifiable information that you voluntarily provide to us when you:
              </p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>Register for an account</li>
                <li>Apply for job opportunities</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us directly</li>
                <li>Participate in our programs</li>
              </ul>

              <h3 class="heading-card-sm mb-3">2.2 Non-Personal Information</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                We may also collect non-personal information about you automatically when you interact with our services, including:
              </p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>Browser and device information</li>
                <li>IP address and location data</li>
                <li>Website usage statistics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">3. How We Use Your Information</h2>
              <p class="text-gray-600 leading-relaxed mb-4">We use the information we collect for various purposes, including:</p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>Providing and maintaining our services</li>
                <li>Processing job applications and program registrations</li>
                <li>Sending you relevant job opportunities and updates</li>
                <li>Improving our website and services</li>
                <li>Communicating with you about our programs and services</li>
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">4. Information Sharing and Disclosure</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following
                circumstances:
              </p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>With trusted service providers who assist us in operating our website and services</li>
                <li>With potential employers when you apply for job opportunities (with your consent)</li>
                <li>When required by law or to protect our rights and safety</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">5. Data Security</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100%
                secure.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">6. Your Rights</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>The right to access and receive a copy of your personal data</li>
                <li>The right to rectify or update your personal information</li>
                <li>The right to erase your personal data</li>
                <li>The right to restrict processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">7. Cookies</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Our website uses cookies to enhance your browsing experience. Cookies are small data files stored on your device. You can choose to
                accept or decline cookies through your browser settings.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">8. Children's Privacy</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under
                13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">9. Changes to This Privacy Policy</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
                and updating the "Last updated" date.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">10. Contact Us</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-600 mb-2"><strong>Email:</strong> risesocial.official@gmail.com</p>
                <p class="text-gray-600 mb-2"><strong>Address:</strong> Bandung, West Java 40286, Indonesia</p>
                <p class="text-gray-600">
                  <strong>Website:</strong> <NuxtLink to="/contact" class="text-green-600 hover:text-green-700">Contact Us Page</NuxtLink>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
