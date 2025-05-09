<template>
  <q-drawer v-model="isDrawerOpened" show-if-above bordered>
    <q-list class="navbar-list">
      <DrawerLink v-for="link in linksList" :key="link.title" v-bind="link" />
      <q-item class="navbar-list__action q-pa-none">
        <q-item-section>
          <react-wrapper />
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import DrawerLink, { type DrawerLinksProps } from 'components/features/DrawerLink.vue';
import ReactWrapper from 'src/microFrontends/bridge/ReactWrapper.vue';

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
    title: 'All',
    icon: 'list_alt',
    link: '/todo/all',
  },
  {
    title: 'Calender',
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

const isDrawerOpened = ref(false);

function toggle() {
  isDrawerOpened.value = !isDrawerOpened.value;
}

defineExpose({
  toggle,
});
</script>
<style lang="scss">
.navbar-list {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__action {
    flex-grow: 1;
    align-items: flex-end;
  }
}
</style>
