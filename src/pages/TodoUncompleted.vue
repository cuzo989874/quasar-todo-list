<template>
  <q-list separator>
    <q-expansion-item
      expand-separator
      :label="`${displayDate(date)} (${todoList.length})`"
      v-for="([date, todoList]) in todoListWithDateEntries"
      :key="date"
      default-opened
    >
      <todo-list :todo-list="todoList" />
    </q-expansion-item>
  </q-list>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import TodoList from 'components/features/TodoList.vue';
import type { Todo } from 'components/models';

import { todoStore } from 'stores/todo-store';
import { TodoBus } from 'src/bus/todo-bus';
import { formatDate } from 'src/utils/formatter';

const TodoStore = todoStore();
const todoListWithDateEntries = ref(Object.entries(TodoStore.getListWithDate(true)));

let todayStr: string;
let yesterdayStr: string;
let tomorrowStr: string;
_resetDate();

TodoBus.on('updatedTodoList', (todo, type) => {
  const listWithDateEntry = todoListWithDateEntries.value;
  let todoList: [string, Array<Todo>] | undefined;
  switch (type) {
    case 'new':
      todoList = listWithDateEntry.find(([date]) => todo.activateAt === date);
      if (todoList) {
        todoList[1].push(todo);
      } else {
        listWithDateEntry.push([todo.activateAt, [todo]]);
      }
      listWithDateEntry.sort(([a], [b]) => new Date(a).valueOf() - new Date(b).valueOf());
      break;
    case 'remove':
      todoList = listWithDateEntry.find(([date]) => todo.activateAt === date);
      if (todoList) {
        const index = todoList[1].findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          todoList[1].splice(index, 1);
          if (todoList[1].length === 0) {
            listWithDateEntry.splice(listWithDateEntry.indexOf(todoList), 1);
          }
        }
      }
      break;
  }
});

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
