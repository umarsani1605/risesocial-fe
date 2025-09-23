<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel
              >Package Name
              <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Package name..." />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="original_price">
          <FormItem>
            <FormLabel
              >Original Price <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="0" min="0" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="discount_price">
          <FormItem>
            <FormLabel
              >Discount Price <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="0" min="0" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ value }" name="order">
          <FormItem>
            <FormLabel
              >Tier Order <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <NumberField
                :min="1"
                :model-value="value"
                @update:model-value="
                  (v) => {
                    if (v !== undefined && v !== null) {
                      form.setFieldValue('order', v);
                    } else {
                      form.setFieldValue('order', undefined);
                    }
                  }
                "
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </FormControl>
            <p class="text-xs text-muted-foreground">Lower numbers appear first</p>
          </FormItem>
        </FormField>

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
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  academyId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:open', 'success']);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Package name is required'),
    original_price: z.number().min(0, 'Original price must be 0 or greater'),
    discount_price: z.number().min(0, 'Discount price must be 0 or greater'),
    order: z.number().min(1, 'Order must be at least 1'),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    original_price: 0,
    discount_price: 0,
    order: 1,
  },
});

const pending = ref(false);

const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Pricing' : 'Add Pricing'));
const dialogDescription = computed(() =>
  isEditMode.value ? 'Update the pricing tier for this academy.' : 'Add a new pricing tier for this academy.'
);
const submitButtonText = computed(() => (isEditMode.value ? 'Update Pricing' : 'Add Pricing'));

watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      form.setValues({
        name: newData.name || '',
        original_price: newData.original_price || 0,
        discount_price: newData.discount_price || 0,
        order: Number(newData.order) || 1,
      });
    } else {
      form.setValues({
        name: '',
        original_price: 0,
        discount_price: 0,
        order: 1,
      });
    }
  }
});

const onCancel = () => {
  emit('update:open', false);
};

const onSubmit = form.handleSubmit(
  async (values) => {
    try {
      pending.value = true;

      const payload = {
        name: values.name,
        original_price: values.original_price,
        discount_price: values.discount_price,
        order: Number(values.order),
      };

      if (isEditMode.value) {
        // Update existing pricing
        await $api(`/admin/academies/${props.academyId}/pricing/${props.data.id}`, {
          method: 'PUT',
          body: payload,
        });
        toast.success('Pricing updated successfully');
      } else {
        // Create new pricing
        await $api(`/admin/academies/${props.academyId}/pricing`, {
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
  },
  (errors) => {
    console.log('Validation errors:', errors);
    toast.warning('Please fill in all required fields correctly');
  }
);
</script>
