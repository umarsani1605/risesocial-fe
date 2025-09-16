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
          <Input id="title" v-model="form.title" placeholder="e.g., Live Classes, Certificate, Portfolio" required />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea id="description" v-model="form.description" placeholder="Describe this feature..." rows="3" required />
        </div>

        <div class="space-y-2">
          <Label for="icon">Icon</Label>
          <Input id="icon" v-model="form.icon" placeholder="e.g., lucide:check-circle" required />
          <p class="text-xs text-muted-foreground">Use Lucide icon names (e.g., lucide:check-circle, lucide:star)</p>
        </div>

        <div class="space-y-2">
          <Label for="feature_order">Order</Label>
          <Input id="feature_order" v-model="form.feature_order" type="number" placeholder="1" min="1" required />
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
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Feature' : 'Add Feature'));
const dialogDescription = computed(() => (isEditMode.value ? 'Update the feature for this bootcamp.' : 'Add a new feature for this bootcamp.'));
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
      bootcamp_id: props.bootcampId,
      ...form.value,
    };

    if (isEditMode.value) {
      // TODO: Implement API call to update feature
      console.log('Updating feature:', {
        id: props.data.id,
        ...payload,
      });
    } else {
      // TODO: Implement API call to create feature
      console.log('Creating feature:', payload);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(isEditMode.value ? 'Feature updated successfully' : 'Feature added successfully');
    emit('success');
    emit('update:open', false);
  } catch (error) {
    toast.error(error?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} feature`);
  } finally {
    pending.value = false;
  }
};
</script>
