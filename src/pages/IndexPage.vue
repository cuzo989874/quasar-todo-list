<template>
  <q-page class="index-page">
    <div class="todo-list q-pa-md" v-if="todos.length">
      <q-list bordered separator>
        <q-item v-ripple v-for="(todo, index) in todos" :key="todo.id">
          <q-item-section avatar>
            <q-checkbox v-model="todo.completed" />
          </q-item-section>
          <q-item-section>{{ todo.title }}</q-item-section>
          <q-item-section side>
            <q-btn round dense flat icon="delete" @click="deleteTodo(index)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <todo-form @submit="addTodo" />
  </q-page>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import todoForm from 'pages/TodoForm.vue';
import type { Todo } from 'components/models';

const todos = reactive<Todo[]>([]);

function addTodo(formValue: Pick<Todo, 'title' | 'description' | 'activateAt'>) {
  todos.push({
    id: Date.now(),
    title: formValue.title,
    description: formValue.description,
    activateAt: formValue.activateAt || new Date().toString(),
    finishedAt: '',
    completed: false,
  });
}
function deleteTodo(index: number) {
  todos.splice(index, 1);
}
</script>
<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 50px);
}
.todo-list {
  flex-grow: 1;
  overflow: auto;
}
</style>
