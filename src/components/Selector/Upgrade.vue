<template>
  <tr class="upgrade" tabindex="0" @click.stop="add" @keyup.enter.stop="add">
    <td class="id">{{upgradeID}}</td>
    <td class="minMax">{{minMax}}</td>
    <td class="points">{{points}}</td>
  </tr>
</template>

<script>
import store from '@/store';

export default {
  name: 'Upgrade',
  computed: {
    minMax () {
      return store.getters.upgrades[this.upgradeID].minMax;
    },
    points () {
      return store.getters.upgrades[this.upgradeID].points;
    }
  },
  methods: {
    add () {
      store.dispatch('setUnitUpgradeNumber', {
        upgradeID: this.upgradeID,
        unitID: this.unitID,
        number: store.getters.units[this.unitID].upgrades[this.upgradeID].number + 1
      });
    }
  },
  props: ['unitID', 'upgradeID']
};
</script>

<style lang="scss">
  tr.upgrade {
  }
</style>
