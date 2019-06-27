<template>
  <div class="army-list-group-tab">
    <div class="h3">{{group}}</div>

    <ul>
      <li v-for="(path, name) in armyLists[group]" :key="name">
        <button :class="{ selected: path === jsonPath }" @click="jsonPath = path">{{name}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import armyLists from '@/json/army-lists.json';
import store from '@/store';

export default {
  name: 'ArmyListGroupTab',
  computed: {
    jsonPath: {
      get: () => store.getters.jsonPath,
      set (jsonPath) { store.dispatch('setArmy', jsonPath) }
    }
  },
  data () {
    return { armyLists: armyLists };
  },
  methods: {
  },
  props: ['group']
};
</script>

<style lang="scss">
  .army-list-group-tab {
    border: .1rem solid $_color_black;

    .h3 {
      background: $_color_primary;
      border-bottom: .1rem solid $_color_black;
      color: $_color_white;
      padding: ($_ / 4) 1.6rem ($_ / 4 - .1rem);
    }

    ul {
      list-style: none;
      margin: 0;
      padding: ($_ / 2) 1em;
    }


    button {
      background: 0;
      border: 0;
      padding: 0;

      &:focus,
      &:hover {
        background: 0;
      }

      &.selected {
        font-weight: bold;
      }
    }

    & + & {
      border-top: 0;
    }
  }
</style>
