<script setup lang="ts">
import type { Task } from '@/types'

defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{ toggleTask: [taskId: string]; deleteTask: [taskId: string] }>()

function handleTaskToggle(taskId: string) {
  emit('toggleTask', taskId)
}

function handleTaskDeletion(taskId: string) {
  emit('deleteTask', taskId)
}
</script>

<template>
  <div class="task-container" v-for="task in tasks" :key="task.id">
    <div class="task-content-container">
      <p :class="{ done: task.isDone }">{{ task.content }}</p>
      <input type="checkbox" @click="handleTaskToggle(task.id)" :checked="task.isDone" />
    </div>
    <button @click="handleTaskDeletion(task.id)">Delete</button>
  </div>
</template>

<style scoped>
.done {
  text-decoration: line-through;
}

.task-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: yellowgreen;
  border-radius: 0.5rem;

  button {
    flex-grow: 1;
  }
}

.task-content-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  p {
    font-weight: bold;
  }

  input {
    height: fit-content;
    width: fit-content;
    transform: scale(2);
  }
}
</style>
