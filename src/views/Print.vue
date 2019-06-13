<template>
  <main id="main" class="print-view">
    <div class="printable-items">
       <button v-for="(item, index) in printableItems" :key="item" @click="addPrintItem(index)">{{item}}</button>
    </div>

    <p>Click what you would like printed in the list above to add it to the preview below, then <a href="javascript:window.print()">print</a>.</p>

    <VueDraggable class="print-items" v-model="printItems">
       <div v-for="(item, index) in printItems" :key="item" @click="removePrintItem(index)">
         <TextList v-if="item === 'Text List'" />
         <Stats v-if="item === 'Stats'" />
         <Stats :used="true" v-if="item === 'Stats Used'" />
         <ArmyRules v-if="item === 'Army Rules'" />
         <SpecialRules v-if="item === 'Special Rules'" />
         <SpecialRules :used="true" v-if="item === 'Special Rules Used'"/>
         <MagicItems v-if="item === 'Magic Items'" />
         <MagicItems :used="true" v-if="item === 'Magic Items Used'"/>
         <Spells v-if="item === 'Spells'" />
        </div>
    </VueDraggable>
  </main>
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
  name: 'PrintView',
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
    },
    printableItems: () => store.getters.printableItems
  },
  methods: {
    addPrintItem (index) {
      store.dispatch('addPrintItem', index);
    },
    removePrintItem (index) {
      store.dispatch('removePrintItem', index);
    }
  }
};
</script>

<style lang="scss">
  .print-view {
    .printable-items,
    .print-items {
      border: .1rem dotted $_color_dark;
      padding: ($_ / 2) 1em;
      margin: 0 0 $_;
    }

    .print-items {
      > div {
        border-bottom: .1rem dotted $_color_dark;
        cursor: move;

        &:last-child {
          border-bottom: 0;
        }
      }
    }

    button {
      @include padding(0 null);
      font-size: 1.2rem;
      margin: 0 .25em 0 0;
      line-height: $_ - .2rem;
    }
  }
</style>
