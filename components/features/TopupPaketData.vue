<script setup>
import { ref, watch } from 'vue';

import { Label } from '@/components/ui/label';

const emit = defineEmits(['update:selectedProduct']);

const phoneNumber = ref('');
const operator = ref(null);
const products = ref([]);
const selectedProduct = ref('');

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

watch(selectedProduct, (newValue) => {
  const product = products.value.find((p) => p.product_id === newValue);
  emit('update:selectedProduct', product);
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Paket Data</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div>
        <label class="block text-sm text-gray-600 mb-2">Nomor Telepon</label>
        <input
          v-model="phoneNumber"
          type="text"
          placeholder="Silakan Masukkan No. Handphone-mu"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          maxlength="13"
        />
        <div v-if="operator" class="mt-2 text-sm text-gray-600">
          <p class="font-medium">{{ operator.product_name }}</p>
        </div>
      </div>

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

      <template v-else>
        <div class="flex flex-col items-center justify-center h-full p-6 gap-y-4">
          <img src="/empty.png" alt="Coming Soon" class="w-48" />
          <p class="text-gray-400 font-medium">Masukkan nomor telepon untuk melihat produk yang tersedia</p>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
