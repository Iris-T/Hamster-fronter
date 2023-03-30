<template>
  <router-view></router-view>
</template>

<script setup>
  console.log(import.meta.env);
</script>

<style lang="postcss" scoped>
body {
  @apply bg-gray-100;
}

#nprogress .bar {
  background-color: #f4f4f4 !important;
  height: 3px !important;
}
</style>
