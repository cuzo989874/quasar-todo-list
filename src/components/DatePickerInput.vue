<template>
  <q-input :label="props.label" v-model="proxyDate" outlined @update:model-value="checkProxyWithDebounce()" @blur="checkProxy()">
      <template v-slot:append>
        <q-btn icon="event" color="primary" flat round>
          <q-popup-proxy
            ref="PopupProxy"
            transition-show="scale"
            transition-hide="scale"
            cover
          >
            <q-date v-model="_model" mask="YYYY-MM-DD" />
          </q-popup-proxy>
        </q-btn>
      </template>
    </q-input>
</template>
<script lang="ts" setup>
import { QPopupProxy, type ValidationRule } from 'quasar';
import { formatDate } from 'src/utils/formatter';
import { watch, useTemplateRef, ref } from 'vue';

const _model = defineModel({
  type: String,
  default: '',
  required: true
});
const proxyDate = ref(_model.value);

const props = defineProps<{ label: string, rules?: Array<ValidationRule> | undefined }>();
const PopupProxy = useTemplateRef<QPopupProxy>('PopupProxy');
let proxyModelChangeDebounce: NodeJS.Timeout | null = null;

function checkProxy() {
  if (proxyDate.value.trim() === '') {
    _model.value = '';
    return;
  }
  if (/^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/.test(proxyDate.value)) {
    const formattedDate = formatDate(proxyDate.value)
    if (formattedDate !== 'Invalid Date') {
      _model.value = formattedDate;
      return;
    }
  }
  proxyDate.value = '';
}

function checkProxyWithDebounce() {
  if (proxyModelChangeDebounce) {
    clearTimeout(proxyModelChangeDebounce);
  }
  proxyModelChangeDebounce = setTimeout(() => checkProxy(), 1500);
}

watch(_model, (newValue) => {
  proxyDate.value = _model.value;

  PopupProxy.value?.hide();
});
</script>
