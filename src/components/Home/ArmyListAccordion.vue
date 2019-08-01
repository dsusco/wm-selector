<template>
  <div :id="accordionID" class="army-list-accordion">
    <button :id="accordionID + '_toggle_button'" class="h3" :aria-controls="accordionID + '_content'" :aria-expanded="activeArmyListAccordion === title" @click="activeArmyListAccordion = title">{{title}}</button>

    <div :id="accordionID + '_content'" aria-labelledby="accordionID + '_toggle_button'" :hidden="activeArmyListAccordion !== title">
      <span class="downloads">
        <slot/>
      </span>

      <div :class="groupClass" v-for="(group, groupIndex) in armyLists[title]" :key="groupIndex">
        <div class="h5" v-if="!/^\d+$/.test(group.name)">{{group.name}}</div>

        <ul>
          <li v-for="(list, listIndex) in group.lists" :key="listIndex">
            <button :class="{ selected: list.path === jsonPath }" @click="jsonPath = list.path">{{list.name}}</button>
          </li>
        </ul>
      </div>
    </div>
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
    groupClass () {
      switch (Object.keys(armyLists[this.title]).length) {
        case 2:
          return 'half';
        case 3:
          return 'third';
        case 4:
          return 'quarter';
        default:
          return '';
      }
    },
    jsonPath: {
      get: () => store.getters.jsonPath,
      set (jsonPath) { store.dispatch('setArmy', jsonPath) }
    }
  },
  data () {
    return { armyLists: armyLists };
  },
  props: ['title']
};
</script>

<style lang="scss">
  .army-list-accordion {
    border: .1rem solid $_color_black;

    > .h3 {
      background: $_color_primary;
      border-radius: 0;
      color: $_color_white;
      padding: (($_ / 2) - .1rem) 1.6rem;
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

    > div {
      border-top: .1rem solid $_color_black;
      padding: (($_ / 2) - .1rem) 1em ($_ / 2);
      position: relative;
      min-height: 2 * $_;
    }

    ul {
      margin: 0;
    }

    button {
      border: 0;
      color: $_link_color;
      padding: ($_ / 2) 0;
      margin: 0;
      text-align:left;
      vertical-align: baseline;

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
      border-top-width: 0;

      > .h3 {
        padding-top: ($_ / 2);
      }
    }

    @include grid-media($md-neat-grid) {
      button {
        padding: 0;
      }

      > div {
        @include grid-container();
        @include padding(null 0);

        > div {
          &.half {
            @include grid-column(6);
          }
          &.third {
            @include grid-column(4);
          }
          &.quarter {
            @include grid-column(3);
          }

          + div > div {
            margin-top: 0;
          }
        }
      }
    }

    @include grid-media($lg-neat-grid) {
      > div {
        > div {
          &.half {
            @include grid-column(6);
          }
          &.third {
            @include grid-column(4);
          }
          &.quarter {
            @include grid-column(3);
          }
        }
      }
    }

    @include grid-media($xl-neat-grid) {
      > div {
        > div {
          &.half {
            @include grid-column(6);
          }
          &.third {
            @include grid-column(4);
          }
          &.quarter {
            @include grid-column(3);
          }
        }
      }
    }
  }
</style>
