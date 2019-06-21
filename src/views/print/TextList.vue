<template>
  <pre class="text-list"><template v-if="label">{{label}}
</template>{{armyList}}, {{pointsCost}} points
{{version}}
--------------------------------
<template v-for="(unit, unitName) in usedUnits">{{padLeft(unit.pointsCost)}} - {{unit.number}} {{unitName}}<template v-for="(upgrade, upgradeName) in unit.upgrades">
{{padLeft(' ')}} - {{upgrade.number}} {{upgradeName}} ({{upgrade.pointsCost}})</template>
</template>--------------------------------
{{pointsCost}} - {{unitCount}}/{{Math.ceil(unitCount / 2)}}</pre>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TextList',
  computed: mapGetters(['armyList', 'label', 'pointsCost', 'unitCount', 'usedUnits', 'version']),
  methods: {
    padLeft (str) {
      var pointsCostLength = ('' + this.pointsCost).length;

      str = '' + str;

      while (str.length < pointsCostLength) {
        str = ' ' + str;
      }

      return str;
    }
  }
};
</script>

<style lang="scss">
  .text-list {
    margin: 0;
  }
</style>
