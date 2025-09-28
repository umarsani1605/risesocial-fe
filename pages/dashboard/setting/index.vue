<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

definePageMeta({
  auth: true,
  layout: 'dashboard-setting',
});

// Account state
const avatarPreview = ref('');
const avatarUrl = ref('');
const avatarFile = ref(null);
const avatarFileInputRef = ref(null);

// Validation schema
const accountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
});

// Form setup with vee-validate
const form = useForm({
  validationSchema: toTypedSchema(accountSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    country: '',
    province: '',
    city: '',
  },
});

const isSubmitting = ref(false);

// Load user data
const { data: userData, pending } = await useFetch('/api/user/profile');

if (userData.value) {
  form.setValues({
    firstName: userData.value.first_name || '',
    lastName: userData.value.last_name || '',
    email: userData.value.email || '',
    phone: userData.value.phone || '',
    gender: userData.value.gender || '',
    country: userData.value.country || '',
    province: userData.value.province || '',
    city: userData.value.city || '',
  });
  avatarUrl.value = userData.value.avatar || '';
}

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
  if (avatarFileInputRef.value) avatarFileInputRef.value.value = '';
};

const getInitials = (name) => {
  if (!name || name.trim() === '') return 'A';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const onSave = form.handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    // Prepare data for API
    const accountData = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone || null,
      gender: values.gender || null,
      country: values.country || null,
      province: values.province || null,
      city: values.city || null,
    };

    // Update account
    await $fetch('/api/user/account', {
      method: 'PUT',
      body: accountData,
    });

    // Upload avatar if changed
    if (avatarFile.value) {
      const formData = new FormData();
      formData.append('file', avatarFile.value);

      await $fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });
    }

    console.log('Account updated successfully');
  } catch (error) {
    console.error('Failed to update account:', error);
  } finally {
    isSubmitting.value = false;
  }
});

// Gender options
const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold">Account</h1>
    <div class="grid grid-cols-1 md:pr-44 gap-4">
      <div class="space-y-2">
        <Label>Avatar</Label>
        <div class="flex flex-row gap-4">
          <div class="flex-1 flex justify-center items-center">
            <div class="size-36 rounded-full overflow-hidden flex items-center justify-center">
              <img v-if="avatarPreview || avatarUrl" :src="avatarPreview || avatarUrl" alt="Avatar preview" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                {{ getInitials(`${form.firstName} ${form.lastName}`) }}
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col justify-center gap-2">
            <input ref="avatarFileInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileChange" />
            <Button type="button" variant="outline" size="sm" @click="onPickAvatar">
              <Icon name="lucide:image" size="16" />
              {{ avatarPreview || avatarUrl ? 'Change' : 'Upload' }} Avatar
            </Button>
            <Button type="button" variant="outline" size="sm" @click="onRemoveAvatar" :disabled="avatarPreview || avatarUrl">
              <Icon name="lucide:trash-2" size="16" />
              Remove
            </Button>
          </div>
        </div>
      </div>
      <FormField v-slot="{ componentField }" name="firstName">
        <FormItem>
          <FormLabel>First name *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="John" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lastName">
        <FormItem>
          <FormLabel>Last name *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Doe" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="email" placeholder="john.doe@example.com" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="phone">
        <FormItem>
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="+62" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="gender">
        <FormItem>
          <FormLabel>Gender</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in genderOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="country">
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Indonesia" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="province">
        <FormItem>
          <FormLabel>Province</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="DKI Jakarta" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="city">
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Jakarta" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="pt-2">
      <Button @click="onSave" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : 'Save changes' }}
      </Button>
    </div>
  </div>
</template>
<style scoped>
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
