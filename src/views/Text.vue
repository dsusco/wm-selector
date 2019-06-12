<template>
  <main id="main" class="text-view">
    <pre><template v-if="label">{{label}}
</template>{{armyList}}, {{pointsCost}} points
{{version}}
--------------------------------
<template v-for="unit in units">{{padLeft(unit.pointsCost)}} - {{unit.number}} {{unit.id}}<template v-for="upgrade in unitUpgrades(unit.id)">
{{padLeft(' ')}} - {{upgrade.number}} {{upgrade.id}} ({{upgrade.pointsCost}})</template>
</template>--------------------------------
{{pointsCost}} - {{unitCount}}/{{Math.ceil(unitCount / 2)}}</pre>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

import store from '@/store';

export default {
  name: 'TextView',
  computed: Object.assign({
      units: () => Object.keys(store.getters.units)
        .filter((id) => store.getters.units[id].number > 0)
          .map((id) => Object.assign({ id: id }, store.getters.units[id])),
    },
    mapGetters(['armyList', 'label', 'pointsCost', 'unitCount', 'version'])
  ),
  methods: {
    padLeft (str) {
      var pointsCostLength = ('' + this.pointsCost).length;

      str = '' + str;

      while (str.length < pointsCostLength) {
        str = ' ' + str;
      }

      return str;
    },
    unitUpgrades (unitID) {
      return Object.keys(store.getters.units[unitID].upgrades || {})
        .filter((id) => store.getters.units[unitID].upgrades[id].number > 0)
          .map((id) => Object.assign({ id: id }, store.getters.units[unitID].upgrades[id]));
    }
  }
};
</script>

<style lang="scss">
  .text-view {
    pre {
      margin: 0;
    }
  }
</style>
