<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from './types'
import TaskForm from './components/TaskForm.vue'

const tasks = ref<Task[]>([])

function addTask(newTaskContent: string) {
  const newTask: Task = { id: crypto.randomUUID(), content: newTaskContent, isDone: false }
  tasks.value.push(newTask)
}
</script>

<template>
  <h1>Task App</h1>
  <TaskForm @addTask="addTask" />
  <div v-for="task in tasks" :key="task.id">
    <p>{{ task.content }}</p>
    <input type="checkbox" :checked="task.isDone" />
  </div>
</template>

<style scoped></style>
