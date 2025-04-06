<template>
  <q-list bordered>
    <q-item v-ripple v-for="todo in todoList" :key="todo.id">
      <q-item-section avatar>
        <q-checkbox
          :model-value="todo.completed"
          @update:model-value="_onTodoCompletedChange(todo, $event)"
        />
      </q-item-section>
      <q-item-section>{{ todo.title }}</q-item-section>
      <q-item-section side>
        <q-btn round dense flat icon="delete" @click="deleteTodo(todo)" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import { todoStore } from 'src/stores/todo-store';
import { formatDatTime } from 'src/utils/formatter';
import type { Todo } from './models';

defineProps({
  todoList: {
    type: Array<Todo>,
    required: true,
  },
});

const TodoStore = todoStore();

function _onTodoCompletedChange(todo: Todo, completed: boolean) {
  todo.completed = completed;
  todo.finishedAt = completed ? formatDatTime(new Date()) : '';
  console.log(todo.finishedAt, todo);
}

function deleteTodo(todo: Todo) {
  TodoStore.remove(todo);
}
</script>
