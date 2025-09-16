<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Pricing</DialogTitle>
        <DialogDescription> Add a new pricing tier for this bootcamp. </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Package Name</Label>
          <Input id="name" v-model="form.name" placeholder="e.g., Basic, Premium, Pro" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="original_price">Original Price</Label>
            <Input id="original_price" v-model="form.original_price" type="number" placeholder="0" min="0" required />
          </div>
          <div class="space-y-2">
            <Label for="discount_price">Discount Price</Label>
            <Input id="discount_price" v-model="form.discount_price" type="number" placeholder="0" min="0" required />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="tier_order">Tier Order</Label>
          <Input id="tier_order" v-model="form.tier_order" type="number" placeholder="1" min="1" required />
          <p class="text-xs text-muted-foreground">Lower numbers appear first</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="onCancel"> Cancel </Button>
          <Button type="submit" :disabled="pending">
            <Icon v-if="pending" name="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
            Add Pricing
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'vue-sonner';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  bootcampId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:open', 'success']);

const pending = ref(false);

const form = ref({
  name: '',
  original_price: '',
  discount_price: '',
  tier_order: 1,
});

// Reset form when dialog opens
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      form.value = {
        name: '',
        original_price: '',
        discount_price: '',
        tier_order: 1,
      };
    }
  }
);

const onCancel = () => {
  emit('update:open', false);
};

const onSubmit = async () => {
  try {
    pending.value = true;

    // TODO: Implement API call to create pricing
    console.log('Creating pricing:', {
      bootcamp_id: props.bootcampId,
      ...form.value,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Pricing added successfully');
    emit('success');
    emit('update:open', false);
  } catch (error) {
    toast.error(error?.message || 'Failed to add pricing');
  } finally {
    pending.value = false;
  }
};
</script>
