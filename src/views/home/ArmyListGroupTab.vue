<template>
  <div class="army-list-group-tab">
    <h2>{{group}}</h2>

    <ul>
      <li v-for="(path, name) in armyLists[group]" :key="name">
        <label>
          <input type="radio" name="jsonPath" v-model="jsonPath" :value="path" />
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
  }
</style>
