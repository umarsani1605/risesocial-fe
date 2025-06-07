<script setup>
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
    title: 'Data Scientist',
    company: 'PT. Rise Edukasi Inspirasi',
    location: 'Bandung, Indonesia',
    postedDate: '1 minggu yang lalu',
    type: 'Remote',
    typeColor: 'bg-yellow-100 text-yellow-800',
    cardColor: 'bg-orange-400',
  },
  {
    id: 2,
    title: 'Sustainability Specialist',
    company: 'GreenTech Solutions',
    location: 'Jakarta, Indonesia',
    postedDate: '2 hari yang lalu',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-800',
    cardColor: 'bg-emerald-500',
  },
  {
    id: 3,
    title: 'Environmental Engineer',
    company: 'EcoDesign Indonesia',
    location: 'Surabaya, Indonesia',
    postedDate: '3 hari yang lalu',
    type: 'On-site',
    typeColor: 'bg-green-100 text-green-800',
    cardColor: 'bg-blue-500',
  },
  {
    id: 4,
    title: 'Climate Change Analyst',
    company: 'Sustainable Future Corp',
    location: 'Yogyakarta, Indonesia',
    postedDate: '5 hari yang lalu',
    type: 'Remote',
    typeColor: 'bg-yellow-100 text-yellow-800',
    cardColor: 'bg-purple-500',
  },
  {
    id: 5,
    title: 'Green Energy Consultant',
    company: 'Renewable Power Ltd',
    location: 'Bali, Indonesia',
    postedDate: '1 minggu yang lalu',
    type: 'Hybrid',
    typeColor: 'bg-orange-100 text-orange-800',
    cardColor: 'bg-teal-500',
  },
  {
    id: 6,
    title: 'Carbon Footprint Analyst',
    company: 'EcoMetrics Indonesia',
    location: 'Bandung, Indonesia',
    postedDate: '1 minggu yang lalu',
    type: 'Contract',
    typeColor: 'bg-purple-100 text-purple-800',
    cardColor: 'bg-indigo-500',
  },
  {
    id: 7,
    title: 'Renewable Energy Engineer',
    company: 'Solar Indonesia',
    location: 'Jakarta, Indonesia',
    postedDate: '2 minggu yang lalu',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-800',
    cardColor: 'bg-red-500',
  },
  {
    id: 8,
    title: 'Sustainability Project Manager',
    company: 'Green Development Co',
    location: 'Medan, Indonesia',
    postedDate: '2 minggu yang lalu',
    type: 'Remote',
    typeColor: 'bg-yellow-100 text-yellow-800',
    cardColor: 'bg-pink-500',
  },
  {
    id: 9,
    title: 'ESG Compliance Officer',
    company: 'Sustainable Corp',
    location: 'Semarang, Indonesia',
    postedDate: '3 minggu yang lalu',
    type: 'Hybrid',
    typeColor: 'bg-orange-100 text-orange-800',
    cardColor: 'bg-cyan-500',
  },
  {
    id: 10,
    title: 'Green Marketing Specialist',
    company: 'EcoMarketing Agency',
    location: 'Malang, Indonesia',
    postedDate: '3 minggu yang lalu',
    type: 'Part Time',
    typeColor: 'bg-green-100 text-green-800',
    cardColor: 'bg-amber-500',
  },
  {
    id: 11,
    title: 'Climate Tech Developer',
    company: 'Future Tech Solutions',
    location: 'Denpasar, Indonesia',
    postedDate: '1 bulan yang lalu',
    type: 'Remote',
    typeColor: 'bg-yellow-100 text-yellow-800',
    cardColor: 'bg-violet-500',
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
            <Card
              v-for="job in jobsData"
              :key="job.id"
              class="p-0 hover:shadow-lg cursor-pointer transition-shadow duration-300 border border-gray-200 rounded-lg overflow-hidden min-h-[140px]"
            >
              <div class="flex h-full">
                <!-- Colored Square -->
                <div class="w-20 h-full flex-shrink-0" :class="job.cardColor"></div>

                <!-- Content -->
                <div class="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <!-- Top section with title and badge -->
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex-1 pr-3">
                        {{ job.title }}
                      </h3>
                      <Badge :class="job.typeColor" class="text-xs font-medium px-2 py-1 whitespace-nowrap">
                        {{ job.type }}
                      </Badge>
                    </div>

                    <!-- Company Name -->
                    <p class="text-gray-600 text-sm sm:text-base mb-4">
                      {{ job.company }}
                    </p>
                  </div>

                  <!-- Meta Information -->
                  <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div class="flex items-center text-gray-500 text-sm">
                      <Icon name="lucide:calendar" class="h-4 w-4 mr-2" />
                      <span>{{ job.postedDate }}</span>
                    </div>
                    <div class="flex items-center text-gray-500 text-sm">
                      <Icon name="lucide:map-pin" class="h-4 w-4 mr-2" />
                      <span>{{ job.location }}</span>
                    </div>
                  </div>
                </div>
              </div>
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
