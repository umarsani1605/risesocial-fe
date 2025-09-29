<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel
              >Session Title <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Session title..." />
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
  topicId: {
    type: Number,
    required: true,
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
    title: z.string().min(1, 'Session title is required'),
    order: z.number().min(1, 'Order must be at least 1'),
  })
);

// Form setup with vee-validate
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    order: 1,
  },
});

const pending = ref(false);

// Computed properties
const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Session' : 'Add Session'));
const dialogDescription = computed(() => (isEditMode.value ? 'Update the session for this topic.' : 'Add a new session to this topic.'));
const submitButtonText = computed(() => (isEditMode.value ? 'Update Session' : 'Add Session'));

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.setValues({
        title: newData.title || '',
        order: Number(newData.order) || 1,
      });
    } else {
      // Reset form for add mode
      form.setValues({
        title: '',
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
        title: values.title,
        order: values.order,
      };

      if (isEditMode.value) {
        // Update existing session
        await $api(`/admin/academies/${props.academyId}/topics/${props.topicId}/sessions/${props.data.id}`, {
          method: 'PUT',
          body: payload,
        });
        toast.success('Session updated successfully');
      } else {
        // Create new session
        await $api(`/admin/academies/${props.academyId}/topics/${props.topicId}/sessions`, {
          method: 'POST',
          body: payload,
        });
        toast.success('Session added successfully');
      }

      emit('success');
      emit('update:open', false);
    } catch (error) {
      console.error('Session operation error:', error);
      toast.error(error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} session`);
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
