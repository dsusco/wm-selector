<template>
  <main id="main" class="text-view">
    <TextList />
  </main>
</template>

<script>
import TextList from '@/views/print/TextList';

export default {
  name: 'TextView',
  components: { TextList }
};
</script>

<style lang="scss">
  .text-view {
  }
</style>
