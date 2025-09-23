<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="question">
          <FormItem>
            <FormLabel>
              Question
              <span class="text-red-500">*</span>
            </FormLabel>
            <FormMessage />
            <FormControl>
              <Input v-bind="componentField" placeholder="Add a question..." />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="answer">
          <FormItem>
            <FormLabel
              >Answer <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" placeholder="Provide a detailed answer..." rows="4" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ value }" name="order">
          <FormItem>
            <FormLabel
              >Order <span class="text-red-500">*</span>
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
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'vue-sonner';

const { $api } = useNuxtApp();

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

// Zod schema for validation
const formSchema = toTypedSchema(
  z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required'),
    order: z.number().min(1, 'Order must be at least 1'),
  })
);

// Form setup with vee-validate
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    question: '',
    answer: '',
    order: 1,
  },
});

const pending = ref(false);

// Computed properties
const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit FAQ' : 'Add FAQ'));
const dialogDescription = computed(() =>
  isEditMode.value ? 'Update the frequently asked question for this academy.' : 'Add a new frequently asked question for this academy.'
);
const submitButtonText = computed(() => (isEditMode.value ? 'Update FAQ' : 'Add FAQ'));

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.setValues({
        question: newData.question || '',
        answer: newData.answer || '',
        order: Number(newData.order) || 1,
      });
    } else {
      // Reset form for add mode
      form.setValues({
        question: '',
        answer: '',
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
        question: values.question,
        answer: values.answer,
        order: values.order,
      };

      if (isEditMode.value) {
        // Update existing FAQ
        await $api(`/admin/academies/${props.academyId}/faqs/${props.data.id}`, {
          method: 'PUT',
          body: payload,
        });
        toast.success('FAQ updated successfully');
      } else {
        // Create new FAQ
        await $api(`/admin/academies/${props.academyId}/faqs`, {
          method: 'POST',
          body: payload,
        });
        toast.success('FAQ added successfully');
      }

      emit('success');
      emit('update:open', false);
    } catch (error) {
      console.error('FAQ operation error:', error);
      toast.error(error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} FAQ`);
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
