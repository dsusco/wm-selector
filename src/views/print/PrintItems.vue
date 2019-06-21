<template>
  <VueDraggable class="print-items" v-model="printItems">
     <div class="print-item" v-for="(item, index) in printItems" :key="index" @click="removePrintItem(index)">
       <TextList v-if="item === 'Text List'" />
       <Stats v-if="item === 'Stats'" />
       <Stats :used="true" v-if="item === 'Stats Used'" />
       <ArmyRules v-if="item === 'Army Rules'" />
       <SpecialRules v-if="item === 'Special Rules'" />
       <SpecialRules :used="true" v-if="item === 'Special Rules Used'" />
       <MagicItems v-if="item === 'Magic Items'" />
       <MagicItems :used="true" v-if="item === 'Magic Items Used'" />
       <Spells v-if="item === 'Spells'" />
    </div>
  </VueDraggable>
</template>

<script>
import VueDraggable from 'vuedraggable';

import ArmyRules from '@/views/print/ArmyRules';
import MagicItems from '@/views/print/MagicItems';
import SpecialRules from '@/views/print/SpecialRules';
import Spells from '@/views/print/Spells';
import Stats from '@/views/print/Stats';
import TextList from '@/views/print/TextList';
import store from '@/store';

export default {
  name: 'PrintItems',
  components: {
    ArmyRules,
    MagicItems,
    SpecialRules,
    Spells,
    Stats,
    TextList,
    VueDraggable
  },
  computed: {
    printItems: {
      get: () => store.getters.printItems,
      set (printItems) { store.dispatch('setPrintItems', printItems) }
    }
  },
  methods: {
    removePrintItem (index) {
      store.dispatch('removePrintItem', index);
    }
  }
};
</script>

<style lang="scss">
  .print-item {
    border-bottom: .1rem dotted $_color_dark;
    cursor: move;
    margin-bottom: $_ / 2;
    padding-bottom: ($_ / 2) - .1rem;

    &:last-child {
      border-bottom: 0;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    > * > h3 {
      @include _(1.6rem);

      column-span: all;
      margin: 0 0 $_ / 2;
      text-align: center;
    }

    > * > dl {
      > dt {
        font-weight: bold;
        float: left;

        &::after {
          content: '.\00a0';
        }
      }

      > dd {
        margin: 0;
      }
    }

    p {
      margin: 0 0 $_ / 2;
    }

    @include grid-media($md-neat-grid) {
      > div {
        &.army-rules,
        &.magic-items,
        &.special-rules,
        &.spells {
          @include prefixer(column-count, 2, ('webkit', 'moz'));
          @include prefixer(column-gap, 2em, ('webkit', 'moz'));
          @include prefixer(orphans, 3, ('webkit', 'moz'));
        }
      }
    }
  }
</style>
