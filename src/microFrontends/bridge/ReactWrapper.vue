<template>
  <div ref="reactRoot"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const reactRoot = ref<HTMLElement | null>(null);
let reactUnmount: (() => void) | null = null;

onMounted(async () => {
  if (!reactRoot.value) return;

  const remoteModule = await import('../react-pomodoro/src/renderPomodoro.tsx');

  // 掛載 React 組件，這裡假設 mount 回傳卸載函式
  reactUnmount = remoteModule.mount(reactRoot.value);
});

onBeforeUnmount(() => {
  reactUnmount?.(); // 卸載 React 組件，避免記憶體洩漏
});
</script>
