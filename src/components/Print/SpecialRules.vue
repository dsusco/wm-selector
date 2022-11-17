<template>
  <div class="special-rules">
    <h3 class="handle">Special Rules{{used ? ' Used' : ''}}</h3>

    <dl>
      <template v-for="(specialRule, name) in specialRules">
        <dt :key="name + '_order'">{{specialRule.order}}. {{name}}</dt>
        <dd :key="name + '_text'" v-html="marked(name)"></dd>
      </template>
    </dl>
  </div>
</template>

<script>
import _ from 'lodash';
import { marked } from 'marked';

import specialRules from '@/json/special-rules.json';
import store from '@/store';
import versionKey from '@/utils/version-key';

function usedSpecialRules (usedSpecialRules, name) {
  // add the special rule with the same name as the unit/upgrade
  if (store.getters.specialRules[name]) {
    usedSpecialRules[name] = store.getters.specialRules[name];
  }

  // add special rules from unit specialRules
  if (store.getters.units[name] && store.getters.units[name].specialRules) {
    store.getters.units[name].specialRules
      .forEach((specialRule) => usedSpecialRules[specialRule] = store.getters.specialRules[specialRule]);
  }

  // add special rules from upgrade specialRules
  if (store.getters.upgrades[name] && store.getters.upgrades[name].specialRules) {
    store.getters.upgrades[name].specialRules
      .forEach((specialRule) => usedSpecialRules[specialRule] = store.getters.specialRules[specialRule]);
  }

  return usedSpecialRules;
}

export default {
  name: 'SpecialRules',
  computed: {
    specialRules () {
      var specialRules = store.getters.specialRules;

      if (this.used) {
        specialRules = Object.keys(store.getters.upgrades)
          .filter((upgradeID) => store.getters.upgrades[upgradeID].number > 0)
          .reduce(usedSpecialRules,
            Object.keys(store.getters.units)
              .filter((unitID) => store.getters.units[unitID].number > 0)
              .reduce(usedSpecialRules, {})
          );
      }

      // return object sorted by order
      return _(specialRules).toPairs().sortBy((array) => _.last(array).order).fromPairs().value();
    }
  },
  methods: {
    marked: (name) => marked((store.getters.specialRules[name].text || specialRules[versionKey[store.getters.version]][name].text).join('\n'))
  },
  props: ['used']
};
</script>

<style lang="scss">
  .special-rules {
  }
</style>
