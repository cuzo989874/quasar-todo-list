<template>
  <q-page class="column">
    <div class="q-ma-md" style="flex-grow: 1" v-if="todos.length">
      <q-list bordered separator>
        <q-item v-ripple v-for="(todo, index) in todos" :key="todo.id">
          <q-item-section avatar>
            <q-checkbox v-model="todo.completed" />
          </q-item-section>
          <q-item-section>{{ todo.content }}</q-item-section>
          <q-item-section side>
            <q-btn round dense flat icon="delete" @click="deleteTodo(index)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <form class="q-pa-md q-my-auto" @submit="addTodo()">
      <q-input
        v-model="newTodo"
        placeholder="Please write something todo here..."
        outlined
        style="width: 100%"
      >
        <template v-slot:after>
          <q-btn color="primary" round dense flat icon="send" />
        </template>
      </q-input>
    </form>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Todo } from 'components/models';

const todos = reactive<Todo[]>([]);
const newTodo = ref('');

function addTodo() {
  console.log(newTodo.value);
  if (!newTodo.value) {
    return;
  }
  todos.push({ id: Date.now(), content: newTodo.value, completed: false });
  newTodo.value = '';
}
function deleteTodo(index: number) {
  todos.splice(index, 1);
}
</script>
