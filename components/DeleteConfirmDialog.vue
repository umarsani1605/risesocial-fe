<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * Reusable delete confirmation dialog
 *
 * Props
 * - modelValue: boolean - controls open state (v-model)
 * - title: string - dialog title
 * - pending: boolean - loading/disabled state for actions
 * - confirmText: string - confirm button text
 * - cancelText: string - cancel button text
 *
 * Emits
 * - update:modelValue
 * - confirm
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  pending: { type: Boolean, default: false },
  confirmText: { type: String, default: 'Hapus' },
  cancelText: { type: String, default: 'Batal' },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const onClose = (v) => emit('update:modelValue', v);
const onCancel = () => emit('update:modelValue', false);
const onConfirm = () => emit('confirm');
</script>

<template>
  <Dialog :open="modelValue" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="text-sm text-muted-foreground">
        <slot />
      </div>
      <DialogFooter>
        <Button variant="outline" @click="onCancel" :disabled="pending">{{ cancelText }}</Button>
        <Button variant="destructive" @click="onConfirm" :disabled="true">{{ pending ? 'Memproses...' : confirmText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
