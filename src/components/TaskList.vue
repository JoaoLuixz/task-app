<script setup lang="ts">
import type { Task } from '@/types'

defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{ toggleTask: [taskId: string] }>()

function toggleTask(taskId: string) {
  emit('toggleTask', taskId)
}
</script>
<template>
  <div v-for="task in tasks" :key="task.id">
    <p>{{ task.content }}</p>
    <input type="checkbox" @click="toggleTask(task.id)" :checked="task.isDone" />
  </div>
</template>
