<template>
  <q-dialog ref="dialogRef">
    <q-card style="min-width: min(95vw, 400px)">
      <q-card-section class="row q-pb-none text-h6">
        Edit Todo
      </q-card-section>
      <q-card-section class="column">
        <q-input
          v-model="title"
          label="Title"
          outlined
          autofocus
          :rules="[val => !!val || 'Title is required']"
        />
        <date-picker-input
          class="q-mb-md"
          v-model="activateAt"
          label="Activate Date"
          :rules="[val => !!val || 'Activate Date is required']"
        />
        <q-input
          v-model="description"
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

const emits = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
]);

const props = defineProps<Todo>();

const title = ref(props.title);
const description = ref(props.description);
const activateAt = ref(props.activateAt);

function save() {
  emits('ok', {
    ...props,
    title: title.value,
    description: description.value,
    activateAt: activateAt.value,
  });
}
</script>
