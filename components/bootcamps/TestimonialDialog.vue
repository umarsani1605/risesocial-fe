<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Student Name</Label>
          <Input id="name" v-model="form.name" placeholder="Student name..." required />
        </div>

        <div class="space-y-2">
          <Label for="comment">Testimonial</Label>
          <Textarea id="comment" v-model="form.comment" placeholder="Share the student's testimonial..." rows="4" required />
        </div>

        <div class="space-y-2">
          <Label>Avatar</Label>
          <div class="flex flex-row gap-4">
            <div class="flex-1 flex justify-center items-center">
              <div class="size-28 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  v-if="avatarPreview || form.avatar_url"
                  :src="avatarPreview || form.avatar_url"
                  alt="Avatar preview"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                  {{ getInitials(form.name) }}
                </div>
              </div>
            </div>
            <div class="flex-1 flex flex-col justify-center gap-2">
              <input ref="avatarFileInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileChange" />
              <Button type="button" variant="outline" size="sm" @click="onPickAvatar">
                <Icon name="lucide:image" size="16" />
                {{ avatarPreview || form.avatar_url ? 'Change' : 'Upload' }} Avatar
              </Button>
              <Button v-if="avatarPreview || form.avatar_url" type="button" variant="outline" size="sm" @click="onRemoveAvatar">
                <Icon name="lucide:trash-2" size="16" />
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Order</Label>
          <NumberField :min="1" v-model="form.testimonial_order">
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
const avatarPreview = ref('');
const avatarFile = ref(null);
const avatarFileInputRef = ref(null);

// Computed properties
const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Testimonial' : 'Add Testimonial'));
const dialogDescription = computed(() =>
  isEditMode.value ? 'Update the testimonial for this bootcamp.' : 'Add a new testimonial for this bootcamp.'
);
const submitButtonText = computed(() => (isEditMode.value ? 'Update Testimonial' : 'Add Testimonial'));

const form = ref({
  name: '',
  comment: '',
  avatar_url: '',
  testimonial_order: 1,
});

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.value = {
        name: newData.name || '',
        comment: newData.comment || '',
        avatar_url: newData.avatar_url || '',
        testimonial_order: newData.testimonial_order || 1,
      };
      avatarPreview.value = '';
      avatarFile.value = null;
    } else {
      // Reset form for add mode
      form.value = {
        name: '',
        comment: '',
        avatar_url: '',
        testimonial_order: 1,
      };
      avatarPreview.value = '';
      avatarFile.value = null;
    }
  }
});

const onCancel = () => {
  emit('update:open', false);
};

// Avatar handlers
const onPickAvatar = () => {
  avatarFileInputRef.value?.click();
};

const onAvatarFileChange = (event) => {
  const files = event?.target?.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  avatarFile.value = file;
  try {
    avatarPreview.value = URL.createObjectURL(file);
  } catch (e) {
    console.error('Preview avatar failed:', e);
  }
};

const onRemoveAvatar = () => {
  avatarPreview.value = '';
  avatarFile.value = null;
  form.value.avatar_url = '';
  if (avatarFileInputRef.value) {
    avatarFileInputRef.value.value = '';
  }
};

// Helper function to get initials
const getInitials = (name) => {
  if (!name || name.trim() === '') return 'A';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const onSubmit = async () => {
  try {
    pending.value = true;

    const payload = {
      name: form.value.name,
      comment: form.value.comment,
      avatar_url: form.value.avatar_url || null,
      testimonial_order: Number(form.value.testimonial_order),
    };

    if (isEditMode.value) {
      // Update existing testimonial
      await $api(`/admin/bootcamps/${props.bootcampId}/testimonials/${props.data.id}`, {
        method: 'PUT',
        body: payload,
      });
      toast.success('Testimonial updated successfully');
    } else {
      // Create new testimonial
      await $api(`/admin/bootcamps/${props.bootcampId}/testimonials`, {
        method: 'POST',
        body: payload,
      });
      toast.success('Testimonial added successfully');
    }

    emit('success');
    emit('update:open', false);
  } catch (error) {
    console.error('Testimonial operation error:', error);
    toast.error(error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} testimonial`);
  } finally {
    pending.value = false;
  }
};
</script>
