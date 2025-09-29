<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { $api } from '@/composables/useAPI';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard-setting',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
});

const securitySchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  });

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

    await $api('/users/security', {
      method: 'PUT',
      body: {
        password: values.password,
        repeatPassword: values.repeatPassword,
      },
    });

    form.resetForm();

    console.log('Password updated successfully');
    toast.success('Password updated');
  } catch (error) {
    console.error('Failed to update password');
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
      <Button @click="onChange" :disabled="isSubmitting"> Change Password </Button>
    </div>
  </div>
</template>
