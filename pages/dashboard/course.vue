<template>
  <div class="bg-slate-50 mt-10">
    <div class="container-wrapper section-py-md">
      <!-- Main Card Container -->
      <Card class="border border-gray-50 min-h-[50rem]">
        <CardHeader class="pb-0 mb-4">
          <!-- Header Section -->
          <div class="flex items-center justify-between mb-4">
            <CardTitle class="heading-card">My Courses</CardTitle>
            <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/courses')"> View All Courses </Button>
          </div>
          <!-- Tab Navigation -->
          <div class="flex space-x-8">
            <button
              @click="activeTab = 'progress'"
              :class="[
                'pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'progress'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              In Progress
            </button>
            <button
              @click="activeTab = 'completed'"
              :class="[
                'pb-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'completed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Completed
            </button>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Progress Courses Tab -->
          <div v-if="activeTab === 'progress'" class="space-y-4">
            <!-- No Progress Courses Message -->
            <div v-if="progressCourses.length === 0" class="text-center py-12">
              <Icon name="lucide:book-open" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No courses in progress</h3>
              <p class="text-gray-500 text-sm mb-4">Start learning by selecting available courses</p>
              <Button @click="navigateTo('/courses')">Explore Courses</Button>
            </div>

            <!-- Progress Course Cards -->
            <div
              v-for="(course, index) in progressCourses"
              :key="course.id"
              @click="navigateTo(`/courses/${course.module_slug}`)"
              class="flex items-center h-[8rem] space-x-3 sm:space-x-4 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
            >
              <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img :src="getLatestModule(course).image" :alt="getLatestModule(course).title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs sm:text-sm font-medium text-gray-500">{{ getModuleLabel(course, index) }}</p>
                  <Badge class="bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs"> Progress </Badge>
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate mb-2">
                  {{ getLatestModule(course).title }}
                </h3>
                <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    class="bg-yellow-400 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    :style="`width: ${getCourseProgress(course)}%`"
                  ></div>
                </div>
                <!-- Progress Info -->
                <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span class="flex items-center gap-2">
                    <Icon name="lucide:check-circle" class="h-4 w-4" />
                    {{ getCourseModulesCount(course).completed }} / {{ getCourseModulesCount(course).total }} materi completed
                  </span>
                  <span class="font-medium">{{ getCourseModulesCount(course).percentage }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Courses Tab -->
          <div v-if="activeTab === 'completed'" class="space-y-4">
            <!-- No Completed Courses Message -->
            <div v-if="completedCourses.length === 0" class="text-center py-12">
              <Icon name="lucide:graduation-cap" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No completed courses</h3>
              <p class="text-gray-500 text-sm mb-4">Complete courses in progress to see them here</p>
              <Button variant="outline" @click="activeTab = 'progress'">View Progress Courses</Button>
            </div>

            <!-- Completed Course Cards -->
            <div
              v-for="(course, index) in completedCourses"
              :key="course.id"
              @click="navigateTo(`/courses/${course.module_slug}`)"
              class="flex items-center h-[8rem] space-x-3 sm:space-x-4 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
            >
              <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img :src="getLatestModule(course).image" :alt="getLatestModule(course).title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs sm:text-sm font-medium text-gray-500">{{ getModuleLabel(course, index) }}</p>
                  <Badge class="bg-green-50 text-green-600 border border-green-200 text-xs"> Completed </Badge>
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate mb-2">
                  {{ getLatestModule(course).title }}
                </h3>
                <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div class="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500" :style="`width: 100%`"></div>
                </div>
                <!-- Progress Info -->
                <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span class="flex items-center gap-2">
                    <Icon name="lucide:check-circle" class="h-4 w-4" />
                    {{ getCourseModulesCount(course).completed }} / {{ getCourseModulesCount(course).total }} materi completed
                  </span>
                  <span class="font-medium">100%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Set layout untuk halaman ini
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

// Get courses data
const { coursesData, getCourseProgress, getCourseModulesCount } = useCourses();

// Active tab state
const activeTab = ref('progress');

// Filter courses berdasarkan progress
const progressCourses = computed(() => {
  return coursesData.filter((course) => {
    const progress = getCourseProgress(course);
    return progress > 0 && progress < 100;
  });
});

const completedCourses = computed(() => {
  return coursesData.filter((course) => {
    const progress = getCourseProgress(course);
    return progress === 100;
  });
});

// Get latest/current module for user (updated for new structure)
const getLatestModule = (course) => {
  // In new structure, each course is a module itself
  return course;
};

/**
 * Generate module label (Modul 1, Modul 2, etc.)
 * @param {Object} course - Course object
 * @param {number} index - Course index for fallback
 * @returns {string} Module label
 */
const getModuleLabel = (course, index) => {
  // In new structure, use course name or fallback to index
  return course.name || `Modul ${index + 1}`;
};

// Meta tags
useSeoMeta({
  title: 'Kursus Saya - Rise Social',
  description: 'Kelola kursus dan progres pembelajaran Anda di Rise Social',
});
</script>
