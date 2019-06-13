<template>
  <div class="print-item stats">
    <table>
      <caption>{{caption}}</caption>
      <thead>
        <tr>
          <th v-if="used">Cost</th>
          <th v-if="used">#</th>
          <th>Troop</th>
          <th>Type</th>
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
        <tr v-for="(unit, unitID) in units" :key="unitID + '_unit'">
          <td>{{unitID}}</td>
          <td>{{unit.type}}</td>
          <td>{{unit.attack}}</td>
          <td>{{unit.range || '-'}}</td>
          <td>{{unit.hits || '-'}}</td>
          <td>{{unit.armour || '-'}}</td>
          <td>{{unit.command || '-'}}</td>
          <td>{{unit.size}}</td>
          <td>{{unit.points}}</td>
          <td>{{minMax(unit)}}</td>
          <td>{{special(unitID, unit.specialRules)}}</td>
        </tr>
        <tr v-for="(upgrade, upgradeID) in upgrades" :key="upgradeID + '_upgrade'">
          <td>{{upgradeID}}</td>
          <td>{{upgrade.type}}</td>
          <td>{{upgrade.attack}}</td>
          <td>{{upgrade.range || '-'}}</td>
          <td>{{upgrade.hits || '-'}}</td>
          <td>{{upgrade.armour || '-'}}</td>
          <td>{{upgrade.command || '-'}}</td>
          <td>{{upgrade.size}}</td>
          <td>{{upgrade.points}}</td>
          <td>{{minMax(upgrade)}}</td>
          <td>{{special(upgradeID, upgrade.specialRules)}}</td>
        </tr>
      </tbody>
      <tbody v-if="used">
        <template v-for="(unit, unitID) in usedUnits">
          <tr :key="unitID + '_unit'">
            <td>{{unit.pointsCost}}</td>
            <td>{{unit.number}}</td>
            <td>{{unitID}}</td>
            <td>{{unit.type}}</td>
            <td>{{unit.attack || '-'}}</td>
            <td>{{unit.range || '-'}}</td>
            <td>{{unit.hits || '-'}}</td>
            <td>{{unit.armour || '-'}}</td>
            <td>{{unit.command || '-'}}</td>
            <td>{{unit.size}}</td>
            <td>{{unit.points}}</td>
            <td>{{minMax(unit)}}</td>
            <td>{{special(unitID, unit.specialRules)}}</td>
          </tr>
          <tr v-for="(upgrade, upgradeID) in unit.upgrades"  :key="unitID + '_unit_' + upgradeID + '_upgrade'">
            <td></td>
            <td>{{upgrade.number}}</td>
            <td>{{upgradeID}}</td>
            <td>{{upgrade.type}}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>{{upgrade.points}}</td>
            <td>{{minMax(upgrade)}}</td>
            <td>{{special(upgradeID, upgrade.specialRules)}}</td>
          </tr>
        </template>
      </tbody>
      <tfoot v-if="used">
        <tr>
          <td>{{pointsCost}}</td>
          <td>{{unitCount}}/{{Math.ceil(unitCount / 2)}}</td>
          <td colspan="11"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import store from '@/store';

const MAGIC_ITEM_TYPES = ['Magic Standard', 'Magic Weapon', 'Device of Power'];

export default {
  name: 'Stats',
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
    mapGetters(['armyList', 'pointsCost', 'unitCount', 'units', 'usedUnits'])
  ),
  methods: {
    minMax: (unit) => {
      var minMax;

      if (unit.elite) {
        minMax = 'elite'
      } else if (unit.armyMin || unit.armyMax) {
        if (unit.armyMin) {
          minMax = unit.armyMin;

          if (unit.armyMax && unit.armyMin !== unit.armyMax) {
            minMax += '–' + unit.armyMax;
          }
        } else {
          minMax = unit.armyMax;
        }
      } else {
        minMax = (unit.min || '-') + '/' + (unit.max || '-');
      }

      return minMax;
    },
    special: (name, specialRules) => {
      return [name].concat(specialRules).reduce((special, name) => {
        if (store.getters.specialRules[name]) {
          special.push('*' + store.getters.specialRules[name].order);
        }

        return special;
      }, []).join(', ') || '-';
    }
  },
  props: ['used']
};
</script>

<style lang="scss">
  .print-item.stats {
  }
</style>
