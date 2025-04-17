<template>
  <form class="q-pa-md q-my-auto" @submit="submit()">
    <div style="display: flex; align-items: flex-start; width: 100%">
      <div style="flex-grow: 1">
        <q-input
          ref="title-input"
          v-model="_title"
          placeholder="Please write something todo here..."
          outlined
          style="width: 100%"
        />
        <div>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <header
                class="text-primary"
                style="display: flex; align-items: center; gap: 8px; margin-right: auto"
              >
                <q-icon name="add_circle" />
                <h4 style="margin: 0 auto auto 0; font-size: 1.2em">Additional Option</h4>
              </header>
            </template>
            <div class="column q-pa-md" style="gap: 8px">
              <div class="row">
                <date-picker-input
                  v-model="_activateAt"
                  label="Activate Date"
                />
              </div>
              <q-input v-model="_description" label="Description(Optional)" outlined />
            </div>
          </q-expansion-item>
        </div>
      </div>
      <q-btn type="submit" class="q-ma-sm" color="primary" icon="send" flat round>
        <q-tooltip>Create Todo</q-tooltip>
      </q-btn>
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { QInput } from 'quasar';

import DatePickerInput from 'components/DatePickerInput.vue';

import { todoStore } from 'src/stores/todo-store';
import { formatDate } from 'src/utils/formatter';

const _title = ref('');
const _description = ref('');
const _activateAt = ref('');

const _titleInputComponent = useTemplateRef<QInput>('title-input');

const _TodoStore = todoStore();

function reset() {
  _title.value = '';
  _description.value = '';
  _activateAt.value = '';
}

function submit() {
  if (!_title.value) {
    throw new Error('Title empty');
  }
  _TodoStore.add({
    id: Date.now(),
    title: _title.value.trim(),
    description: _description.value.trim(),
    activateAt: formatDate(_activateAt.value || new Date()),
    finishedAt: '',
    completed: false,
  });
  reset();
  _titleInputComponent.value?.focus();
}
</script>
