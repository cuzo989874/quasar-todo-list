<template>
  <q-item clickable tag="a" :target="target" v-bind="external ? { href: link } : { to: link }">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface DrawerLinksProps {
  title: string;
  caption?: string;
  link: string;
  icon?: string;
  target?: string;
  external?: boolean;
}

withDefaults(defineProps<DrawerLinksProps>(), {
  caption: '',
  link: '#',
  icon: '',
  target: '_self',
});
</script>
