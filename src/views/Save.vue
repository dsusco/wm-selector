<template>
  <main class="save-view">
    <p>The following URL can be used to restore the current list:</p>

    <textarea readonly v-html="url()" @focus="$event.target.select()"></textarea>
  </main>
</template>

<script>
import Querystring from 'querystring';

import store from '@/store';

export default {
  name: 'SaveView',
  methods: {
    url: () => window.location.origin + '/#/?' + Querystring.stringify(Object.keys(store.getters.usedUnits)
      .reduce((url, unitID) => {
        var unit = store.getters.usedUnits[unitID];

        url[unit.order] = unit.number;

        for (var upgradeID in unit.upgrades) {
          url[unit.order + '-' + store.getters.upgrades[upgradeID].order] = unit.upgrades[upgradeID].number;
        }

        return url;
      }, {
        jsonPath: store.getters.jsonPath,
        label: store.getters.label,
        printItems: store.getters.printItems.map((printItem) => printItem.abbr).join(',')
      }))
  }
};
</script>

<style lang="scss">
  .save-view {
  }
</style>
