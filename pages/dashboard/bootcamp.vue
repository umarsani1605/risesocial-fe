<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBootcamps } from '@/composables/useBootcamps';
import { onMounted } from 'vue';

// Set layout untuk halaman ini
definePageMeta({
  auth: true,
  layout: 'dashboard',
});

// Get bootcamp data
const { bootcampsData, initializeBootcamps } = useBootcamps();

// Meta tags
useSeoMeta({
  title: 'Bootcamp - Rise Social',
  description: 'Kelola bootcamp dan progres pembelajaran Anda di Rise Social',
});

onMounted(() => {
  initializeBootcamps();
});
</script>
<template>
  <div class="bg-slate-50 mt-16 md:mt-10">
    <div class="container-wrapper section-py-md">
      <!-- Main Card Container -->
      <Card class="border border-gray-50 min-h-[50rem]">
        <CardHeader>
          <!-- Header Section -->
          <div class="flex flex-row items-center justify-between gap-3">
            <CardTitle class="heading-card">Bootcamp</CardTitle>
            <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/bootcamp')"> View All Bootcamp </Button>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Grid Container for Bootcamp Cards -->
          <div class="grid gap-4 lg:gap-6">
            <!-- Bootcamp Cards -->
            <div
              v-for="bootcamp in bootcampsData"
              :key="bootcamp.id"
              @click="navigateTo(`/bootcamp/${bootcamp.path_slug}`)"
              class="border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300 hover:shadow-subtle bg-white overflow-hidden"
            >
              <!-- Mobile Layout: Stacked -->
              <div class="block sm:hidden">
                <div class="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <img :src="bootcamp.image_url" :alt="bootcamp.title" class="w-full h-full object-cover transition-transform duration-200" />
                </div>
                <div class="p-4">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3 leading-tight">{{ bootcamp.title }}</h3>

                  <!-- Meta Info - Mobile: 2 per row -->
                  <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <Icon name="lucide:clock" class="w-3.5 h-3.5 flex-shrink-0" />
                      <span class="truncate">{{ bootcamp.duration }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <Icon name="lucide:book-open" class="w-3.5 h-3.5 flex-shrink-0" />
                      <span class="truncate">{{ bootcamp.format }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <Icon name="lucide:tag" class="w-3.5 h-3.5 flex-shrink-0" />
                      <span class="truncate">{{ bootcamp.category }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500" v-if="bootcamp.certificate">
                      <Icon name="lucide:award" class="w-3.5 h-3.5 flex-shrink-0" />
                      <span class="truncate">Sertifikat</span>
                    </div>
                  </div>

                  <!-- Description - Mobile -->
                  <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {{ bootcamp.description }}
                  </p>
                </div>
              </div>

              <!-- Tablet & Desktop Layout: Horizontal -->
              <div class="hidden sm:flex items-start p-4">
                <div class="size-24 md:size-36 lg:size-40 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden mr-4 lg:mr-6">
                  <img :src="bootcamp.image_url" :alt="bootcamp.title" class="w-full h-full object-cover transition-transform duration-200" />
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 leading-tight">{{ bootcamp.title }}</h3>

                  <!-- Meta Info - Tablet/Desktop: Flexible wrap -->
                  <div class="flex flex-wrap items-center gap-3 lg:gap-4 text-gray-500 text-sm mb-3">
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:clock" class="w-4 h-4 flex-shrink-0" />
                      <span>{{ bootcamp.duration }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:book-open" class="w-4 h-4 flex-shrink-0" />
                      <span>{{ bootcamp.format }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:tag" class="w-4 h-4 flex-shrink-0" />
                      <span>{{ bootcamp.category }}</span>
                    </div>
                    <div class="flex items-center gap-2" v-if="bootcamp.certificate">
                      <Icon name="lucide:award" class="w-4 h-4 flex-shrink-0" />
                      <span>Sertifikat</span>
                    </div>
                  </div>

                  <!-- Description - Tablet/Desktop -->
                  <p class="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2 mb-3">
                    {{ bootcamp.description }}
                  </p>
                  <div class="flex justify-end items-center gap-2">
                    <Button variant="outline" size="sm" @click="navigateTo(`/bootcamp/${bootcamp.path_slug}`)"> More Detail </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
