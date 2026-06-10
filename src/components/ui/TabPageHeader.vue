<template>
  <DynamicHeader
    :title="title"
    :status="status"
    :status-dot="statusDot"
    :accent="accent"
  >
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
  </DynamicHeader>
</template>

<script setup>
import DynamicHeader from '@/components/ui/DynamicHeader.vue'

defineProps({
  module: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  status: { type: String, default: '' },
  statusDot: { type: Boolean, default: false },
  accent: {
    type: String,
    default: 'stone',
    validator: (value) => ['stone', 'indigo', 'blue', 'teal', 'amber', 'violet'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'overlay'].includes(value)
  },
  sticky: { type: Boolean, default: false }
})
</script>
