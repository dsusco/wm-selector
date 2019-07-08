<template>
  <tr class="used unit" tabindex="0" @click="remove" @keyup.enter="remove">
    <td class="number">{{number}}</td>
    <td class="id">
      {{unitID}}
      <table class="upgrades" v-if="upgrades">
        <thead>
          <tr>
            <th class="id">{{unitID}} Upgrades</th>
            <th class="minMax">Min/Max</th>
            <th class="points">Points</th>
          </tr>
        </thead>
        <tbody>
          <Upgrade v-for="(upgrade, upgradeID) in upgrades" :key="upgradeID" :unitID="unitID" :upgradeID="upgradeID" />
        </tbody>
      </table>
    </td>
    <td class="pointsCost">{{pointsCost}}</td>
  </tr>
</template>

<script>
import Upgrade from '@/components/Selector/Upgrade';
import store from '@/store';

export default {
  name: 'UsedUnit',
  components: { Upgrade },
  computed: {
    number () {
      return store.getters.units[this.unitID].number;
    },
    pointsCost () {
      return store.getters.units[this.unitID].pointsCost;
    },
    upgrades () {
      return store.getters.units[this.unitID].upgrades;
    }
  },
  methods: {
    remove () {
      store.dispatch('setUnitNumber', {
        unitID: this.unitID,
        number: store.getters.units[this.unitID].number - 1
      });
    }
  },
  props: ['unitID']
};
</script>

<style lang="scss">
  tr.used.unit {
    &.hasFocus,
    &:hover {
      .upgrades {
        display: table;
        position: absolute;
        z-index: 1;
      }
    }

    .id {
      position: relative;
    }

    .upgrades {
      display: none;
    }
  }
</style>
