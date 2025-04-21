<template>
  <h5 class="q-mt-none q-mb-sm" style="font-size: 1em">Todo({{ uncompletedTodo.length }})</h5>
  <todo-list :todo-list="uncompletedTodo" />
  <h5 class="q-my-sm" style="font-size: 1em">Completed({{ completedTodo.length }})</h5>
  <todo-list :todo-list="completedTodo" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import type { Todo } from 'components/models';
import TodoList from 'components/features/TodoList.vue';

import { todoStore } from 'stores/todo-store';
import { TodoBus } from 'src/bus/todo-bus';
import { formatDate } from 'src/utils/formatter';

const TodoStore = todoStore();
const todoList = ref(getTodayTodoList());

const completedTodo = computed(() =>
  todoList.value
    .filter((todo) => todo.completed)
    .sort((todo) => new Date(todo.finishedAt).valueOf()),
);
const uncompletedTodo = computed(() => todoList.value.filter((todo) => !todo.completed));

TodoBus.on('updatedTodoList', () => reGetTodoList());

function reGetTodoList() {
  todoList.value = getTodayTodoList();
}

function getTodayTodoList(): Array<Todo> {
  const today = new Date();
  return TodoStore.getListByDate(formatDate(today));
}
</script>
