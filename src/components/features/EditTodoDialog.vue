<template>
  <q-dialog ref="dialogRef">
    <q-card style="min-width: min(95vw, 400px)">
      <q-card-section class="column">
        <q-input
          v-model="_title"
          label="Title"
          outlined
          autofocus
          :rules="[val => !!val || 'Title is required']"
        />
        <date-picker-input
          class="q-mb-md"
          v-model="_activateAt"
          label="Activate Date"
          :rules="[val => !!val || 'Activate Date is required']"
        />
        <q-input
          v-model="_description"
          label="Description(Optional)"
          outlined
          autofocus
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" color="primary" flat v-close-popup />
        <q-btn icon="save" label="Save" color="primary" @click="save()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar'

import DatePickerInput from '../DatePickerInput.vue';
import type { Todo } from '../models';
import { formatDate } from 'src/utils/formatter';

const emits = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
]);

const props = defineProps<Todo>();

const _title = ref(props.title);
const _description = ref(props.description);
const _activateAt = ref(props.activateAt);

function save() {
  emits('ok', {
    ...props,
    title: _title.value,
    description: _description.value,
    activateAt: _activateAt.value || formatDate(new Date()),
  });
}
</script>
