<template>
  <div class="army-list-group-tab">
    <h2>{{group}}</h2>

    <ul>
      <li v-for="(path, name) in armyLists[group]" :class="{ selected: path === jsonPath }" :key="name">
        <label>
          <input class="sr-only" type="radio" name="jsonPath" v-model="jsonPath" :value="path" />
          {{name}}
        </label>
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
      set: (jsonPath) => store.dispatch('setArmy', jsonPath)
    }
  },
  data: () => {
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

    h2 {
      background: $_color_primary;
      border-bottom: .1rem solid $_color_black;
      color: $_color_white;
      margin: 0;
      padding: 0 $_;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: ($_ / 2) $_;
    }

    li.selected {
        font-weight: bold;
    }

    label {
      margin: 0;
    }

    & + & {
      border-top: 0;
    }

    @include grid-media($md-neat-grid) {
      ul {
        @include grid-container;
      }

      li {
        @include grid-column(6);
      }
    }

    @include grid-media($lg-neat-grid) {
      ul {
        @include grid-container;
      }

      li {
        @include grid-column(4);
      }
    }
  }
</style>
