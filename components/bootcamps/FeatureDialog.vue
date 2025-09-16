<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Feature Title</Label>
          <Input id="title" v-model="form.title" placeholder="Name a featured benefit..." required />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea id="description" v-model="form.description" placeholder="Describe this benefit..." rows="3" required />
        </div>

        <div class="space-y-2">
          <Label for="icon">Icon</Label>
          <Input id="icon" v-model="form.icon" placeholder="Icon name..." required />
          <p class="text-xs text-muted-foreground">
            Use <a href="https://lucide.dev/icons/" target="_blank" class="text-primary hover:underline">Lucide Icon</a> names
          </p>
        </div>

        <div class="space-y-2">
          <Label>Order</Label>
          <NumberField :min="1" v-model="form.feature_order">
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
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Featured Benefit' : 'Add Featured Benefit'));
const dialogDescription = computed(() =>
  isEditMode.value ? 'Update the featured benefit for this bootcamp.' : 'Add a new featured benefit for this bootcamp.'
);
const submitButtonText = computed(() => (isEditMode.value ? 'Update Feature' : 'Add Feature'));

const form = ref({
  title: '',
  description: '',
  icon: '',
  feature_order: 1,
});

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.value = {
        title: newData.title || '',
        description: newData.description || '',
        icon: newData.icon || '',
        feature_order: newData.feature_order || 1,
      };
    } else {
      // Reset form for add mode
      form.value = {
        title: '',
        description: '',
        icon: '',
        feature_order: 1,
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
      title: form.value.title,
      description: form.value.description,
      icon: form.value.icon,
      feature_order: Number(form.value.feature_order),
    };

    if (isEditMode.value) {
      // Update existing feature
      await $api(`/admin/bootcamps/${props.bootcampId}/features/${props.data.id}`, {
        method: 'PUT',
        body: payload,
      });
      toast.success('Feature updated successfully');
    } else {
      // Create new feature
      await $api(`/admin/bootcamps/${props.bootcampId}/features`, {
        method: 'POST',
        body: payload,
      });
      toast.success('Feature added successfully');
    }

    emit('success');
    emit('update:open', false);
  } catch (error) {
    console.error('Feature operation error:', error);
    toast.error(error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} feature`);
  } finally {
    pending.value = false;
  }
};
</script>
