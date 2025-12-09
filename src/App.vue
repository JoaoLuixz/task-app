<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from './types'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'

const tasks = ref<Task[]>([])

function addTask(newTaskContent: string) {
  const newTask: Task = { id: crypto.randomUUID(), content: newTaskContent, isDone: false }
  tasks.value.push(newTask)
}

function toggleTask(taskId: string) {
  const task = tasks.value.find((task) => task.id === taskId)
  if (task) task.isDone = !task.isDone
}

function deleteTask(taskId: string) {
  tasks.value = tasks.value.filter((task) => task.id !== taskId)
}
</script>

<template>
  <h1>Task App</h1>
  <TaskForm @addTask="addTask" />
  <TaskList :tasks @toggleTask="toggleTask" @deleteTask="deleteTask" />
</template>

<style scoped></style>
