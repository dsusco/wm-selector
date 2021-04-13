<template>
  <div class="url">
    <div class="handle">
      <a :href="url()">{{url()}}</a>
    </div>
  </div>
</template>

<script>
import Save from '@/views/Save';

export default {
  name: 'URL',
  methods: {
    url: () => Save.methods.url()
  }
};
</script>

<style lang="scss">
  .url {
  }
</style>
