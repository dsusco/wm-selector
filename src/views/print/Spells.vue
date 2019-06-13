<template>
  <div class="print-item spells">
    <h3>Spells</h3>

    <dl>
      <template v-for="(spell, index) in spells">
        <dt :key="'spell_' + index + '_name'">{{ spell.name }}</dt>
        <dd :key="'spell_' + index + '_text'">{{ spell.roll }}+ to cast</dd>
        <dd :key="'spell_' + index + '_range'">Range {{ spell.range || "N/A" }}</dd>
        <dd :key="'spell_' + index + '_text'" v-html="marked(spell.text)"></dd>
      </template>
    </dl>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Marked from 'marked';

export default {
  name: 'Spells',
  computed: mapGetters(['spells']),
  methods: {
    marked: (text) => Marked(text.join('\n'))
  }
};
</script>

<style lang="scss">
  .print-item.spells {
  }
</style>
