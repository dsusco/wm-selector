<template>
  <main class="print-view">
    <div class="printable-items">
       <button v-for="(item, index) in printableItems" :key="index" @click="addPrintItem(index)">{{item.title}}</button>
    </div>

    <p>Click what you would like to print in the box above to add it to the preview below, then <a href="javascript:window.print()">print</a>.</p>

    <PrintItems />
  </main>
</template>

<script>
import PrintItems from '@/components/Print/PrintItems';
import store from '@/store';

export default {
  name: 'PrintView',
  components: { PrintItems },
  computed: {
    printableItems: () => store.getters.printableItems
  },
  methods: {
    addPrintItem (index) {
      store.dispatch('addPrintItem', index);
    }
  }
};
</script>

<style lang="scss">
  .print-view {
    .printable-items,
    .print-items {
      border: .1rem dotted $_color_dark;
      margin: 0 0 ($_ / 2);
      min-height: 2 * $_;
      padding: (($_ / 4) - .1rem) ($_ / 2);
    }

    .print-items {
      @include padding((($_ / 2) - .1rem) null);

      margin: 0;
    }

    button {
      @include padding(0 null);

      font-size: 1.2rem;
      line-height: $_ - .2rem;
      margin: ($_ / 4) .5em ($_ / 4) 0;
    }
  }
</style>
