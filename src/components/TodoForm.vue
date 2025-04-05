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
              <q-input v-model="_description" label="description" outlined />
              <div class="row">
                <q-input label="Activate Date" v-model="_date" outlined>
                  <template v-slot:append>
                    <q-btn icon="event" color="primary" flat round>
                      <q-popup-proxy
                        @before-show="_preloadProxyDate"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="_proxyDate">
                          <div class="row items-center justify-end q-gutter-sm">
                            <q-btn label="Cancel" color="primary" flat v-close-popup />
                            <q-btn
                              label="OK"
                              color="primary"
                              flat
                              @click="_saveProxyDate"
                              v-close-popup
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-btn>
                  </template>
                </q-input>
              </div>
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
import { QInput } from 'quasar';
import { todoStore } from 'src/stores/todo-store';
import { formatDate } from 'src/utils/formatter';
import { ref, useTemplateRef } from 'vue';

const _title = ref('');
const _description = ref('');
const _date = ref('');
const _proxyDate = ref<Date | string>(new Date());

const _titleInputComponent = useTemplateRef<QInput>('title-input');

const _TodoStore = todoStore();

function reset() {
  _title.value = '';
  _description.value = '';
  _date.value = '';
}

function submit() {
  if (!_title.value) {
    throw new Error('Title empty');
  }
  _TodoStore.add({
    id: Date.now(),
    title: _title.value.trim(),
    description: _description.value.trim(),
    activateAt: formatDate(_date.value || new Date()),
    finishedAt: '',
    completed: false,
  });
  reset();
  _titleInputComponent.value?.focus();
}

function _preloadProxyDate() {
  _proxyDate.value = _date.value;
}
function _saveProxyDate() {
  _date.value = _proxyDate.value.toString();
}
</script>
