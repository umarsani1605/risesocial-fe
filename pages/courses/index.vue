<script setup>
import { Star, BookOpen, Clock, Tag } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'All Courses - Rise Social',
  meta: [{ name: 'description', content: 'Explore all available courses for your green career development' }],
});

// Use composable for course data
const { coursesData, getUniqueCategories } = useCourses();

// Filter state
const activeCategory = ref('all');

// Get unique categories
const categories = computed(() => {
  const uniqueCategories = getUniqueCategories();
  return [
    { key: 'all', label: 'All Courses' },
    ...uniqueCategories.map((cat) => ({
      key: cat.toLowerCase().replace(/\s+/g, '-'),
      label: cat,
    })),
  ];
});

// Filtered courses based on active category
const filteredCourses = computed(() => {
  if (activeCategory.value === 'all') {
    return coursesData;
  }

  const selectedCategory = categories.value.find((cat) => cat.key === activeCategory.value);
  if (!selectedCategory) return coursesData;

  return coursesData.filter((course) => course.category === selectedCategory.label);
});

// Set active category
const setActiveCategory = (categoryKey) => {
  activeCategory.value = categoryKey;
};
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <!-- All Courses Section -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper-sm">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">All Course</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">Explore all available courses to develop your green career</p>
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            v-for="category in categories"
            :key="category.key"
            @click="setActiveCategory(category.key)"
            :class="[
              'px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeCategory === category.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            ]"
          >
            {{ category.label }}
          </button>
        </div>

        <!-- Courses Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card
            v-for="course in filteredCourses"
            :key="course.id"
            class="py-0 hover:shadow! hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col"
            @click="$router.push(`/courses/${course.module_slug}`)"
          >
            <CardContent class="p-0">
              <!-- Course Image -->
              <div class="aspect-square bg-gradient-to-br from-orange-400 to-orange-500 rounded-t-lg mb-4">
                <img :src="course.image" :alt="course.title" class="w-full h-full object-cover rounded-t-lg" loading="lazy" />
              </div>

              <!-- Course Content -->
              <div class="px-6 pb-6 space-y-2">
                <!-- Category Badge -->
                <div class="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-lg w-fit">
                  <Icon name="lucide:tag" class="w-3 h-3 text-primary" />
                  {{ course.category }}
                </div>

                <!-- Course Title -->
                <h3 class="font-semibold text-gray-900 mb-2 text-lg leading-tight line-clamp-2">
                  {{ course.title }}
                </h3>

                <!-- Course Description -->
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                  {{ course.description }}
                </p>

                <!-- Course Meta -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <Clock class="w-3 h-3" />
                    <span>{{ course.duration }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <BookOpen class="w-3 h-3" />
                    <span>{{ course.materialCount }} materi</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <Star class="w-3 h-3" />
                    <span>{{ course.rating }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- No Results State -->
        <div v-if="filteredCourses.length === 0" class="text-center py-12">
          <Tag class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p class="text-gray-500 text-sm">No courses available in this category</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
