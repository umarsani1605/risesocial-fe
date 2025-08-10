<script setup>
import { ref, watch, computed } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  user: { type: Object, default: null },
  pending: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  avatar: '',
  role: 'USER',
  password: '', // optional for edit
});

watch(
  () => props.user,
  (u) => {
    if (props.mode === 'edit' && u) {
      form.value = {
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        email: u.email || '',
        phone: u.phone || '',
        avatar: u.avatar || '',
        role: u.role || 'USER',
        password: '',
      };
    } else if (props.mode === 'create') {
      form.value = { first_name: '', last_name: '', email: '', phone: '', avatar: '', role: 'USER', password: '' };
    }
  },
  { immediate: true }
);

const titleText = computed(() => (props.mode === 'edit' ? 'Edit User' : 'Create User'));

const onClose = () => emit('update:modelValue', false);
const onSubmit = () => emit('submit', { ...form.value });
</script>

<template>
  <Dialog :open="modelValue" @update:open="(v) => emit('update:modelValue', v)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader class="pb-4">
        <DialogTitle>{{ titleText }}</DialogTitle>
      </DialogHeader>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <Label for="first_name">First Name</Label>
          <Input id="first_name" v-model="form.first_name" placeholder="John" />
        </div>
        <div class="space-y-2">
          <Label for="last_name">Last Name</Label>
          <Input id="last_name" v-model="form.last_name" placeholder="Doe" />
        </div>
        <div class="md:col-span-2 space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" v-model="form.email" placeholder="Email" />
        </div>
        <div class="space-y-2">
          <Label for="phone">Phone</Label>
          <Input id="phone" v-model="form.phone" placeholder="+62..." />
        </div>
        <div class="space-y-2">
          <Label for="role">Role</Label>
          <Select v-model="form.role">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="md:col-span-2 space-y-2">
          <Label for="avatar">Avatar URL</Label>
          <Input id="avatar" v-model="form.avatar" placeholder="https://..." />
        </div>
      </div>

      <DialogFooter>
        <button class="px-3 py-2 text-sm rounded border" @click="onClose" :disabled="pending">Cancel</button>
        <button class="px-3 py-2 text-sm rounded bg-primary text-primary-foreground" @click="onSubmit" :disabled="pending">
          {{ pending ? 'Saving...' : 'Save' }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
