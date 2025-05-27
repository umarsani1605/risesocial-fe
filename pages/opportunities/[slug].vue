<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Get the slug from the route
const route = useRoute();
const slug = route.params.slug;

// Meta tags
useHead({
  title: 'Software Engineer - Rise Social',
  meta: [{ name: 'description', content: 'Join our team as a Software Engineer and help build sustainable green technology solutions' }],
});

// Contact form states
const contactForm = ref({
  subject: '',
  email: '',
  phone: '',
  message: '',
});

const submitContact = () => {
  console.log('Contact form submitted:', contactForm.value);
  // Handle form submission here
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb Section -->
    <section class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">Home</NuxtLink>
            </li>
            <li>
              <Icon name="lucide:chevron-right" class="h-4 w-4 text-gray-400" />
            </li>
            <li>
              <NuxtLink to="/opportunities" class="text-gray-500 hover:text-gray-700">Jobs</NuxtLink>
            </li>
            <li>
              <Icon name="lucide:chevron-right" class="h-4 w-4 text-gray-400" />
            </li>
            <li class="text-gray-900 font-medium">Software Engineer</li>
          </ol>
        </nav>
      </div>
    </section>

    <!-- Job Header -->
    <section class="bg-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <!-- Job Info -->
          <div class="flex-1">
            <div class="flex items-start gap-4 mb-4">
              <Badge variant="outline" class="bg-green-50 text-green-600 border-green-200">
                <Icon name="lucide:verified" class="mr-1 h-3 w-3" />
                Agrotech Ltd
              </Badge>
              <div class="flex items-center gap-2">
                <Icon name="lucide:share-2" class="h-4 w-4 text-gray-400 cursor-pointer" />
                <Icon name="lucide:bookmark" class="h-4 w-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              Software Engineer
              <Icon name="lucide:verified" class="h-6 w-6 text-blue-500" />
            </h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <Icon name="lucide:calendar" class="h-4 w-4" />
                <span>June 20, 2023</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="lucide:clock" class="h-4 w-4" />
                <span>Deadline: June 14, 2030</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="lucide:map-pin" class="h-4 w-4" />
                <span>32 Irving Pl, NY</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="lucide:dollar-sign" class="h-4 w-4" />
                <span>$400 - $450 / month</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" class="text-xs">IT & Networking</Badge>
              <Badge variant="secondary" class="text-xs">Temporary</Badge>
              <Badge variant="secondary" class="text-xs">Full Time</Badge>
            </div>
          </div>

          <!-- Apply Button -->
          <div class="lg:flex-shrink-0">
            <Button size="lg" class="bg-green-600 hover:bg-green-700 text-white w-full lg:w-auto">
              <Icon name="lucide:send" class="mr-2 h-4 w-4" />
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Job Description -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl font-semibold">Job Description</CardTitle>
            </CardHeader>
            <CardContent class="prose prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed mb-4">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
                ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                aspernatur aut odit aut fugit.
              </p>
              <p class="text-gray-700 leading-relaxed mb-4">
                Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem.
              </p>
              <p class="text-gray-700 leading-relaxed">
                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
                fugiat quo voluptas nulla pariatur?
              </p>
            </CardContent>
          </Card>

          <!-- The Work You'll Do -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl font-semibold">The Work You'll Do:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Support the Creative Directors and Associate Creative Directors of experiential design to concept and oversee the production of
                    bold, innovative, award-winning campaigns and digital experiences.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Make strategic and tactical UX decisions related to design and usability as well as features and functions.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Conduct low- and high-fidelity wireframing that represent a user's journey.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Effectively pitch wireframes to and solutions to stakeholders. You'd be the greatest advocate for our work, but you'll also
                    listen and internalize feedback so that we can come back with creative that exceeds expectations.</span
                  >
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- What You'll Bring -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl font-semibold">What You'll Bring:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Passion for Human-Centered Design – a drive to make interactive technology better for people.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Thorough knowledge of UX of best practices.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Understanding of brand identity and working within a defined design system as well as contributing to it.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >A mastery of craft. You dream about color, typography, and interaction design every day. You live and breathe using best Figma
                    and Adobe Creative Suite to efficiently use your skill set to develop new experiences.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >A portfolio which highlights strong understanding of UX design including but not limited to user flows, UX, and translating
                    customer insights to wireframes and experiences that are both – high-fidelity designs.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Possess problem-solving skills, an investigative mentality, and a proactive nature committed to delivering solutions.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Possess problem-solving skills.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Qualifications -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl font-semibold">Qualifications:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Bachelor's degree preferred, or equivalent experience</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">At least 5-8 years of experience with UX design</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >2 years of experience with design thinking or similar framework that focuses on defining users need early.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Strong portfolio showing expert-level usage, layout, and typographic skills, as well as creativity and ability to adhere to brand
                    standards.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Expertise in Figma, Adobe Creative Suite, Microsoft Suite</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Ability to collaborate with cross-functional internal teams and maintain a project stakeholders at all levels.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Formal learning, Relentless desire to learn and leverage the latest web technologies.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Detail-oriented. You must be highly organized, be detail-driven, and excel in responsibilities that require both planning and
                    flexibility - to show 100% precision, excellence that's consistently delivered to you-as-user/owner.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Independence: The ability to make things happen with limited direction. Excellent proactive attitude, take-charge personality and
                    maintain high levels standards that set the example for us.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="lucide:check" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700"
                    >Proficiency with Front-End UI technologies a bonus but not necessary such as HTML, CSS, JavaScript.</span
                  >
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Company Description -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl font-semibold">About Agrotech Ltd</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-gray-700 leading-relaxed mb-4">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
                et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id
                est laborum et dolorum fuga.
              </p>
              <p class="text-gray-700 leading-relaxed mb-4">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
                quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.
              </p>
              <p class="text-gray-700 leading-relaxed">
                Omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
                repudiandae sint et molestiae non recusandae.
              </p>
            </CardContent>
          </Card>

          <!-- Share This Post -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl font-semibold">Share this post:</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-4">
                <Button variant="outline" size="sm">
                  <Icon name="lucide:facebook" class="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="lucide:linkedin" class="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="lucide:twitter" class="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Job Information -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg font-semibold">Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Date Posted:</span>
                <span class="font-medium">June 20, 2023</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">United States</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Category:</span>
                <span class="font-medium">IT & Networking</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Offered Salary:</span>
                <span class="font-medium">$400 - $450 / month</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Expiration date:</span>
                <span class="font-medium">June 14, 2030</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Experience:</span>
                <span class="font-medium">1 Year</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Gender:</span>
                <span class="font-medium">Both</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Industry:</span>
                <span class="font-medium">Sem Banking</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Qualification:</span>
                <span class="font-medium">Certificate</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Career Level:</span>
                <span class="font-medium">Student</span>
              </div>
            </CardContent>
          </Card>

          <!-- Job Location -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg font-semibold">Job Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div class="text-center">
                  <Icon name="lucide:map-pin" class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-500">Interactive Map</p>
                  <p class="text-xs text-gray-400">32 Irving Pl, NY</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Employer Information -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg font-semibold">Employer Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="lucide:building-2" class="h-8 w-8 text-green-600" />
                </div>
                <h3 class="font-semibold text-gray-900">Agrotech Ltd</h3>
                <p class="text-sm text-blue-600 hover:underline cursor-pointer">View Profile</p>
              </div>

              <div class="space-y-2 text-sm">
                <div>
                  <span class="text-gray-600">Categories:</span>
                  <span class="ml-2 text-green-600 font-medium">Engineering</span>
                </div>
                <div>
                  <span class="text-gray-600">Founded Date:</span>
                  <span class="ml-2 font-medium">1979</span>
                </div>
                <div>
                  <span class="text-gray-600">Location:</span>
                  <span class="ml-2 font-medium">United States</span>
                </div>
                <div>
                  <span class="text-gray-600">Phone Number:</span>
                  <span class="ml-2 font-medium text-green-600">(+88)123-456-789</span>
                </div>
                <div>
                  <span class="text-gray-600">Email:</span>
                  <span class="ml-2 font-medium">agroco.ltd@sauer.com</span>
                </div>
              </div>

              <div class="pt-4 border-t">
                <p class="text-sm text-gray-600 mb-3">Social:</p>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" class="p-2">
                    <Icon name="lucide:facebook" class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" class="p-2">
                    <Icon name="lucide:linkedin" class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" class="p-2">
                    <Icon name="lucide:twitter" class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div class="pt-4 border-t">
                <p class="text-center text-blue-600 font-medium cursor-pointer hover:underline">envato.com</p>
              </div>
            </CardContent>
          </Card>

          <!-- Contact Agrotech Ltd -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg font-semibold">Contact Agrotech Ltd</CardTitle>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="submitContact" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <Input v-model="contactForm.subject" placeholder="Subject" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <Input v-model="contactForm.email" type="email" placeholder="Your email" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input v-model="contactForm.phone" type="tel" placeholder="Your phone number" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <Textarea v-model="contactForm.message" placeholder="Your message" rows="4" required />
                </div>

                <Button type="submit" class="w-full bg-green-600 hover:bg-green-700"> Send Message </Button>

                <p class="text-center text-sm text-blue-600 cursor-pointer hover:underline">Private Message</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
