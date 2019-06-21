<template>
  <div class="magic-items">
    <h3>Magic Items{{used ? ' Used' : ''}}</h3>

    <dl>
      <template v-for="(magicItem, name) in magicItems">
        <dt :key="name">{{ name }}</dt>
        <dd :key="name + '_text'" v-html="marked(magicItem.text)"></dd>
      </template>
    </dl>
  </div>
</template>

<script>
import Marked from 'marked';

import store from '@/store';
import magicItems from '@/json/magic-items.json';

export default {
  name: 'MagicItems',
  computed: {
    magicItems () {
      return this.used ? Object.keys(magicItems.upgrades)
        .reduce((usedMagicItems, upgradeID) => {
          if (store.getters.upgrades[upgradeID].number > 0) {
            usedMagicItems[upgradeID] = Object.assign({}, store.getters.upgrades[upgradeID]);
          }

          return usedMagicItems;
        }, {}) : magicItems.upgrades;
    }
  },
  methods: {
    marked: (text) => Marked(text.join('\n'))
  },
  props: ['used']
};
</script>

<style lang="scss">
  .magic-items {
  }
</style>
