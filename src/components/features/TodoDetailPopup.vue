<template>
  <q-popup-proxy ref="TodoPopUpRef" :target="_todoPopUpTarget" transition-show="scale" transition-hide="scale" no-parent-event>
    <div class="todo-popup" v-if="_activatePopUpTodo">
      <div class="todo-popup__header">
        <h4>{{ _activatePopUpTodo.title }}</h4>
        <p class="text-grey-4 q-mb-sm">{{ _activatePopUpTodo.activateAt }}</p>
      </div>
      <p class="q-px-sm q-my-sm" v-if="_activatePopUpTodo.description">{{ _activatePopUpTodo.description }}</p>
      <footer class="todo-popup__footer">
        <q-btn icon="rotate_left" flat dense round @click="_changeTodoStatus(_activatePopUpTodo, false)"  v-if="_activatePopUpTodo.completed" />
        <q-btn icon="check" flat dense round @click="_changeTodoStatus(_activatePopUpTodo, true)" v-else />
        <q-btn icon="edit" flat dense round @click="_openEditTodoDialog(_activatePopUpTodo)" />
        <q-btn icon="delete" flat dense round @click="deleteTodo(_activatePopUpTodo)" />
      </footer>
    </div>
  </q-popup-proxy>
</template>
<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { Dialog, QPopupProxy } from 'quasar';

import type { Todo } from '../models';
import { todoStore } from 'stores/todo-store';
import EditTodoDialog from 'components/features/EditTodoDialog.vue';
import { formatDatTime } from 'src/utils/formatter';

const _todoStore = todoStore();
const _TodoPopUpRef = useTemplateRef<QPopupProxy>('TodoPopUpRef');
const _todoPopUpTarget = ref<HTMLElement | undefined>(undefined);
const _activatePopUpTodo = ref<Todo | null>(null);

function open(evt: Event, todo: Todo) {
  console.log(1);
  _todoPopUpTarget.value = evt.currentTarget as HTMLElement;
  _activatePopUpTodo.value = todo;
  _TodoPopUpRef.value?.show(evt);
}

function _changeTodoStatus(todo: Todo, completed: boolean) {
  todo.completed = completed;
  todo.finishedAt = completed ? formatDatTime(new Date()) : '';
  _todoStore.saveTodoList();
}

function deleteTodo(todo: Todo) {
  _todoStore.remove(todo);
}

function _openEditTodoDialog(todo: Todo) {
  const dialog = Dialog.create({
    component: EditTodoDialog,
    componentProps: todo,
    persistent: true
  }).onOk((newContent) => {
    todo.title = newContent.title;
    todo.description = newContent.description;
    todo.activateAt = newContent.activateAt;
    _todoStore.saveTodoList();
    dialog.hide();
  });
}

defineExpose({ open });
</script>
<style lang="scss">
@use 'quasar/src/css/variables' as q;

.todo-popup {
  min-width: 300px;
  max-width: min(95vw, 400px);

  &__header {
    padding: calc(q.$space-base / 2);
    color: white;
    background-color: q.$primary;

    & > h4 {
      font-size: 1.2em;
      line-height: 1.414;
      margin: 0;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: calc(q.$space-base / 4);
    gap: calc(q.$space-base / 2);
    color: q.$grey;
  }
}
</style>
