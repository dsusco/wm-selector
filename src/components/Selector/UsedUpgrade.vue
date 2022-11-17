<template>
  <tr class="used unit upgrade" tabindex="0" @click="remove" @keyup.enter="remove">
    <td class="number">({{number}})</td>
    <td class="id">{{upgradeID}}</td>
    <td class="pointsCost">({{pointsCost}})</td>
  </tr>
</template>

<script>
import store from '@/store';

export default {
  name: 'UsedUpgrade',
  computed: {
    number () {
      return store.getters.units[this.unitID].upgrades[this.upgradeID].number;
    },
    pointsCost () {
      return store.getters.units[this.unitID].upgrades[this.upgradeID].pointsCost;
    }
  },
  methods: {
    remove () {
      store.dispatch('setUnitUpgradeNumber', {
        upgradeID: this.upgradeID,
        unitID: this.unitID,
        number: store.getters.units[this.unitID].upgrades[this.upgradeID].number - 1
      });
    }
  },
  props: ['unitID', 'upgradeID']
};
</script>

<style lang="scss">
  .selector-view .used.unit.upgrade {
    @include _(1.2rem);
  }
</style>
