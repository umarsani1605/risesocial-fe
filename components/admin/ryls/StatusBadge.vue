<template>
  <Badge :variant="statusVariant">
    {{ statusText }}
  </Badge>
</template>

<script setup>
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['PENDING', 'PAID', 'FAILED', 'EXPIRED'].includes(value),
  },
});

const statusText = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return 'Pending';
    case 'PAID':
      return 'Paid';
    case 'FAILED':
      return 'Failed';
    case 'EXPIRED':
      return 'Expired';
    default:
      return props.status;
  }
});

const statusVariant = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return 'secondary';
    case 'PAID':
      return 'default';
    case 'FAILED':
      return 'destructive';
    case 'EXPIRED':
      return 'outline';
    default:
      return 'outline';
  }
});
</script>
