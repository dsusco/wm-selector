<template>
  <div class="spells">
    <h3 class="handle">Spells</h3>

    <dl>
      <template v-for="(spell, index) in spells">
        <dt class="name" :key="index + '_name'">{{spell.name}}</dt>
        <dd class="roll" :key="index + '_roll'">{{spell.roll}}+ to cast</dd>
        <dd class="range" :key="index + '_range'">Range {{spell.range || 'N/A'}}</dd>
        <dd class="text" :key="index + '_text'" v-html="marked(spell.text)"></dd>
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
  .spells {
    .name {
      float: none;
      text-transform: uppercase;

      &::after {
        content: none;
      }
    }

    .roll,
    .range {
      font-style: italic;
    }

    .range {
      margin: 0 0 $_ / 2;
    }
  }
</style>
