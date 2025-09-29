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
              >Instructor Name <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Instructor name..." />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="job_title">
          <FormItem>
            <FormLabel
              >Job Title <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Job title..." />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel
              >Description <span class="text-red-500">*</span>
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" placeholder="Brief description of the instructor..." rows="3" />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="space-y-2">
          <Label>Avatar</Label>
          <div class="flex flex-row gap-4">
            <div class="flex-1 flex justify-center items-center">
              <div class="size-28 rounded-full overflow-hidden flex items-center justify-center">
                <img v-if="avatarPreview || avatarUrl" :src="avatarPreview || avatarUrl" alt="Avatar preview" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-orange-100 text-primary flex items-center justify-center text-lg font-semibold">
                  {{ getInitials(form.values.name) }}
                </div>
              </div>
            </div>
            <div class="flex-1 flex flex-col justify-center gap-2">
              <input ref="avatarFileInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileChange" />
              <Button type="button" variant="outline" size="sm" @click="onPickAvatar">
                <Icon name="lucide:image" size="16" />
                {{ avatarPreview || avatarUrl ? 'Change' : 'Upload' }} Avatar
              </Button>
              <Button v-if="avatarPreview || avatarUrl" type="button" variant="outline" size="sm" @click="onRemoveAvatar">
                <Icon name="lucide:trash-2" size="16" />
                Remove
              </Button>
            </div>
          </div>
        </div>

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
    name: z.string().min(1, 'Instructor name is required'),
    job_title: z.string().min(1, 'Job title is required'),
    description: z.string().min(1, 'Description is required'),
    order: z.number().min(1, 'Order must be at least 1'),
  })
);

// Form setup with vee-validate
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    job_title: '',
    description: '',
    order: 1,
  },
});

const pending = ref(false);
const avatarPreview = ref('');
const avatarFile = ref(null);
const avatarFileInputRef = ref(null);

// Computed properties
const isEditMode = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Instructor' : 'Add Instructor'));
const dialogDescription = computed(() => (isEditMode.value ? 'Update the instructor for this academy.' : 'Add a new instructor to this academy.'));
const submitButtonText = computed(() => (isEditMode.value ? 'Update Instructor' : 'Add Instructor'));

// Additional state for avatar handling
const avatarUrl = ref('');

// Reset form when dialog opens or data changes
watch([() => props.open, () => props.data, () => props.mode], ([newOpen, newData, newMode]) => {
  if (newOpen) {
    if (newMode === 'edit' && newData) {
      // Pre-fill form with existing data
      form.setValues({
        name: newData.name || '',
        job_title: newData.job_title || '',
        description: newData.description || '',
        order: newData.order || 1,
      });
      avatarUrl.value = newData.avatar_url || '';
      avatarPreview.value = '';
      avatarFile.value = null;
    } else {
      // Reset form for add mode
      form.setValues({
        name: '',
        job_title: '',
        description: '',
        order: 1,
      });
      avatarUrl.value = '';
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
  avatarUrl.value = '';
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

const onSubmit = form.handleSubmit(
  async (values) => {
    try {
      pending.value = true;

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('job_title', values.job_title);
      formData.append('description', values.description);
      formData.append('order', values.order);

      if (avatarFile.value) {
        formData.append('avatar', avatarFile.value);
      } else {
        // Send avatar_url (empty string if no existing avatar)
        formData.append('avatar_url', avatarUrl.value || '');
      }

      if (isEditMode.value) {
        // Update existing instructor
        await $api(`/admin/academies/${props.academyId}/instructors/${props.data.id}`, {
          method: 'PUT',
          body: formData,
        });
        toast.success('Instructor updated successfully');
      } else {
        // Create new instructor
        await $api(`/admin/academies/${props.academyId}/instructors`, {
          method: 'POST',
          body: formData,
        });
        toast.success('Instructor added successfully');
      }

      emit('success');
      emit('update:open', false);
    } catch (error) {
      console.error('Instructor operation error:', error);
      toast.error(error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'add'} instructor`);
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
