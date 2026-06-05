<script setup lang="ts">
import type { TaskFilter } from '@/types';

const emit = defineEmits<{ changeFilter: [newFilter: TaskFilter] }>();
const props = defineProps<{ buttonFilter: TaskFilter; isActive: boolean }>();

function handleButtonClick() {
  emit('changeFilter', props.buttonFilter);
}
</script>

<template>
  <button v-on:click="handleButtonClick" :class="{ isButtonSelected: isActive }"><slot /></button>
</template>

<style scoped>
.isButtonSelected {
  background-color: slategray;
}
</style>
