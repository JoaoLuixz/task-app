<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import type { Task, TaskFilter } from './types';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
import FilterButton from './components/FilterButton.vue';
import { useIndexDB } from './composables/useIndexDB.ts';

const tasks = ref<Task[]>([]);

const hasTasks = computed(() => tasks.value.length > 0);

const filteringTasksBy = ref<TaskFilter>('all');

const db = useIndexDB();

const filteredTasks = computed(() => {
  return tasks.value.filter((tasks) => {
    if (filteringTasksBy.value === 'all') return true;

    if (filteringTasksBy.value === 'done') return tasks.isDone;

    return !tasks.isDone;
  });
});

const tasksDownloadLink = computed(() => {
  const stringifiedTasks = JSON.stringify(tasks.value);

  const downloadData = `data:text/json;charset=utf-8,${encodeURIComponent(stringifiedTasks)}`;

  return downloadData;
});

function addTask(newTaskContent: string) {
  db.createTask({ content: newTaskContent, isDone: false }).then(({ error, task: createdTask }) => {
    if (error !== undefined) {
      console.error(error.message);
      return;
    }

    if (createdTask === undefined) {
      console.error('Task not created');
      return;
    }

    tasks.value.push(createdTask);
  });
}

function toggleTask(taskId: number) {
  db.updateTask(taskId).then(({ error, task: updatedTask }) => {
    if (error !== undefined) {
      console.error(error.message);
      return;
    }

    if (updatedTask === undefined) {
      console.error('could no find task');
      return;
    }

    const taskToUpdate = tasks.value.find((task) => task.id === updatedTask?.id);

    if (taskToUpdate !== undefined) taskToUpdate.isDone = updatedTask.isDone;
  });
}

function deleteTask(taskId: number) {
  db.deleteTask(taskId).then(({ error, task: deletedTask }) => {
    if (error !== undefined) {
      console.error(error.message);

      return;
    }

    if (deletedTask === undefined) {
      console.error('Could not delete task');
      return;
    }

    tasks.value = tasks.value.filter((task) => task.id !== deletedTask.id);
  });
}

function changeTaskListFilter(newFilter: TaskFilter) {
  filteringTasksBy.value = newFilter;
}

function onTasksUpload(event: Event) {
  const uploadedFile = (event.target as HTMLInputElement).files?.item(0);

  if (!uploadedFile) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const uploadedTasks: Task[] = JSON.parse(event.target?.result as string);

      for (const task of uploadedTasks) {
        db.createTask({ content: task.content, isDone: task.isDone }).then(
          ({ error, task: createdTask }) => {
            if (error !== undefined || createdTask === undefined) {
              console.error(error?.message);
              return;
            }

            tasks.value.push(createdTask);
          },
        );
      }
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  reader.readAsText(uploadedFile);
}
watchEffect(async () => {
  const { error, tasks: dbTasks } = await db.getTasks();
  if (error !== undefined) {
    console.error(error.message);
    return;
  }

  tasks.value = dbTasks;
});
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
            <label for="tasksUploadInput" class="uploadTasksLabel">Upload</label>
            <input
              type="file"
              accept=".json"
              id="tasksUploadInput"
              @change="onTasksUpload"
              hidden
            />
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
  flex-direction: row;
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
.uploadTasksLabel {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>
