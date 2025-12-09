<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ addTask: [taskContent: string] }>()
const newTaskContent = ref<string>('')

function addTask() {
  if (!newTaskContent.value.trim()) return
  emit('addTask', newTaskContent.value)
  newTaskContent.value = ''
}
</script>

<template>
  <form @submit.prevent="addTask">
    <input v-model="newTaskContent" />
    <button>Add</button>
  </form>
</template>
