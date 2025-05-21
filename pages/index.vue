<script setup>
import { ref, computed } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TopupPulsa from '@/components/features/TopupPulsa.vue';
import TopupComingSoon from '@/components/features/TopupComingSoon.vue';
import TopupPaketData from '@/components/features/TopupPaketData.vue';
import TopupGame from '@/components/features/TopupGame.vue';

const categories = [
  {
    id: 'pulsa',
    name: 'Pulsa',
    icon: 'lucide:smartphone',
  },
  {
    id: 'paket-data',
    name: 'Paket Data',
    icon: 'lucide:wifi',
  },
  {
    id: 'voucher-game',
    name: 'Voucher Game',
    icon: 'lucide:gamepad',
  },
  {
    id: 'tagihan',
    name: 'Tagihan',
    icon: 'heroicons:bolt-solid',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'lucide:music',
  },
  {
    id: 'lainnya',
    name: 'Lainnya',
    icon: 'lucide:more-horizontal',
  },
];

const selectedProduct = ref(null);

const formattedPrice = computed(() => {
  if (!selectedProduct.value) return 'Rp 0';
  return `Rp ${Number(selectedProduct.value.price_personal).toLocaleString('id-ID')}`;
});
</script>

<template>
  <div class="min-h-screen text-gray-700 font-display pb-24 bg-slate-100">
    <!-- Header -->
    <header class="bg-white shadow p-8 mb-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center divide-x divide-gray-300 text-gray-500">
          <img src="/logo.png" alt="Shopee" class="h-8 w-auto pr-6" />
          <span class="text-lg font-bold pl-6">Pulsa, Tagihan &amp; Hiburan</span>
        </div>
        <Button variant="outline" class="text-base cursor-pointer font-semibold">
          <Icon name="lucide:clipboard-list" size="21" />
          <span>Pesanan Saya</span>
        </Button>
      </div>
    </header>

    <!-- Navigation Menu using Tabs -->
    <Tabs default-value="pulsa" class="w-full">
      <div class="bg-white shadow">
        <div class="max-w-6xl mx-auto">
          <TabsList class="h-auto w-full flex bg-transparent px-21 font-normal">
            <TabsTrigger
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              class="text-gray-600 bg-transparent! shadow-none! font-semibold flex flex-col gap-y-4 items-center py-4 px-6 border-0 border-b-3 cursor-pointer border-transparent rounded-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:font-bold"
            >
              <Icon :name="category.icon" size="28" />
              <span>{{ category.name }}</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent v-for="category in categories" :key="category.id" :value="category.id" class="m-0">
        <div class="max-w-6xl mx-auto flex flex-col gap-y-4 mt-6">
          <TopupPulsa v-if="category.id === 'pulsa'" v-model:selectedProduct="selectedProduct" />
          <TopupPaketData v-else-if="category.id === 'paket-data'" v-model:selectedProduct="selectedProduct" />
          <TopupGame v-else-if="category.id === 'voucher-game'" v-model:selectedProduct="selectedProduct" />
          <TopupComingSoon v-else :title="category.name" />
        </div>
      </TabsContent>
    </Tabs>

    <!-- Sticky Footer -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-xl">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex gap-x-4 justify-end items-center">
          <div class="flex flex-col gap-y-1">
            <span class="text-xs text-gray-600">Total</span>
            <span class="text-primary text-base font-bold">{{ formattedPrice }}</span>
          </div>
          <Button class="bg-primary text-white px-8 py-6 rounded-lg hover:bg-primary/80 transition-colors" :disabled="!selectedProduct">
            Beli Sekarang
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  z-index: 50;
}
</style>
