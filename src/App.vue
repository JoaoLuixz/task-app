<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task, TaskFilter } from './types'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import { getFromLocalStorage, saveOnLocalStorage } from './utils/localStorage'
import FilterButton from './components/FilterButton.vue'

const tasks = ref<Task[]>(getFromLocalStorage())

const hasTasks = computed(() => tasks.value.length > 0)

const filteringTasksBy = ref<TaskFilter>('all')

const filteredTasks = computed(() => {
  return tasks.value.filter((tasks) => {
    if (filteringTasksBy.value === 'all') return true

    if (filteringTasksBy.value === 'done') return tasks.isDone

    return !tasks.isDone
  })
})

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

function changeTaskListFilter(newFilter: TaskFilter) {
  filteringTasksBy.value = newFilter
}

const tasksDownloadLink = computed(() => {
  const stringifiedTasks = JSON.stringify(tasks.value)

  const donwloadData = `data:text/json;charset=utf-8,${encodeURIComponent(stringifiedTasks)}`

  return donwloadData
})

watch([tasks, tasks.value], () => {
  saveOnLocalStorage(tasks.value)
})
</script>

<template>
  <main>
    <div class="card">
      <div>
        <h1>Task App</h1>
        <TaskForm @addTask="addTask" />
        <div class="action-buttons-container">
          <div class="download-container">
            <a :href="tasksDownloadLink" download="tasks.json">Donwload</a>
          </div>
          <div class="filter-buttons-container">
            <FilterButton @changeFilter="changeTaskListFilter" buttonFilter="done"
              >Done</FilterButton
            >
            <FilterButton @changeFilter="changeTaskListFilter" buttonFilter="notDone"
              >Todo</FilterButton
            >
            <FilterButton @changeFilter="changeTaskListFilter" buttonFilter="all">All</FilterButton>
          </div>
        </div>
        <div
          class="task-list-container"
          :class="{ 'justify-center': !hasTasks, ' justify-start': hasTasks }"
        >
          <TaskList :tasks="filteredTasks" @toggleTask="toggleTask" @deleteTask="deleteTask" />
          <span v-if="filteredTasks.length === 0">No tasks</span>
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

.filter-buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: right;
  height: fit-content;
  width: 100%;
}

.download-container {
  display: flex;
  justify-content: left;
  align-items: start;
  width: 100%;
  height: fit-content;
}

.action-buttons-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: fit-content;
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
  padding: 0.4rem;
  border-radius: 0.5rem;
  overflow: auto;
  margin-bottom: 1rem;
}

.card {
  width: 60%;
  height: 80%;
  background-color: cornflowerblue;
  border-radius: 2%;
  box-shadow: 0 0 1rem;
  margin: 1rem 0;
}
</style>
