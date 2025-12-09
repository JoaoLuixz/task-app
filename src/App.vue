<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from './types'

const tasks = ref<Task[]>([])
const newTaskContent = ref<string>('')
function addTask() {
  if (!newTaskContent.value.trim()) return
  const newTask: Task = { id: crypto.randomUUID(), content: newTaskContent.value, isDone: false }
  tasks.value.push(newTask)
  newTaskContent.value = ''
}
</script>

<template>
  <h1>Task App</h1>

  <form @submit.prevent="addTask">
    <input v-model="newTaskContent" />
    <button>Add</button>
  </form>

  <div v-for="task in tasks" :key="task.id">
    <p>{{ task.content }}</p>
    <input type="checkbox" :checked="task.isDone" />
  </div>
</template>

<style scoped></style>
