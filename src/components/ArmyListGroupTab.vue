<template>
  <div :id="tabID" class="army-list-group-tab">
    <button :id="tabID + '_toggle_button'" class="h3" :aria-controls="tabID + '_lists'" :aria-expanded="activeArmyListGroupTab === group" @click="activeArmyListGroupTab = group">{{group}}</button>

    <ul :id="tabID + '_lists'" aria-labelledby="tabID + '_toggle_button'" :hidden="activeArmyListGroupTab !== group">
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
    activeArmyListGroupTab: {
      get: () => store.getters.activeArmyListGroupTab,
      set (activeArmyListGroupTab) { store.dispatch('setActiveArmyListGroupTab', activeArmyListGroupTab) }
    },
    jsonPath: {
      get: () => store.getters.jsonPath,
      set (jsonPath) { store.dispatch('setArmy', jsonPath) }
    },
    tabID () {
      return (this.group + '_tab').toLowerCase().replace(/\W+/g, '_');
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
      border-radius: 0;
      color: $_color_white;
      padding: ($_ / 4) 1.6rem ($_ / 4 - .1rem);
      text-align: left;
      width: 100%;

      &:focus,
      &:hover {
        background: darken($_color_primary, 6.25%);
        color: $_color_white;
        outline: none;
        text-decoration: none;
      }
    }

    ul {
      border-top: .1rem solid $_color_black;
      margin: 0;
      padding: ($_ / 2) 0 ($_ / 2) 2em;
    }


    button {
      background: 0;
      border: 0;
      color: $_link_color;
      padding: 0;

      &:focus,
      &:hover {
        background: 0;
        color: darken($_link_color, 12.5%);
        text-decoration: underline;
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
