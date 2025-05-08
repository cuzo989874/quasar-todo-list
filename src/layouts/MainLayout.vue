<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleNavigator" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <main-layout-navigator ref="navigator" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, useTemplateRef } from 'vue';

import MainLayoutNavigator from 'components/features/MainLayoutNavigator.vue';

const mainLayoutNavigatorRef =
  useTemplateRef<ComponentPublicInstance<typeof MainLayoutNavigator>>('navigator');

function toggleNavigator() {
  mainLayoutNavigatorRef.value?.toggle();
}
</script>
