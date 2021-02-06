<template>
  <div class="magic-items">
    <h3 class="handle">Magic Items{{used ? ' Used' : ''}}</h3>

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
	// List of items by version of the army
	const versionMagicItems = Object.keys(magicItems.upgrades)
          .filter( key => magicItems.upgrades[key].version.includes(store.getters.version)) 
          .reduce( (res, key) => (res[key] = magicItems.upgrades[key], res), {} );
	return this.used ? Object.keys(versionMagicItems)
	.reduce((usedMagicItems, upgradeID) => {
		if (store.getters.upgrades[upgradeID].number > 0) {
			usedMagicItems[upgradeID] = Object.assign({}, store.getters.upgrades[upgradeID]);
		}
		return usedMagicItems;
	}, {}) : versionMagicItems;
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
