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
    validator: (value) => ['PENDING', 'APPROVED', 'REJECTED'].includes(value),
  },
});

const statusText = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return 'Pending';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    default:
      return props.status;
  }
});

const statusVariant = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return 'secondary'; // Yellow-ish
    case 'APPROVED':
      return 'default'; // Green-ish
    case 'REJECTED':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
});
</script>
