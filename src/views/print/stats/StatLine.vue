<template>
  <tr>
    <td class="points-cost" v-if="used">{{troop.pointsCost}}</td>
    <td class="number" v-if="used">{{troop.number}}</td>
    <td class="troop">{{name}}</td>
    <td class="type">{{troop.type}}</td>
    <td class="attack">{{troop.attack}}</td>
    <td class="range">{{troop.range || '-'}}</td>
    <td class="hits">{{troop.hits || '-'}}</td>
    <td class="armour">{{troop.armour || '-'}}</td>
    <td class="command">{{troop.command || '-'}}</td>
    <td class="size">{{troop.size}}</td>
    <td class="points">{{troop.points}}</td>
    <td class="min-max">{{minMax(troop)}}</td>
    <td class="special">{{special(name, troop.specialRules)}}</td>
  </tr>
</template>

<script>
import store from '@/store';

export default {
  name: 'StatLines',
  methods: {
    minMax: (troop) => {
      var minMax;

      if (troop.elite) {
        minMax = 'elite'
      } else if (troop.armyMin || troop.armyMax) {
        if (troop.armyMin) {
          minMax = troop.armyMin;

          if (troop.armyMax && troop.armyMin !== troop.armyMax) {
            minMax += '–' + troop.armyMax;
          }
        } else {
          minMax = troop.armyMax;
        }
      } else {
        minMax = (troop.min || '-') + '/' + (troop.max || '-');
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
  props: ['name', 'troop', 'used']
};
</script>

<style lang="scss">
</style>
