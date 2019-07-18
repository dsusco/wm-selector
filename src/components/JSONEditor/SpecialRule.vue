<template>
  <div class="special-rule">
    <div class="handle"></div>
    <div class="id"><span class="order">{{order}}.</span> {{id}}</div>
    <textarea class="small" placeholder="Please enter some markdown…" v-model="text" @blur="$event.target.rows = null" @focus="$event.target.rows = 10"></textarea>

    <slot/>
  </div>
</template>

<script>
import Vue from 'vue';

import store from '@/store';

export default {
  name: 'SpecialRule',
  computed: {
    order () { return store.getters.json.specialRules[this.id].order; },
    text: {
      get () {
        try {
          return store.getters.json.specialRules[this.id].text.join('\n');
        } catch {
          return '';
        }
      },
      set (text) { Vue.set(store.getters.json.specialRules[this.id], 'text', text.split('\n')); }
    }
  },
  props: ['id']
};
</script>

<style lang="scss">
  .json-editor-view .special-rule {
    padding-right: 1.5 * $_ + 2 * 1.2rem;

    .id {
      font-weight: bold;
    }

    .fa-remove {
      @include position(absolute, 50% 1.2rem null null);

      margin-top: -.75 * $_;
    }
  }
</style>
