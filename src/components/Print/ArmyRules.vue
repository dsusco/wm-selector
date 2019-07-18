<template>
  <div class="army-rules">
    <h3 class="handle">Army Rules</h3>

    <div v-html="marked(armyRules)"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Marked from 'marked';

export default {
  name: 'ArmyRules',
  computed: mapGetters(['armyRules']),
  methods: {
    marked: (text) => Marked(text.join('\n'))
  }
};
</script>

<style lang="scss">
  .army-rules {
    h4 {
      @include _(1.6rem);

      float: left;
      margin: 0;

      &::after {
        content: ':\00a0';
      }
    }
  }
</style>
