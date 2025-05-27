<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Job Opportunities - Rise Social',
  meta: [{ name: 'description', content: 'Find your dream green job from 11+ opportunities available' }],
});

// Jobs data
const jobsData = [
  {
    id: 1,
    title: 'Software Engineer',
    category: 'IT & Networking',
    categoryBg: 'bg-green-50',
    categoryText: 'text-green-600',
    categoryBorder: 'border-green-200',
    location: '32 Irving Pl, NY',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Temporary', variant: 'secondary' }],
    salary: '$400 - $450',
    salaryPeriod: '/ month',
    deadline: 'June 14, 2030',
    isVerified: true,
  },
  {
    id: 2,
    title: 'Sales Specialist',
    category: 'IT & Networking',
    categoryBg: 'bg-green-50',
    categoryText: 'text-green-600',
    categoryBorder: 'border-green-200',
    location: '433 Graham Ave',
    postedDate: 'June 20, 2023',
    badges: [
      { text: 'Full Time', variant: 'secondary' },
      { text: 'Urgent', variant: 'destructive' },
    ],
    salary: '$750 - $800',
    salaryPeriod: '/ month',
    deadline: 'June 5, 2031',
    isVerified: true,
  },
  {
    id: 3,
    title: 'Junior Graphic Designer',
    category: 'Accounting',
    categoryBg: 'bg-blue-50',
    categoryText: 'text-blue-600',
    categoryBorder: 'border-blue-200',
    location: '398 Manhattan Ave',
    postedDate: 'June 20, 2023',
    badges: [
      { text: 'On-site', variant: 'secondary' },
      { text: 'Urgent', variant: 'destructive' },
    ],
    salary: '$650 - $700',
    salaryPeriod: '/ month',
    deadline: 'June 4, 2031',
    isVerified: true,
  },
  {
    id: 4,
    title: 'Finance Manager',
    category: 'Data Science',
    categoryBg: 'bg-purple-50',
    categoryText: 'text-purple-600',
    categoryBorder: 'border-purple-200',
    location: '269 Norman Ave',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Remote', variant: 'secondary' }],
    salary: '$450 - $550',
    salaryPeriod: '/ month',
    deadline: 'June 22, 2029',
    isVerified: true,
  },
  {
    id: 5,
    title: 'Marketing Manager',
    category: 'Sales & Marketing',
    categoryBg: 'bg-orange-50',
    categoryText: 'text-orange-600',
    categoryBorder: 'border-orange-200',
    location: '178 7th Ave S, NY',
    postedDate: 'June 20, 2023',
    badges: [
      { text: 'Internship', variant: 'secondary' },
      { text: 'Temporary', variant: 'secondary' },
    ],
    salary: '$8 - $10',
    salaryPeriod: '/ hour',
    deadline: 'June 12, 2031',
    isVerified: true,
  },
  {
    id: 6,
    title: 'Full Stack Development',
    category: 'IT & Networking',
    categoryBg: 'bg-green-50',
    categoryText: 'text-green-600',
    categoryBorder: 'border-green-200',
    location: '77 Irving Pl, NY',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Freelance', variant: 'secondary' }],
    salary: '$850 - $900',
    salaryPeriod: '/ month',
    deadline: 'June 18, 2031',
    isVerified: true,
  },
  {
    id: 7,
    title: 'Senior Developer',
    category: 'Engineering',
    categoryBg: 'bg-slate-50',
    categoryText: 'text-slate-600',
    categoryBorder: 'border-slate-200',
    location: '192 3rd Ave, NY',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Full Time', variant: 'secondary' }],
    salary: '$50 - $65',
    salaryPeriod: '/ day',
    deadline: 'June 18, 2031',
    isVerified: true,
  },
  {
    id: 8,
    title: 'Project manager',
    category: 'Accounting',
    categoryBg: 'bg-blue-50',
    categoryText: 'text-blue-600',
    categoryBorder: 'border-blue-200',
    location: '160 West St, Brooklyn',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Internship', variant: 'secondary' }],
    salary: '$450 - $550',
    salaryPeriod: '/ month',
    deadline: 'June 13, 2029',
    isVerified: true,
  },
  {
    id: 9,
    title: 'HR Administration',
    category: 'Accounting',
    categoryBg: 'bg-blue-50',
    categoryText: 'text-blue-600',
    categoryBorder: 'border-blue-200',
    location: '5 - 48 49th Ave',
    postedDate: 'May 23, 2023',
    badges: [{ text: 'Freelance', variant: 'secondary' }],
    salary: '$100 - $120',
    salaryPeriod: '/ week',
    deadline: 'June 17, 2032',
    isVerified: true,
  },
  {
    id: 10,
    title: 'Social Media Marketing',
    category: 'Customer Service',
    categoryBg: 'bg-orange-50',
    categoryText: 'text-orange-600',
    categoryBorder: 'border-orange-200',
    location: '114 Kenyon St',
    postedDate: 'May 13, 2023',
    badges: [{ text: 'Part Time', variant: 'secondary' }],
    salary: '$10 - $15',
    salaryPeriod: '/ hour',
    deadline: 'May 19, 2029',
    isVerified: true,
  },
  {
    id: 11,
    title: 'Senior UI/UX Designer',
    category: 'Customer Service',
    categoryBg: 'bg-indigo-50',
    categoryText: 'text-indigo-600',
    categoryBorder: 'border-indigo-200',
    location: '279 Franklin St',
    postedDate: 'May 13, 2023',
    badges: [{ text: 'Remote', variant: 'secondary' }],
    salary: '$500 - $550',
    salaryPeriod: '/ month',
    deadline: 'May 15, 2029',
    isVerified: true,
  },
];

// Filter states
const searchTitle = ref('');
const selectedLocation = ref('');
const selectedCategory = ref('');
const selectedJobType = ref('');
const mapLocation = ref('');
const radiusValue = ref([50]);
const minSalary = ref('');
const maxSalary = ref('');
const salaryRange = ref([0]);
const selectedIndustry = ref('');
const selectedCareerLevel = ref('');
const selectedExperience = ref('');
const sortBy = ref('default');

// Job Alert states
const alertTitle = ref('');
const emailFrequency = ref('daily');

// Filter drawer state
const isFilterOpen = ref(false);
</script>
<template>
  <div class="bg-gray-50 mt-16">
    <!-- Main Content -->
    <div class="container-wrapper py-6 lg:py-8">
      <div class="py-4">
        <h1 class="heading-section">Job Opportunities</h1>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden">
          <Sheet v-model:open="isFilterOpen">
            <SheetTrigger as-child>
              <Button variant="outline">
                <Icon name="lucide:filter" class="h-4 w-4" />
                Show Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" class="w-80 overflow-y-auto px-5 py-6">
              <SheetHeader class="p-0">
                <SheetTitle>Filter Jobs</SheetTitle>
              </SheetHeader>

              <div class="space-y-6">
                <!-- Job Title Search -->
                <div>
                  <label class="form-label">Job Title</label>
                  <div class="relative">
                    <Icon name="lucide:search" class="input-icon" />
                    <Input type="text" placeholder="Job title, keywords or company" class="pl-10" v-model="searchTitle" />
                  </div>
                </div>

                <!-- Location -->
                <div>
                  <label class="form-label">Location</label>
                  <Select v-model="selectedLocation" class="w-full">
                    <SelectTrigger class="w-full!">
                      <SelectValue placeholder="All Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Location</SelectItem>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="bandung">Bandung</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                      <SelectItem value="bali">Bali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Categories -->
                <div>
                  <label class="form-label">Categories</label>
                  <Select v-model="selectedCategory">
                    <SelectTrigger class="w-full!">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="it">IT & Networking</SelectItem>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="marketing">Sales & Marketing</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Job Types -->
                <div>
                  <label class="form-label">Job Types</label>
                  <Select v-model="selectedJobType">
                    <SelectTrigger class="w-full!">
                      <SelectValue placeholder="Job Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Radius -->
                <div>
                  <label class="form-label"> Maps Location </label>
                  <div class="relative">
                    <Icon name="lucide:map-pin" class="input-icon" />
                    <Input type="text" placeholder="City or postcode" class="pl-10" v-model="mapLocation" />
                  </div>
                  <div class="mt-4">
                    <label class="form-label"> Radius: {{ radiusValue }} Miles </label>
                    <Slider v-model="radiusValue" :max="100" :min="0" :step="1" class="w-full" />
                  </div>
                </div>

                <!-- Salary Range -->
                <div>
                  <label class="form-label">Salary:</label>
                  <div class="flex items-center space-x-2 mb-2">
                    <Input type="number" placeholder="$0" v-model="minSalary" class="flex-1" />
                    <span class="text-gray-500">-</span>
                    <Input type="number" placeholder="$900" v-model="maxSalary" class="flex-1" />
                  </div>
                  <Slider v-model="salaryRange" :max="2000" :min="0" :step="50" class="w-full" />
                </div>

                <!-- Industry -->
                <div>
                  <label class="form-label">Industry</label>
                  <Select v-model="selectedIndustry">
                    <SelectTrigger class="w-full!">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                      <SelectItem value="green-tech">Green Technology</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Career Level -->
                <div>
                  <label class="form-label">Career Level</label>
                  <Select v-model="selectedCareerLevel">
                    <SelectTrigger class="w-full!">
                      <SelectValue placeholder="Career Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Experience -->
                <div>
                  <label class="form-label">Experience</label>
                  <Select v-model="selectedExperience">
                    <SelectTrigger class="w-full!">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Experience</SelectItem>
                      <SelectItem value="0-1">0-1 Years</SelectItem>
                      <SelectItem value="1-3">1-3 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value="5-10">5-10 Years</SelectItem>
                      <SelectItem value="10+">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Apply Filter Button -->
                <Button class="w-full bg-green-600 hover:bg-green-700" @click="isFilterOpen = false">
                  <Icon name="lucide:search" class="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <!-- Desktop Sidebar Filters -->
        <aside class="hidden lg:block lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border p-6 space-y-6 sticky top-6">
            <!-- Job Title Search -->
            <div>
              <label class="form-label">Job Title</label>
              <div class="relative">
                <Icon name="lucide:search" class="input-icon" />
                <Input type="text" placeholder="Job title, keywords or company" class="pl-10" v-model="searchTitle" />
              </div>
            </div>

            <!-- Location -->
            <div>
              <label class="form-label">Location</label>
              <Select v-model="selectedLocation" class="w-full">
                <SelectTrigger class="w-full!">
                  <SelectValue placeholder="All Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Location</SelectItem>
                  <SelectItem value="jakarta">Jakarta</SelectItem>
                  <SelectItem value="bandung">Bandung</SelectItem>
                  <SelectItem value="surabaya">Surabaya</SelectItem>
                  <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                  <SelectItem value="bali">Bali</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Categories -->
            <div>
              <label class="form-label">Categories</label>
              <Select v-model="selectedCategory">
                <SelectTrigger class="w-full!">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="it">IT & Networking</SelectItem>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="marketing">Sales & Marketing</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Job Types -->
            <div>
              <label class="form-label">Job Types</label>
              <Select v-model="selectedJobType">
                <SelectTrigger class="w-full!">
                  <SelectValue placeholder="Job Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Radius -->
            <div>
              <label class="form-label"> Maps Location </label>
              <div class="relative">
                <Icon name="lucide:map-pin" class="input-icon" />
                <Input type="text" placeholder="City or postcode" class="pl-10" v-model="mapLocation" />
              </div>
              <div class="mt-4">
                <label class="form-label"> Radius: {{ radiusValue }} Miles </label>
                <Slider v-model="radiusValue" :max="100" :min="0" :step="1" class="w-full" />
              </div>
            </div>

            <!-- Salary Range -->
            <div>
              <label class="form-label">Salary:</label>
              <div class="flex items-center space-x-2 mb-2">
                <Input type="number" placeholder="$0" v-model="minSalary" class="flex-1" />
                <span class="text-gray-500">-</span>
                <Input type="number" placeholder="$900" v-model="maxSalary" class="flex-1" />
              </div>
              <Slider v-model="salaryRange" :max="2000" :min="0" :step="50" class="w-full" />
            </div>

            <!-- Industry -->
            <div>
              <label class="form-label">Industry</label>
              <Select v-model="selectedIndustry">
                <SelectTrigger class="w-full!">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                  <SelectItem value="green-tech">Green Technology</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Career Level -->
            <div>
              <label class="form-label">Career Level</label>
              <Select v-model="selectedCareerLevel">
                <SelectTrigger class="w-full!">
                  <SelectValue placeholder="Career Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Experience -->
            <div>
              <label class="form-label">Experience</label>
              <Select v-model="selectedExperience">
                <SelectTrigger class="w-full!">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Experience</SelectItem>
                  <SelectItem value="0-1">0-1 Years</SelectItem>
                  <SelectItem value="1-3">1-3 Years</SelectItem>
                  <SelectItem value="3-5">3-5 Years</SelectItem>
                  <SelectItem value="5-10">5-10 Years</SelectItem>
                  <SelectItem value="10+">10+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Find Jobs Button -->
            <Button class="w-full bg-green-600 hover:bg-green-700">
              <Icon name="lucide:search" class="mr-2 h-4 w-4" />
              Find Jobs
            </Button>
          </div>
        </aside>

        <!-- Main Results -->
        <main class="col-span-1 lg:col-span-3">
          <!-- Job Cards Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card v-for="job in jobsData" :key="job.id" class="p-4 hover:shadow-md cursor-pointer transition-shadow duration-300 gap-0">
              <CardHeader class="py-3 sm:py-4 pl-4 pr-2!">
                <div class="flex items-start justify-between mb-2">
                  <Badge variant="outline" :class="['text-xs', job.categoryBg, job.categoryText, job.categoryBorder]">
                    {{ job.category }}
                  </Badge>
                  <Icon name="lucide:bookmark" class="size-6! text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
                <CardTitle class="heading-card-sm mb-1">
                  {{ job.title }}
                  <Icon v-if="job.isVerified" name="lucide:verified" class="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                </CardTitle>
                <div class="flex items-center gap-4">
                  <div class="job-card-meta">
                    <Icon name="lucide:map-pin" class="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span>{{ job.location }}</span>
                  </div>
                  <div class="job-card-meta">
                    <Icon name="lucide:calendar" class="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span>{{ job.postedDate }}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="p-4">
                <div class="flex flex-col sm:justify-between gap-2">
                  <div class="flex gap-2 flex-wrap mb-2">
                    <Badge v-for="badge in job.badges" :key="badge.text" :variant="badge.variant" class="text-xs">
                      {{ badge.text }}
                    </Badge>
                  </div>
                  <Separator class="my-2" />
                  <div class="job-card-salary">
                    <div class="job-card-salary-icon">
                      <span class="text-gray-500 text-sm sm:text-base font-bold">$</span>
                    </div>
                    <span class="job-card-salary-amount">{{ job.salary }}</span>
                    <span class="job-card-salary-period">{{ job.salaryPeriod }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Pagination -->
          <div class="mt-8 flex justify-center">
            <nav class="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <Icon name="lucide:chevron-left" class="h-4 w-4" />
                Previous
              </Button>
              <Button variant="default" size="sm" class="bg-green-600 hover:bg-green-700"> 1 </Button>
              <Button variant="outline" size="sm"> 2 </Button>
              <Button variant="outline" size="sm"> 3 </Button>
              <Button variant="outline" size="sm">
                <Icon name="lucide:chevron-right" class="h-4 w-4" />
                Next
              </Button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
