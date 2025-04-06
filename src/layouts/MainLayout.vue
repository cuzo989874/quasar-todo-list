<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <DrawerLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DrawerLink, { type DrawerLinksProps } from 'components/DrawerLink.vue';

const linksList: DrawerLinksProps[] = [
  {
    title: 'Today',
    icon: 'today',
    link: '/todo/today',
  },
  {
    title: 'Todos',
    icon: 'list',
    link: '/todo/todos',
  },
  {
    title: 'Completed',
    icon: 'checklist',
    link: '/todo/completed',
  },
  {
    title: 'Calander',
    icon: 'calendar_month',
    link: '/calendar',
  },
  {
    title: 'Github',
    caption: 'github.com/cuzo989874',
    icon: 'code',
    link: 'https://github.com/cuzo989874',
    target: '_blank',
    external: true,
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
