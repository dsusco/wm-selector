<template>
  <div class="print-item army-rules">
    <h3>Army Rules</h3>

    <div v-for="(armyRule, index) in armyRules" :key="'army_rule_' + index">
      <h4 v-if="armyRule.id">{{ armyRule.id }}</h4>
      <div v-html="marked(armyRule.text)"></div>
    </div>
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
  .print-item.army-rules {
  }
</style>
