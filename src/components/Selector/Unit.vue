<template>
  <tr class="unit" tabindex="0" @click="add" @keyup.enter="add">
    <td class="id">{{unitID}}</td>
    <td class="minMax">{{minMax}}</td>
    <td class="points">{{points}}</td>
  </tr>
</template>

<script>
import store from '@/store';

export default {
  name: 'Unit',
  computed: {
    minMax () {
      return store.getters.units[this.unitID].minMax;
    },
    points () {
      return store.getters.units[this.unitID].points;
    }
  },
  methods: {
    add () {
      store.dispatch('setUnitNumber', {
        unitID: this.unitID,
        number: store.getters.units[this.unitID].number + 1
      });
    }
  },
  props: ['unitID']
};
</script>

<style lang="scss">
  tr.unit {
  }
</style>
