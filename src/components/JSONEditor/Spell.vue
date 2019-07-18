<template>
  <div class="spell">
    <div class="handle"></div>

    <label>
      <span>Name</span>
      <input class="small" type="text" placeholder="Please enter a name…" v-model="spell.name"/>
    </label>

    <label>
      <span>Roll</span>
      <input class="small" type="text" placeholder="X+ to cast" v-model="spell.roll"/>
    </label>

    <label>
      <span>Range</span>
      <input class="small" type="text" placeholder="N/A" v-model="spell.range"/>
    </label>

    <textarea class="small" placeholder="Please enter some markdown…" v-model="text" @blur="$event.target.rows = null" @focus="$event.target.rows = 10"></textarea>

    <slot/>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'Spell',
  computed: {
    text: {
      get () {
        try {
          return this.spell.text.join('\n');
        } catch {
          return '';
        }
      },
      set (text) { Vue.set(this.spell, 'text', text.split('\n')) }
    }
  },
  props: ['spell']
};
</script>

<style lang="scss">
  .json-editor-view .spell {
    padding-right: 1.5 * $_ + 2 * 1.2rem;

    label span {
      float: left;
      line-height: $_;
      width: 3em;
    }

    input[type='text'] {
      margin: 0 0 ($_ / 4) 3.5em;
      width: calc(100% - 3.5em);
    }

    textarea {
      margin-top: 0;
    }

    .fa-remove {
      @include margin((-.75 * $_) null 0);
      @include position(absolute, 50% 1.2rem null null);
    }
  }
</style>
