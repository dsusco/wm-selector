<template>
  <VueDraggable class="print-items" v-model="printItems">
     <div class="print-item" v-for="(item, index) in printItems" :key="index" @click="removePrintItem(index)">
       <TextList v-if="item.abbr === 'l'" />
       <Stats v-if="item.abbr === 's'" />
       <Stats :used="true" v-if="item.abbr === 'sl'" />
       <ArmyRules v-if="item.abbr === 'ar'" />
       <SpecialRules v-if="item.abbr === 'sr'" />
       <SpecialRules :used="true" v-if="item.abbr === 'sru'" />
       <MagicItems v-if="item.abbr === 'mi'" />
       <MagicItems :used="true" v-if="item.abbr === 'miu'" />
       <Spells v-if="item.abbr === 'sp'" />
    </div>
  </VueDraggable>
</template>

<script>
import VueDraggable from 'vuedraggable';

import ArmyRules from '@/components/Print/ArmyRules';
import MagicItems from '@/components/Print/MagicItems';
import SpecialRules from '@/components/Print/SpecialRules';
import Spells from '@/components/Print/Spells';
import Stats from '@/components/Print/Stats';
import TextList from '@/components/Print/TextList';
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

    .army-rules,
    .special-rules {
      th,
      td {
        &:first-child {
          vertical-align: top;
          white-space: nowrap;
        }
      }

      tbody > tr {
        border-top: ($_ / 2) solid $_body_background;

        &:first-child {
          border-top: 0;
        }

        &:nth-child(even) {
          background: none;
        }
      }
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
