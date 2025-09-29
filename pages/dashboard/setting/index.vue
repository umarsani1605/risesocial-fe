<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { useAPI, $api } from '@/composables/useAPI';

definePageMeta({
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
  layout: 'dashboard-setting',
});

const avatarPreview = ref('');
const avatarUrl = ref('');
const avatarFile = ref(null);
const avatarFileInputRef = ref(null);

const accountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Email format is not valid').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone is required'),
  gender: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
});

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

const { data: userData, pending } = await useAPI('/users/profile', {
  key: 'user-profile-data',
  transform: (response) => response?.data || null,
});

watch(
  userData,
  (newData) => {
    if (newData) {
      form.setValues({
        firstName: newData.first_name || '',
        lastName: newData.last_name || '',
        email: newData.email || '',
        phone: newData.phone || '',
        gender: newData.gender || '',
        country: newData.country || '',
        province: newData.province || '',
        city: newData.city || '',
      });
      avatarUrl.value = newData.avatar || '';
    }
  },
  { immediate: true }
);

const onPickAvatar = () => {
  avatarFileInputRef.value?.click();
};

const onAvatarFileChange = (event) => {
  const files = event?.target?.files;
  if (!files || files.length === 0) return;
  const file = files[0];

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    event.target.value = '';
    return;
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.error(`File size (${fileSizeMB}MB) exceeds the maximum limit of 5MB. Please choose a smaller image.`);
    event.target.value = '';
    return;
  }

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

const userInitials = computed(() => {
  const firstName = form.values.firstName || '';
  const lastName = form.values.lastName || '';
  return getInitials(`${firstName} ${lastName}`);
});

const onSave = form.handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    const formData = new FormData();
    formData.append('first_name', values.firstName);
    formData.append('last_name', values.lastName);
    formData.append('email', values.email);
    formData.append('phone', values.phone || '');
    formData.append('gender', values.gender || '');
    formData.append('country', values.country || '');
    formData.append('province', values.province || '');
    formData.append('city', values.city || '');

    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value);
    } else if (avatarUrl.value === '') {
      formData.append('avatar', '');
    }

    await $api('/users/account', {
      method: 'PUT',
      body: formData,
    });

    const { getSession } = useAuth();
    await getSession();

    toast.success('Account updated successfully');
  } catch (error) {
    console.error('Failed to update account:', error);

    let errorMessage = 'Failed to update account';
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
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
        <div class="flex flex-row gap-8 px-6">
          <div class="flex justify-center items-center">
            <Avatar class="size-36">
              <AvatarImage :src="avatarPreview || avatarUrl" alt="Avatar preview" />
              <AvatarFallback class="text-2xl">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
          </div>
          <div class="flex flex-col justify-center gap-2">
            <input ref="avatarFileInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileChange" />
            <Button type="button" variant="outline" class="justify-start" @click="onPickAvatar">
              <Icon name="lucide:image" size="16" />
              Change Avatar
            </Button>
            <Button :disabled="!avatarPreview && !avatarUrl" type="button" variant="outline" class="justify-start" @click="onRemoveAvatar">
              <Icon name="lucide:trash-2" size="16" />
              Remove Avatar
            </Button>
            <p class="text-sm text-muted-foreground mt-2">Max file size: 5MB</p>
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
              <SelectTrigger class="w-full">
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
      <Button @click="onSave" :disabled="isSubmitting"> Save changes </Button>
    </div>
  </div>
</template>
<style scoped>
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
