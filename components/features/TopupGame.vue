<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:selectedProduct']);

const products = ref([]);
const selectedProduct = ref('');

const fetchProducts = async () => {
  try {
    const response = await fetch('https://tripay.id/process/prefixproduct?category_id=1&prefix=123');
    const data = await response.json();
    products.value = data.produk || [];
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Voucher Game</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      tes
      <div v-if="products.length > 0" class="space-y-4">
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
      <div v-else>
        <div class="flex flex-col items-center justify-center h-full p-6 gap-y-4">
          <img src="/empty.png" alt="Coming Soon" class="w-48" />
          <p class="text-gray-400 font-medium">Fitur ini akan segera hadir</p>
        </div>
      </div></CardContent
    >
  </Card>
</template>
