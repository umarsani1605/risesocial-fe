<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="question">Question</Label>
          <Input id="question" v-model="form.question" placeholder="Add a question..." required />
        </div>

        <div class="space-y-2">
          <Label for="answer">Answer</Label>
          <Textarea id="answer" v-model="form.answer" placeholder="Provide a detailed answer..." rows="4" required />
        </div>

        <div class="space-y-2">
          <Label>Order</Label>
          <NumberField :min="1" v-model="form.faq_order">
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
import { Textarea } from '@/components/ui/textarea';
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
  bootcampId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:open', 'success']);

const pending = ref(false);

// Computed properties
const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit FAQ' : 'Add FAQ'));
const dialogDescription = computed(() =>
  isEditMode.value ? 'Update the frequently asked question for this bootcamp.' : 'Add a new frequently asked question for this bootcamp.'
);
const submitButtonText = computed(() => (isEditMode.value ? 'Update FAQ' : 'Add FAQ'));

const form = ref({
  question: '',
  answer: '',
  faq_order: 1,
});

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.value = {
        question: newData.question || '',
        answer: newData.answer || '',
        faq_order: newData.faq_order || 1,
      };
    } else {
      // Reset form for add mode
      form.value = {
        question: '',
        answer: '',
        faq_order: 1,
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
      question: form.value.question,
      answer: form.value.answer,
      faq_order: Number(form.value.faq_order),
    };

    if (isEditMode.value) {
      // Update existing FAQ
      await $api(`/admin/bootcamps/${props.bootcampId}/faqs/${props.data.id}`, {
        method: 'PUT',
        body: payload,
      });
      toast.success('FAQ updated successfully');
    } else {
      // Create new FAQ
      await $api(`/admin/bootcamps/${props.bootcampId}/faqs`, {
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
};
</script>
