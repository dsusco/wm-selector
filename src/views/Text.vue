<template>
  <main class="text-view">
    <TextList />
  </main>
</template>

<script>
import TextList from '@/components/TextList';

export default {
  name: 'TextView',
  components: { TextList }
};
</script>

<style lang="scss">
  .text-view {
  }
</style>
