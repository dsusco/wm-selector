<template>
  <div class="print-item special-rules">
    <h3>Special Rules{{ used ? " Used" : "" }}</h3>

    <dl>
      <template v-for="(specialRule, name) in specialRules">
        <dt :key="'special_rule_name' + specialRule.order">
          {{ specialRule.order }}. {{ name }}
        </dt>
        <dd
          :key="'special_rule_text' + specialRule.order"
          v-html="marked(name)"
        ></dd>
      </template>
    </dl>
  </div>
</template>

<script>
import Marked from 'marked';

import specialRules from '@/json/special-rules.json';
import store from '@/store';

export default {
  name: 'SpecialRules',
  computed: {
    specialRules () {
      function usedSpecialRules (usedSpecialRules, specialRuleID) {
        // add the special rule named for the unit
        if (store.getters.specialRules[specialRuleID]) {
          usedSpecialRules[specialRuleID] = store.getters.specialRules[specialRuleID];
        }

        // add special rules from the specialRules
        if (store.getters.units[specialRuleID] && store.getters.units[specialRuleID].specialRules) {
          (store.getters.units[specialRuleID])
            .forEach((specialRule) => usedSpecialRules[specialRule] = store.getters.specialRules[specialRule]);
        }

        return usedSpecialRules;
      }

      return this.used ?
        Object.keys(store.getters.upgrades)
          .filter((upgradeID) => store.getters.upgrades[upgradeID].number > 0)
          .reduce(usedSpecialRules,
            Object.keys(store.getters.units)
              .filter((unitID) => store.getters.units[unitID].number > 0)
              .reduce(usedSpecialRules, {})
          ) : store.getters.specialRules;
    }
  },
  methods: {
    marked (name) {
      var text;

      try {
        text = store.getters.specialRules[name].text;
      } catch {
        text = specialRules[name].text;
      }

      return Marked(text.join('\n'));
    }
  },
  props: ['used']
};
</script>

<style lang="scss">
  .print-item.special-rules {
  }
</style>
