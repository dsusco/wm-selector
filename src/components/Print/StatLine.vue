<template>
  <tr>
    <td class="points-cost" v-if="used">{{pointsCost()}}</td>
    <td class="number" v-if="used">{{troop.number}}</td>
    <td class="troop">{{name}}</td>
    <td class="type">{{troop.type}}</td>
    <td class="attack">{{troop.attack || '-' }}</td>
    <td class="range">{{troop.range || '-'}}</td>
    <td class="hits">{{troop.hits || '-'}}</td>
    <td class="armour">{{troop.armour || '-'}}</td>
    <td class="command">{{troop.command || '-'}}</td>
    <td class="size">{{troop.size || '-' }}</td>
    <td class="points">{{troop.points}}</td>
    <td class="minMax">{{troop.minMax}}</td>
    <td class="special">{{special(name, troop.specialRules)}}</td>
  </tr>
</template>

<script>
import store from '@/store';

export default {
  name: 'StatLines',
  methods: {
    pointsCost () {
      // check if this is an upgrade who's price is included in a preceding line
      return /^(\+|-)/.test('' + this.troop.points) ? '(' + this.troop.pointsCost + ')' : this.troop.pointsCost;
    },
    special: (name, specialRules) => {
      return [name].concat(specialRules).reduce((special, name) => {
        if (store.getters.specialRules[name]) {
          special.push('*' + store.getters.specialRules[name].order);
        }

        return special;
      }, []).sort().join(', ') || '-';
    }
  },
  props: ['name', 'troop', 'used']
};
</script>

<style lang="scss">
</style>
