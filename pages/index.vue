<script setup>
import { ref, watch, computed } from 'vue';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

const phoneNumber = ref('');
const operator = ref(null);
const products = ref([]);
const selectedProduct = ref('');

// Computed property untuk mendapatkan detail produk yang dipilih
const selectedProductDetails = computed(() => {
  if (!selectedProduct.value || !products.value.length) return null;
  return products.value.find((product) => product.product_id === selectedProduct.value);
});

// Computed property untuk format harga
const formattedPrice = computed(() => {
  if (!selectedProductDetails.value) return 'Rp 0';
  return `Rp ${Number(selectedProductDetails.value.price_personal).toLocaleString('id-ID')}`;
});

const checkOperator = async (prefix) => {
  try {
    const response = await fetch(`https://tripay.id/process/prefixproduct?category_id=1&prefix=${prefix}`);
    const data = await response.json();

    if (data.operator && data.operator.length > 0) {
      operator.value = data.operator[0];
      products.value = data.produk || [];
    }
  } catch (error) {
    console.error('Error fetching operator:', error);
  }
};

watch(phoneNumber, (newValue) => {
  const cleanNumber = newValue.replace(/\D/g, '');

  phoneNumber.value = cleanNumber;

  if (cleanNumber.length >= 4) {
    const prefix = cleanNumber.substring(0, 4);
    checkOperator(prefix);
  } else {
    operator.value = null;
    products.value = [];
  }
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
      <div class="">
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
          <Card>
            <CardHeader>
              <CardTitle>{{ category.name }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Konten spesifik untuk Pulsa -->
              <template v-if="category.id === 'pulsa'">
                <div class="space-y-4">
                  <label class="block text-sm text-gray-600">Nomor Telepon</label>
                  <div class="relative w-full items-center">
                    <Input
                      v-model="phoneNumber"
                      type="text"
                      placeholder="Masukkan No. Handphone-mu"
                      maxlength="13"
                      class="p-5 w-full focus-visible:ring-3"
                    />
                    <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
                      <NuxtImg
                        v-if="operator"
                        :src="'https://tripay.id/assets/images/provider/' + operator.img"
                        alt="Shopee"
                        class="h-6 w-auto pr-2"
                      />
                    </span>
                  </div>
                </div>
                <Separator class="my-6" />
                <div v-if="products.length > 0" class="space-y-4">
                  <div v-if="operator" class="mt-2 text-sm text-gray-600">
                    <p class="font-bold">{{ operator.product_name }}</p>
                  </div>
                  <RadioGroup v-model="selectedProduct" class="grid grid-cols-4 gap-2">
                    <div v-for="product in products" :key="product.product_id" class="relative">
                      <RadioGroupItem :value="product.product_id" class="peer sr-only" :id="product.product_id" />
                      <Label
                        :for="product.product_id"
                        class="flex justify-between p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                      >
                        <div class="flex flex-col gap-y-1">
                          <span class="text-sm font-bold">{{ product.product_name }}</span>
                          <span class="text-xs text-gray-600">{{ product.desc }}</span>
                        </div>
                        <span class="text-primary text-base font-bold">Rp {{ Number(product.price_personal).toLocaleString('id-ID') }}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full p-6 gap-y-4">
                  <img src="/empty.png" alt="No Product" class="w-48" />
                  <p class="text-gray-400 font-medium">Masukkan nomor telepon untuk melihat produk yang tersedia</p>
                </div>
              </template>

              <!-- Konten untuk kategori lain -->
              <template v-else>
                <div class="flex flex-col items-center justify-center h-full p-6 gap-y-4">
                  <img src="/empty.png" alt="Coming Soon" class="w-48" />
                  <p class="text-gray-400 font-medium">Fitur ini akan segera hadir</p>
                </div>
              </template>
            </CardContent>
          </Card>
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
          <Button class="bg-primary text-white px-8 py-6 rounded-lg hover:bg-primary/80 transition-colors" :disabled="!selectedProductDetails">
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
