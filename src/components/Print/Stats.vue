<template>
  <div class="stats">
    <table>
      <caption class="handle">{{caption}}</caption>

      <thead>
        <tr>
          <th v-if="used">Cost</th>
          <th class="number" v-if="used">#</th>
          <th class="troop">Troop</th>
          <th class="type">Type</th>
          <th>Attack</th>
          <th>Range</th>
          <th>Hits</th>
          <th>Armour</th>
          <th>Command</th>
          <th>Size</th>
          <th>Points</th>
          <th>Min/Max</th>
          <th>Special</th>
        </tr>
      </thead>

      <tbody v-if="!used">
        <StatLine v-for="(unit, unitID) in units" :key="'unit_' + unitID" :name="unitID" :troop="unit" :used="used" />
      </tbody>

      <tbody v-if="!used">
        <StatLine v-for="(upgrade, upgradeID) in upgrades" :key="'upgrade_' + upgradeID" :name="upgradeID" :troop="upgrade" :used="used" />
      </tbody>

      <tbody v-if="used">
        <template v-for="(unit, unitID) in usedUnits">
          <StatLine :key="'unit_' + unitID" :name="unitID" :troop="unit" :used="used" />
          <StatLine v-for="(upgrade, upgradeID) in unit.upgrades"  :key="'upgrade_' + upgradeID" :name="upgradeID" :troop="upgrade" :used="used" />
        </template>
      </tbody>

      <tfoot v-if="used">
        <tr>
          <td class="cost">{{pointsCost}}</td>
          <td class="number">{{unitCount}}/{{Math.ceil(unitCount / 2)}}</td>
          <td colspan="11"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import StatLine from '@/components/Print/StatLine';
import store from '@/store';

const MAGIC_ITEM_TYPES = ['Magic Standard', 'Magic Weapon', 'Device of Power'];

export default {
  name: 'Stats',
  components: { StatLine },
  computed: Object.assign({
      caption () {
        return this.used ? 'Stats Used' : store.getters.armyList + ' Army Selector'
      },
      upgrades: () => Object.keys(store.getters.upgrades)
        .reduce((usedUpgrades, upgradeID) => {
          if (!MAGIC_ITEM_TYPES.includes(store.getters.upgrades[upgradeID].type)) {
            usedUpgrades[upgradeID] = Object.assign({}, store.getters.upgrades[upgradeID]);
          }

          return usedUpgrades;
        }, {})
    },
    mapGetters(['pointsCost', 'unitCount', 'units', 'usedUnits'])
  ),
  props: ['used']
};
</script>

<style lang="scss">
  .stats {
    @include _(1.2rem);

    text-align: center;
    overflow-x: auto;

    table {
      margin: 0;
    }

    caption {
      @include _(1.6rem);
    }

    th,
    td {
      @include padding(0 .25em);

      white-space: nowrap;
    }

    .number {
      border-right: .1rem solid $_color_black;
    }

    .troop,
    .type {
      text-align: left;
    }
  }
</style>
