<template>
  <div :id="accordionID" class="army-list-accordion">
    <button :id="accordionID + '_toggle_button'" class="h3" :aria-controls="accordionID + '_lists'" :aria-expanded="activeArmyListAccordion === title" @click="activeArmyListAccordion = title">{{title}}</button>

    <ul :id="accordionID + '_lists'" aria-labelledby="accordionID + '_toggle_button'" :hidden="activeArmyListAccordion !== title">
      <li v-for="(path, name) in armyLists[title]" :key="name">
        <button :class="{ selected: path === jsonPath }" @click="jsonPath = path">{{name}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import armyLists from '@/json/army-lists.json';
import store from '@/store';

export default {
  name: 'ArmyListAccordion',
  computed: {
    accordionID () {
      return (this.title + '_accordion').toLowerCase().replace(/\W+/g, '_');
    },
    activeArmyListAccordion: {
      get: () => store.getters.activeArmyListAccordion,
      set (activeArmyListAccordion) { store.dispatch('setActiveArmyListAccordion', activeArmyListAccordion) }
    },
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
  props: ['title']
};
</script>

<style lang="scss">
  .army-list-accordion {
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
