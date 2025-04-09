<template>
  <q-page class="index-page">
    <div class="todo-list-container q-pa-md" v-if="allTodos.length">
      <router-view />
    </div>
    <todo-form />
  </q-page>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

import todoForm from 'components/TodoForm.vue';
import { todoStore } from 'stores/todo-store';

const _TodoStore = todoStore();
const allTodos = reactive(_TodoStore.$state.todoList);
</script>
<style lang="scss">
@use "quasar/src/css/variables" as q;

.index-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 50px);
}
.todo-list-container {
  flex-grow: 1;
  overflow: auto;
  border-bottom: 1px solid q.$grey-4;
}
</style>
