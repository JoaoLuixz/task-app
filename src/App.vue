<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task } from './types'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import { getFromLocalStorage, saveOnLocalStorage } from './utils/localStorage'

const tasks = ref<Task[]>(getFromLocalStorage())

const hasTasks = computed(() => tasks.value.length > 0)

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

watch(tasks.value, () => {
  saveOnLocalStorage(tasks.value)
})
</script>

<template>
  <main>
    <div class="card">
      <div>
        <h1>Task App</h1>
        <TaskForm @addTask="addTask" />
        <div
          class="task-list-container"
          :class="{ 'justify-center': !hasTasks, ' justify-start': hasTasks }"
        >
          <TaskList :tasks @toggleTask="toggleTask" @deleteTask="deleteTask" />
          <span v-if="tasks.length === 0">No tasks</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.justify-center {
  justify-content: center;
}

.justify-start {
  justify-content: start;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: cadetblue;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    height: 100%;
    justify-content: center;
    gap: 0.5rem;
  }
}

.task-list-container {
  background-color: beige;
  width: 100%;
  height: 50%;
  padding: 0.4rem;
  border-radius: 0.5rem;
  overflow: auto;
}

.card {
  width: 60%;
  height: 60%;
  background-color: cornflowerblue;
  border-radius: 2%;
  box-shadow: 0 0 1rem;
}
</style>
