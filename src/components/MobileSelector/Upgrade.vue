<template>
  <div :id="tagID" class="upgrade">
    <div class="id">{{upgradeID}} ({{points}})</div>

    <button class="remove-button" @click="remove" :disabled="number < 1">
      <span class="fa fa-minus">
        <span class="sr-only">Remove one {{upgradeID}} from {{unitID}}</span>
      </span>
    </button>

    <span class="number">{{number}}</span>

    <button class="add-button" @click="add" :disabled="unitNumber <= number">
      <span class="fa fa-plus">
        <span class="sr-only">Add one {{upgradeID}} to {{unitID}}</span>
      </span>
    </button>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'Upgrade',
  computed: {
    number () {
      return store.getters.units[this.unitID].upgrades[this.upgradeID].number;
    },
    points () {
      return store.getters.upgrades[this.upgradeID].points;
    },
    tagID () {
      return (this.unitID + '_unit_' + this.upgradeID + '_upgrade').toLowerCase().replace(/\W+/g, '_');
    },
    unitNumber () {
      return store.getters.units[this.unitID].number;
    }
  },
  methods: {
    add () {
      store.dispatch('setUnitUpgradeNumber', {
        upgradeID: this.upgradeID,
        unitID: this.unitID,
        number: this.number + 1
      });
    },
    remove () {
      store.dispatch('setUnitUpgradeNumber', {
        upgradeID: this.upgradeID,
        unitID: this.unitID,
        number: this.number - 1
      });
    }
  },
  props: ['unitID', 'upgradeID']
};
</script>

<style lang="scss">
  .mobile-selector-view .upgrade {
    position: relative;

    &:nth-child(odd) {
      background: $_color_light;
    }
  }
</style>
