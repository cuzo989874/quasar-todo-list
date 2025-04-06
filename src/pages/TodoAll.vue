<template>
  <q-list separator>
    <q-expansion-item
      expand-separator
      :label="`${displayDate(date)} (${todoList.length})`"
      v-for="(todoList, date) in todoListWithDate"
      :key="date"
      default-opened
    >
      <todo-list :todo-list="todoList" />
    </q-expansion-item>
  </q-list>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import TodoList from 'components/TodoList.vue';

import { todoStore } from 'stores/todo-store';
import { TodoBus } from 'src/bus/todo-bus';
import { formatDate } from 'src/utils/formatter';

const TodoStore = todoStore();
const todoListWithDate = ref(TodoStore.getListWithDate());

let todayStr: string;
let yesterdayStr: string;
let tomorrowStr: string;
_resetDate();

TodoBus.on('updatedTodoList', () => reGetTodoList());

function reGetTodoList() {
  todoListWithDate.value = TodoStore.getListWithDate();
}

function displayDate(date: string) {
  switch (date) {
    case todayStr:
      return 'Today';
    case yesterdayStr:
      return 'Yesterday';
    case tomorrowStr:
      return 'Tomorrow';
    default:
      return date;
  }
}

function _resetDate() {
  todayStr = formatDate(new Date());
  yesterdayStr = formatDate(new Date().valueOf() - 24 * 60 * 60 * 1000);
  tomorrowStr = formatDate(new Date().valueOf() + 24 * 60 * 60 * 1000);
}
</script>
