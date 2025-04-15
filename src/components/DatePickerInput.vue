<template>
  <q-input :label="props.label" v-model="_proxyDate" outlined @update:model-value="_checkProxyWithDebounce()" @blur="_checkProxy()">
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
import { QPopupProxy } from 'quasar';
import { formatDate } from 'src/utils/formatter';
import { watch, useTemplateRef, ref } from 'vue';


const _model = defineModel({
  type: String,
  default: '',
  required: true
});
const _proxyDate = ref(_model.value);

const props = defineProps<{ label: string, }>();
const PopupProxy = useTemplateRef<QPopupProxy>('PopupProxy');
let _proxyModelChangeDebounce: NodeJS.Timeout | null = null;

function _checkProxy() {
  if (_proxyDate.value.trim() === '') {
    _model.value = '';
    return;
  }
  if (/^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/.test(_proxyDate.value)) {
    const formattedDate = formatDate(_proxyDate.value)
    if (formattedDate !== 'Invalid Date') {
      _model.value = formattedDate;
      return;
    }
  }
  _proxyDate.value = '';
}

function _checkProxyWithDebounce() {
  if (_proxyModelChangeDebounce) {
    clearTimeout(_proxyModelChangeDebounce);
  }
  _proxyModelChangeDebounce = setTimeout(() => _checkProxy(), 1500);
}

watch(_model, (newValue) => {
  _proxyDate.value = _model.value;

  PopupProxy.value?.hide();
});
</script>
