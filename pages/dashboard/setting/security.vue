<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

definePageMeta({
  auth: true,
  layout: 'dashboard-setting',
});

const securitySchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    repeatPassword: z.string().min(6, 'Repeat password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  });

// Form setup with vee-validate
const form = useForm({
  validationSchema: toTypedSchema(securitySchema),
  initialValues: {
    password: '',
    repeatPassword: '',
  },
});

const isSubmitting = ref(false);

const onChange = form.handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    // Update password
    await $fetch('/api/user/security', {
      method: 'PUT',
      body: {
        password: values.password,
        repeatPassword: values.repeatPassword,
      },
    });

    // Reset form
    form.resetForm();

    console.log('Password updated successfully');
  } catch (error) {
    console.error('Failed to update password:', error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold">Security</h1>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="password" placeholder="Enter new password" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="repeatPassword">
      <FormItem>
        <FormLabel>Repeat password</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="password" placeholder="Repeat new password" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="pt-2">
      <Button @click="onChange" :disabled="isSubmitting">
        {{ isSubmitting ? 'Changing...' : 'Change' }}
      </Button>
    </div>
  </div>
</template>
