<script setup lang="ts">
import type { TaskFilter } from '@/types'

const emit = defineEmits<{ changeFilter: [newFilter: TaskFilter] }>()
const props = defineProps<{ buttonFilter: TaskFilter }>()

function handleButtonClick() {
  emit('changeFilter', props.buttonFilter)
}
</script>

<template>
  <button v-on:click="handleButtonClick"><slot /></button>
</template>
