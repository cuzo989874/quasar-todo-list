<template>
  <q-list bordered>
    <q-expansion-item v-for="todo in todoList" :key="todo.id" hide-expand-icon>
      <template #header>
        <q-item-section avatar>
          <q-checkbox
            :model-value="todo.completed"
            @update:model-value="onTodoCompletedChange(todo, $event)"
          />
        </q-item-section>
        <q-item-section>{{ todo.title }}</q-item-section>
        <!-- <q-item-section side>
          <q-btn round dense flat icon="delete" @click="deleteTodo(todo)" />
        </q-item-section> -->
      </template>
      <template #default>
        <div class="q-pa-sm" v-if="todo.completed">
          <span class="text-grey q-mr-sm">Finished at</span>
          <p>{{ todo.finishedAt }}</p>
        </div>
        <div class="q-pa-sm" v-if="todo.description">
          <span class="text-grey q-mr-sm">Description</span>
          <p>{{ todo.description }}</p>
        </div>
        <footer class="todo__footer q-pa-sm text-grey">
          <q-btn icon="edit" flat dense round @click="editTodo(todo)" />
          <q-btn icon="delete" flat dense round @click="deleteTodo(todo)" />
        </footer>
      </template>
    </q-expansion-item>
  </q-list>
</template>
<script setup lang="ts">
import { Dialog } from 'quasar';

import { todoStore } from 'src/stores/todo-store';
import { formatDatTime } from 'src/utils/formatter';
import type { Todo } from '../models';
import EditTodoDialog from './EditTodoDialog.vue';

defineProps({
  todoList: {
    type: Array<Todo>,
    required: true,
  },
});

const TodoStore = todoStore();

function onTodoCompletedChange(todo: Todo, completed: boolean) {
  todo.completed = completed;
  todo.finishedAt = completed ? formatDatTime(new Date()) : '';
  TodoStore.saveTodoList();
}

function editTodo(todo: Todo) {
  const dialog = Dialog.create({
    component: EditTodoDialog,
    componentProps: todo,
    persistent: true
  }).onOk((newTodo) => {
    todo.title = newTodo.title;
    todo.description = newTodo.description;
    todo.activateAt = newTodo.activateAt;
    TodoStore.saveTodoList();
    dialog.hide();
  });
}

function deleteTodo(todo: Todo) {
  TodoStore.remove(todo);
}
</script>
<style lang="scss">
.todo__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
