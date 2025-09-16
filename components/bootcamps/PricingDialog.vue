<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Package Name</Label>
          <Input id="name" v-model="form.name" placeholder="Package name..." required />
        </div>

        <div class="space-y-2">
          <Label for="original_price">Original Price</Label>
          <Input id="original_price" v-model="form.original_price" type="number" placeholder="0" min="0" required />
        </div>
        <div class="space-y-2">
          <Label for="discount_price">Discount Price</Label>
          <Input id="discount_price" v-model="form.discount_price" type="number" placeholder="0" min="0" required />
        </div>

        <div class="space-y-2">
          <Label>Tier Order</Label>
          <NumberField :min="1" v-model="form.tier_order">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <p class="text-xs text-muted-foreground">Lower numbers appear first</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="onCancel"> Cancel </Button>
          <Button type="submit" :disabled="pending">
            <Icon v-if="pending" name="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
            {{ submitButtonText }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Label } from '@/components/ui/label';
import { toast } from 'vue-sonner';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit'].includes(value),
  },
  data: {
    type: Object,
    default: null,
  },
  bootcampId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:open', 'success']);

const pending = ref(false);

// Computed properties
const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Pricing' : 'Add Pricing'));
const dialogDescription = computed(() =>
  isEditMode.value ? 'Update the pricing tier for this bootcamp.' : 'Add a new pricing tier for this bootcamp.'
);
const submitButtonText = computed(() => (isEditMode.value ? 'Update Pricing' : 'Add Pricing'));

const form = ref({
  name: '',
  original_price: '',
  discount_price: '',
  tier_order: 1,
});

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.value = {
        name: newData.name || '',
        original_price: newData.original_price || '',
        discount_price: newData.discount_price || '',
        tier_order: newData.tier_order || 1,
      };
    } else {
      // Reset form for add mode
      form.value = {
        name: '',
        original_price: '',
        discount_price: '',
        tier_order: 1,
      };
    }
  }
});

const onCancel = () => {
  emit('update:open', false);
};

const onSubmit = async () => {
  try {
    pending.value = true;

    const payload = {
      name: form.value.name,
      original_price: Number(form.value.original_price),
      discount_price: Number(form.value.discount_price),
      tier_order: Number(form.value.tier_order),
    };

    if (isEditMode.value) {
      // Update existing pricing
      await $api(`/admin/bootcamps/${props.bootcampId}/pricing/${props.data.id}`, {
        method: 'PUT',
        body: payload,
      });
      toast.success('Pricing updated successfully');
    } else {
      // Create new pricing
      await $api(`/admin/bootcamps/${props.bootcampId}/pricing`, {
        method: 'POST',
        body: payload,
      });
      toast.success('Pricing added successfully');
    }

    emit('success');
    emit('update:open', false);
  } catch (error) {
    console.error('Pricing operation error:', error);
    toast.error(error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} pricing`);
  } finally {
    pending.value = false;
  }
};
</script>
