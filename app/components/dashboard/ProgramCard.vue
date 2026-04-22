<script setup lang="ts">
defineProps<{
  title: string
  image: string
  link: string
  description: string
}>()
</script>

<template>
  <NuxtLink
    :to="link"
    class="flex gap-4 group items-stretch justify-between p-3 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer"
  >
    <div class="size-40 shrink-0 rounded-lg overflow-hidden">
      <NuxtImg
        :src="image"
        :alt="title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    </div>

    <div class="flex-1 flex flex-col gap-2 min-w-0">
      <div class="flex flex-col gap-2">
        <p class="font-bold text-xl line-clamp-2">
          {{ title }}
        </p>
        <p class="text-sm line-clamp-3">
          {{ description }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
