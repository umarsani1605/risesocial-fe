<template>
  <Badge :variant="scholarshipVariant">
    {{ scholarshipText }}
  </Badge>
</template>

<script setup>
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['FULLY_FUNDED', 'SELF_FUNDED'].includes(value),
  },
});

const scholarshipText = computed(() => {
  switch (props.type) {
    case 'FULLY_FUNDED':
      return 'Fully Funded';
    case 'SELF_FUNDED':
      return 'Self Funded';
    default:
      return props.type;
  }
});

const scholarshipVariant = computed(() => {
  switch (props.type) {
    case 'FULLY_FUNDED':
      return 'default'; // Blue-ish
    case 'SELF_FUNDED':
      return 'outline'; // Purple-ish with outline
    default:
      return 'secondary';
  }
});
</script>
