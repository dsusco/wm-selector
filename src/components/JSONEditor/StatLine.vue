<template>
  <tr class="stat-line">
    <td class="remove">
      <slot/>
    </td>
    <td class="id">{{id}}</td>
    <td class="type">
      <select class="small" type="text" v-model="type">
        <optgroup label="Units">
          <option>Artillery</option>
          <option>Cavalry</option>
          <option>Chariot</option>
          <option>Elephant</option>
          <option>Infantry</option>
          <option>Machine</option>
          <option>Monster</option>
        </optgroup>
        <optgroup label="Characters">
          <option>General</option>
          <option>Hero</option>
          <option>Leader</option>
          <option>Subordinate</option>
          <option>Wizard</option>
        </optgroup>
        <optgroup label="Upgrades">
          <option>Chariot Mount</option>
          <option>Monstrous Mount</option>
          <option>Mount</option>
          <option>Special</option>
          <option>Special Mount</option>
        </optgroup>
        <optgroup label="Unités">
          <option>Artillerie</option>
          <option>Cavalerie</option>
          <option>Char</option>
          <option>Eléphant</option>
          <option>Infantrie</option>
          <option>Machine</option>
          <option>Monstre</option>
        </optgroup>
        <optgroup label="Personnages">
          <option>Général</option>
          <option>Héros</option>
          <option>Sorcier</option>
        </optgroup>
        <optgroup label="Améliorations">
          <option>Char monté</option>
          <option>Monture Monstrueuse</option>
          <option>Monture</option>
          <option>Spécial</option>
          <option>Monture Spéciale</option>
        </optgroup>
      </select>
    </td>
    <td class="attack"><input type="text" placeholder="-" v-model="attack" /></td>
    <td class="range"><input type="text" placeholder="-" v-model="range" /></td>
    <td class="hits"><input type="text" placeholder="-" v-model="hits" /></td>
    <td class="armour"><input type="text" placeholder="-" v-model="armour" /></td>
    <td class="command"><input type="text" placeholder="-" v-model="command" /></td>
    <td class="size"><input type="text" placeholder="-" v-model="size" /></td>
    <td class="points"><input type="text" placeholder="-" v-model="points" /></td>
    <td class="min-max">
      <input type="text" placeholder="0" v-model="armyMin" v-if="armyMinMax" />
      <input type="text" placeholder="-" v-model="min" v-if="!armyMinMax" />
      <button title="Toggle Min/Max Type" :class="{ 'army': armyMinMax }" @click="toggleMinMaxType()">
        <span class="sr-only">Toggle Min/Max Type</span>
      </button>
      <input type="text" v-model="armyMax" v-if="armyMinMax" />
      <input type="text" placeholder="-" v-model="max" v-if="!armyMinMax" />
    </td>
    <td class="special">
      <select type="text" multiple size="3" v-model="specialRules">
        <option v-for="specialRuleID in specialRuleIDs()" :disabled="id === specialRuleID" :key="specialRuleID" :value="specialRuleID">{{specialRuleID}}</option>
      </select>
    </td>
    <td class="upgrades">
      <select type="text" multiple size="3" v-model="upgrades">
        <option v-for="upgradeID in upgradeIDs()" :key="upgradeID" :value="upgradeID">{{upgradeID}}</option>
      </select>
    </td>
  </tr>
</template>

<script>
import Vue from 'vue';

import store from '@/store';

export default {
  name: 'StatLine',
  computed: {
    type: {
      get () { return this.troop.type },
      set (type) { Vue.set(this.troop, 'type', type) }
    },
    attack: {
      get () { return this.troop.attack },
      set (attack) { Vue.set(this.troop, 'attack', attack) }
    },
    range: {
      get () { return this.troop.range },
      set (range) { Vue.set(this.troop, 'range', range) }
    },
    hits: {
      get () { return this.troop.hits },
      set (hits) { Vue.set(this.troop, 'hits', hits) }
    },
    armour: {
      get () { return this.troop.armour },
      set (armour) { Vue.set(this.troop, 'armour', armour) }
    },
    command: {
      get () { return this.troop.command },
      set (command) { Vue.set(this.troop, 'command', command) }
    },
    size: {
      get () { return this.troop.size },
      set (size) { Vue.set(this.troop, 'size', size) }
    },
    points: {
      get () { return this.troop.points },
      set (points) { Vue.set(this.troop, 'points', points) }
    },
    armyMin: {
      get () { return this.troop.armyMin },
      set (armyMin) { Vue.set(this.troop, 'armyMin', armyMin) }
    },
    min: {
      get () { return this.troop.min },
      set (min) { Vue.set(this.troop, 'min', min) }
    },
    armyMax: {
      get () { return this.troop.armyMax },
      set (armyMax) { Vue.set(this.troop, 'armyMax', armyMax) }
    },
    max: {
      get () { return this.troop.max },
      set (max) { Vue.set(this.troop, 'max', max) }
    },
    specialRules: {
      get () {
        return this.troop.specialRules || [];
      },
      set (specialRules) {
        Vue.set(this.troop, 'specialRules', specialRules);
      }
    },
    upgrades: {
      get () {
        return this.troop.upgrades || [];
      },
      set (upgrades) {
        Vue.set(this.troop, 'upgrades', upgrades);
      }
    }
  },
  data () {
    return {
      armyMinMax: this.troop.armyMin !== undefined || this.troop.armyMax !== undefined
    };
  },
  methods: {
    specialRuleIDs: () => Object.keys(store.getters.json.specialRules),
    toggleMinMaxType () {
      this.armyMinMax = !this.armyMinMax;

      if (this.armyMinMax) {
        Vue.set(this.troop, 'armyMin', this.troop.min);
        Vue.set(this.troop, 'armyMax', this.troop.max);
        Vue.delete(this.troop, 'min');
        Vue.delete(this.troop, 'max');
      } else {
        Vue.set(this.troop, 'min', this.troop.armyMin);
        Vue.set(this.troop, 'max', this.troop.armyMax);
        Vue.delete(this.troop, 'armyMin');
        Vue.delete(this.troop, 'armyMax');
      }
    },
    upgradeIDs: () => Object.keys(store.getters.json.upgrades)
  },
  props: ['id', 'troop']
};
</script>

<style lang="scss">
  .json-editor-view .stat-line {
    input[type='text'] {
      background: none;
      border: 0;
      display: inline-block;
      margin: 0;
      padding: 0;
      text-align: center;
      width: auto;
      max-width: 3em;
    }

    .type select {
      padding: 0;
      width: 8em;
    }

    .min-max button {
      line-height: $_ - .2rem;
      margin: 0;
      padding: 0;
      width: $_;

      &::before {
        content: '/';
      }
      &.army::before {
        content: '–';
      }
    }

    .special,
    .upgrades {
      select {
        padding: .1rem .4rem 0;
        width: 8em;
      }
    }

  }
</style>
