<template>
  <div :id="tagID" class="unit">
    <div class="id">{{unitID}} ({{points}})</div>

    <button class="subtract-button" @click="subtract" :disabled="number < 1">
      <span class="fa fa-minus">
        <span class="sr-only">Remove one {{unitID}}</span>
      </span>
    </button>

    <span class="number">{{number}}</span>

    <button class="add-button" @click="add">
      <span class="fa fa-plus">
        <span class="sr-only">Add one {{unitID}}</span>
      </span>
    </button>

    <button :id="tagID + '_upgrades_toggle_button'" class="upgrades-toggle-button" :aria-controls="tagID + '_upgrades'" :aria-expanded="upgradesHidden ? 'false' : 'true'" :disabled="number < 1" v-if="upgrades" @click="toggleUpgrades">
      <span class="fa" :class="{ 'fa-caret-right': upgradesHidden, 'fa-caret-down': !upgradesHidden }">
        <span class="sr-only">Toggle Upgrades</span>
      </span>
    </button>

    <div :id="tagID + '_upgrades'" class="upgrades" :aria-labelledby="tagID + '_upgrades_toggle_button'" :hidden="upgradesHidden">
      <Upgrade v-for="(upgrade, upgradeID) in upgrades" :key="upgradeID" :upgradeID="upgradeID" :unitID="unitID" />
    </div>
  </div>
</template>

<script>
import store from '@/store';

import Upgrade from '@/views/selector/Upgrade';

export default {
  name: 'Unit',
  components: {
    Upgrade
  },
  computed: {
    number () {
      return store.getters.units[this.unitID].number;
    },
    points () {
      return store.getters.units[this.unitID].points;
    },
    tagID () {
      return (this.unitID + '_unit').toLowerCase().replace(/\W+/g, '_');
    },
    upgrades () {
      return store.getters.units[this.unitID].upgrades;
    }
  },
  data () {
    return {
      upgradesHidden: true
    }
  },
  methods: {
    add () {
      store.dispatch('setUnitNumber', {
        unitID: this.unitID,
        number: this.number + 1
      });
    },
    subtract () {
      if (this.number - 1 === 0) {
        this.upgradesHidden = true;
      }

      store.dispatch('setUnitNumber', {
        unitID: this.unitID,
        number: this.number - 1
      });
    },
    toggleUpgrades () {
      this.upgradesHidden = !this.upgradesHidden;
    }
  },
  props: ['unitID']
};
</script>

<style lang="scss">
  .unit {
    position: relative;

    &:nth-child(even) {
      background: $_color_lighter;
    }

    .id {
      margin: 0 (6 * $_) 0 (2 * $_);
      padding: ($_ / 2) .5em;
    }

    .subtract-button {
      right: $_ * 4;
    }

    .number {
      @include position(absolute, 0 (2 * $_) null null);

      line-height: 2 * $_;
      text-align: center;
      width: 2 * $_;
    }

    .add-button {
      right: 0;
    }

    .uupgrades {
      display: none;
    }

    button {
      @include position(absolute, 0 null null);

      margin: .2rem;
      padding: ((4.4rem - .2rem - $_) / 2);

      .fa {
        width: $_;
      }
    }
  }
</style>
