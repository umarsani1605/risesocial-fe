<script setup>
// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Terms of Service - Rise Social',
  meta: [{ name: 'description', content: 'Read our Terms of Service to understand the rules and regulations for using Rise Social platform.' }],
});
</script>

<template>
  <div class="bg-gray-50 mt-12">
    <!-- Main Content -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <div class="bg-white rounded-lg shadow-none border p-6 sm:p-8 lg:p-12">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="heading-section-hero text-gray-900 mb-4">Terms of Service</h1>
            <p class="text-gray-600">
              Last updated: {{ new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>

          <!-- Content -->
          <div class="prose prose-gray max-w-none">
            <section class="mb-8">
              <h2 class="heading-card mb-4">1. Agreement to Terms</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of the Rise Social website and services operated by PT. Rise Edukasi Inspirasi ("we,"
                "our," or "us"). By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p class="text-gray-600 leading-relaxed">If you disagree with any part of these Terms, then you may not access or use our services.</p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">2. Description of Services</h2>
              <p class="text-gray-600 leading-relaxed mb-4">Rise Social is a platform that provides:</p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>Job opportunities in the green and environmental sectors</li>
                <li>Educational programs and skill development courses</li>
                <li>Career guidance and AI-powered career assistance</li>
                <li>Networking opportunities with professionals and organizations</li>
                <li>Resources for sustainable career development</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">3. User Accounts</h2>

              <h3 class="heading-card-sm mb-3">3.1 Account Creation</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                To access certain features of our services, you must create an account. You must provide accurate, complete, and current information
                during registration and keep your account information updated.
              </p>

              <h3 class="heading-card-sm mb-3">3.2 Account Security</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must
                immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">4. User Conduct</h2>
              <p class="text-gray-600 leading-relaxed mb-4">When using our services, you agree not to:</p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Upload harmful or malicious content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use our services for spam or solicitation</li>
                <li>Interfere with the proper functioning of our services</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">5. Content and Intellectual Property</h2>

              <h3 class="heading-card-sm mb-3">5.1 Your Content</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                You retain ownership of any content you submit to our platform. However, by submitting content, you grant us a non-exclusive,
                worldwide, royalty-free license to use, display, and distribute your content in connection with our services.
              </p>

              <h3 class="heading-card-sm mb-3">5.2 Our Content</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                All content on our platform, including text, graphics, logos, and software, is the property of Rise Social or its content suppliers
                and is protected by intellectual property laws.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">6. Job Applications and Employment</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Rise Social serves as a platform connecting job seekers with employers. We do not guarantee job placement or employment outcomes. All
                employment decisions are made solely by the employers.
              </p>
              <ul class="list-disc pl-6 text-gray-600 mb-4 space-y-1">
                <li>We are not responsible for the accuracy of job postings</li>
                <li>We do not participate in the hiring process</li>
                <li>Any disputes between users and employers must be resolved directly</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">7. Privacy</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information
                when you use our services.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">8. Disclaimers and Limitations of Liability</h2>

              <h3 class="heading-card-sm mb-3">8.1 Service Availability</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                Our services are provided "as is" and "as available." We do not guarantee that our services will be uninterrupted, secure, or
                error-free.
              </p>

              <h3 class="heading-card-sm mb-3">8.2 Limitation of Liability</h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                To the maximum extent permitted by law, Rise Social shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our services.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">9. Termination</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We may terminate or suspend your account and access to our services at any time, with or without cause, and with or without notice.
                You may also terminate your account at any time by contacting us.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">10. Governing Law</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Indonesia, without regard to its conflict of law
                provisions.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">11. Changes to Terms</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any changes by posting the new Terms on this page and
                updating the "Last updated" date. Your continued use of our services after any modifications indicates your acceptance of the new
                Terms.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">12. Contact Information</h2>
              <p class="text-gray-600 leading-relaxed mb-4">If you have any questions about these Terms of Service, please contact us:</p>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-600 mb-2"><strong>Company:</strong> PT. Rise Edukasi Inspirasi</p>
                <p class="text-gray-600 mb-2"><strong>Email:</strong> risesocial.official@gmail.com</p>
                <p class="text-gray-600 mb-2"><strong>Address:</strong> Bandung, West Java 40286, Indonesia</p>
                <p class="text-gray-600">
                  <strong>Website:</strong> <NuxtLink to="/contact" class="text-green-600 hover:text-green-700">Contact Us Page</NuxtLink>
                </p>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">13. Severability</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="heading-card mb-4">14. Entire Agreement</h2>
              <p class="text-gray-600 leading-relaxed">
                These Terms constitute the entire agreement between you and Rise Social regarding the use of our services and supersede all prior
                agreements and understandings.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
