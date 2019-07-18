<template>
  <main class="json-editor-view">
    <fieldset id="army_list">
      <legend>Army List</legend>

      <label>
        <span>Name</span>
        <input type="text" placeholder="-" v-model="json.name" />
      </label>

      <label>
        <span>Version</span>
        <input type="text" placeholder="-" v-model="json.version" />
      </label>

      <label>
        <span>Group</span>
        <input type="text" placeholder="-" v-model="json.group" />
      </label>

      <label>
        <span>Order</span>
        <input type="text" placeholder="-" v-model="json.order" />
      </label>

      <label>
        <span>Magic</span>
        <button class="fa" :class="{ 'fa-check': json.magic, 'fa-blank': !json.magic }" @click="json.magic = !json.magic"></button>
      </label>
    </fieldset>

    <div class="responsive-table">
      <table>
        <caption>Units</caption>

        <thead>
          <tr>
            <th class="remove"></th>
            <th class="id">ID</th>
            <th class="type">Type</th>
            <th class="attack">Attack</th>
            <th class="range">Range</th>
            <th class="hits">Hits</th>
            <th class="armour">Armour</th>
            <th class="command">Command</th>
            <th class="size">Size</th>
            <th class="points">Points</th>
            <th class="min-max">Min/Max</th>
            <th class="special">Special</th>
          </tr>
        </thead>

        <VueDraggable element="tbody" handle=".id" v-model="unitIDs">
          <StatLine v-for="(unit, unitID) in json.units" :key="'unit_' + unitID" :id="unitID" :troop="unit">
            <button class="fa fa-minus" :title="'Remove ' + unitID" @click="removeUnit(unitID)">
              <span class="sr-only">Remove {{unitID}}</span>
            </button>
          </StatLine>
        </VueDraggable>

        <tfoot>
          <tr>
            <td class="add"><button class="fa fa-plus" title="Add Unit" @click="addUnit">
              <span class="sr-only">Add Unit</span>
            </button></td>
            <td class="id"><input id="newUnit" type="text" placeholder="Enter a unit name…" ref="newUnit" /></td>
            <td colspan="10"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="responsive-table">
      <table>
        <caption>Upgrades</caption>

        <thead>
          <tr>
            <th class="remove"></th>
            <th class="id">ID</th>
            <th class="type">Type</th>
            <th class="attack">Attack</th>
            <th class="range">Range</th>
            <th class="hits">Hits</th>
            <th class="armour">Armour</th>
            <th class="command">Command</th>
            <th class="size">Size</th>
            <th class="points">Points</th>
            <th class="min-max">Min/Max</th>
            <th class="special">Special</th>
          </tr>
        </thead>

        <VueDraggable element="tbody" handle="tr" v-model="upgradeIDs">
          <StatLine v-for="(upgrade, upgradeID) in json.upgrades" :key="'upgrade_' + upgradeID" :id="upgradeID" :troop="upgrade">
            <button class="fa fa-minus" :title="'Remove ' + upgradeID" @click="removeUpgrade(upgradeID)">
              <span class="sr-only">Remove {{upgradeID}}</span>
            </button>
          </StatLine>
        </VueDraggable>

        <tfoot>
          <tr>
            <td class="add"><button class="fa fa-plus" title="Add Upgrade" @click="addUpgrade">
              <span class="sr-only">Add Upgrade</span>
            </button></td>
            <td class="id"><input id="newUpgrade" type="text" placeholder="Enter an upgrade name…" ref="newUpgrade" /></td>
            <td colspan="10"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <fieldset>
      <legend>Army Rules</legend>

      <textarea class="small" placeholder="Please enter some markdown…" v-model="armyRules" @blur="$event.target.rows = null" @focus="$event.target.rows = 10"></textarea>
    </fieldset>

    <fieldset>
      <legend>Special Rules</legend>

      <VueDraggable handle=".handle" v-model="specialRuleIDs">
        <SpecialRule v-for="(specialRule, specialRuleID) in json.specialRules" :key="'special_rule_' + specialRuleID" :id="specialRuleID">
          <button class="fa fa-remove" :title="'Remove ' + specialRuleID" @click="removeSpecialRule(specialRuleID)">
            <span class="sr-only">Remove {{specialRuleID}}</span>
          </button>
        </SpecialRule>
      </VueDraggable>

      <div>
        <button class="fa fa-plus" title="Add Special Rule" @click="addSpecialRule()">
          <span class="sr-only">Add Special Rule</span>
        </button>
        <input id="newSpecialRule" type="text" placeholder="Enter a special rule name…" ref="newSpecialRule" />
      </div>
    </fieldset>

    <fieldset>
      <legend>Spells</legend>

      <VueDraggable handle=".handle" v-model="json.spells">
        <Spell v-for="(spell, index) in json.spells" :key="'spell_' + index" :spell="spell">
          <button class="fa fa-remove" :title="'Remove ' + spell.name"  @click="removeSpell(index)">
            <span class="sr-only">Remove {{spell.name}}</span>
          </button>
        </Spell>
      </VueDraggable>

      <div>
        <button class="fa fa-plus" title="Add Spell" @click="addSpell()">
          <span class="sr-only">Add Spell</span>
        </button>
      </div>
    </fieldset>

    <hr/>

    <textarea readonly v-html="jsonString()"  @blur="$event.target.rows = null" @focus="$event.target.select();$event.target.rows = 20"></textarea>
  </main>
</template>

<script>
import Vue from 'vue';
import VueDraggable from 'vuedraggable';

import SpecialRule from '@/components/JSONEditor/SpecialRule';
import Spell from '@/components/JSONEditor/Spell';
import StatLine from '@/components/JSONEditor/StatLine';
import store from '@/store';

export default {
  name: 'JSONEditorView',
  components: {
    SpecialRule,
    Spell,
    StatLine,
    VueDraggable
  },
  computed: {
    armyRules: {
      get: () => {
        try {
          return store.getters.json.armyRules.join('\n');
        } catch {
          return '';
        }
      },
      set (armyRules) {
        Vue.set(this.json, 'armyRules', armyRules.split('\n'));
      }
    },
    json: {
      get: () => store.getters.json,
      set: (json) => store.commit('SET_JSON', json)
    },
    specialRuleIDs: {
      get: () => Object.keys(store.getters.json.specialRules),
      set (specialRules) {
        var order = 1;

        Vue.set(this.json, 'specialRules', specialRules.reduce((specialRules, specialRuleID) => {
          specialRules[specialRuleID] = store.getters.json.specialRules[specialRuleID];
          specialRules[specialRuleID].order = order++;

          return specialRules;
        }, {}));
      }
    },
    unitIDs: {
      get: () => Object.keys(store.getters.json.units),
      set (unitIDs) {
        var order = 0;

        Vue.set(this.json, 'units', unitIDs.reduce((units, unitID) => {
          units[unitID] = store.getters.json.units[unitID];
          units[unitID].order = order++;

          return units;
        }, {}));
      }
    },
    upgradeIDs: {
      get: () => Object.keys(store.getters.json.upgrades),
      set (upgradeIDs) {
        var order = 0;

        Vue.set(this.json, 'upgrades', upgradeIDs.reduce((upgrades, upgradeID) => {
          upgrades[upgradeID] = store.getters.json.upgrades[upgradeID];
          upgrades[upgradeID].order = order++;

          return upgrades;
        }, {}));
      }
    }
  },
  methods: {
    addSpecialRule () {
      if (this.$refs.newSpecialRule.value) {
        Vue.set(store.getters.json.specialRules, this.$refs.newSpecialRule.value, {
          order: Object.keys(store.getters.json.specialRules).length + 1,
          text: []
        });
        this.$refs.newSpecialRule.value = '';
      }
    },
    addSpell () {
      Vue.set(store.getters.json.spells, store.getters.json.spells.length, { text: [] });
    },
    addUnit () {
      if (this.$refs.newUnit.value) {
        Vue.set(this.json.units, this.$refs.newUnit.value, {
          order: Object.keys(store.getters.json.units).length,
        });
        this.$refs.newUnit.value = '';
      }
    },
    addUpgrade () {
      if (this.$refs.newUpgrade.value) {
        Vue.set(this.json.upgrades, this.$refs.newUpgrade.value, {
          order: Object.keys(store.getters.json.upgrades).length,
        });
        this.$refs.newUpgrade.value = '';
      }
    },
    jsonString () {
      return JSON.stringify(this.json)
        .replace(/":"(\d+)"/g, '":$1')
        .replace(/,?"[^"]+":(""|\[\]|false)/g, '')
        .replace(/{,/g, '{');
    },
    removeSpecialRule (specialRuleID) {
      Vue.delete(store.getters.json.specialRules, specialRuleID);
    },
    removeSpell (index) {
      Vue.delete(store.getters.json.spells, index);
    },
    removeUnit (unitID) {
      Vue.delete(store.getters.json.units, unitID);
    },
    removeUpgrade (upgradeID) {
      Vue.delete(store.getters.json.upgrades, upgradeID);
    }
  }
};
</script>

<style lang="scss">
  .json-editor-view {
    @include _(1.2rem);

    fieldset {
      > div > div {
        padding: ($_ / 2) 1em;
        position: relative;

        &:nth-child(even) {
          background-color: $_color_lighter;
        }
      }
    }

    label {
      display: inline-block;
      margin: 0;
    }

    button,
    #{$all-text-inputs},
    select {
      font-size: inherit;
      line-height: inherit;
      position: relative;
      z-index: 1;
    }

    input[type='text'] {
      width: auto;

      &#newUnit {
        width: 13.5em;
      }

      &#newUpgrade {
        width: 13.5em;
      }

      &#newSpecialRule {
        display: inline;
        margin-left: 1em;
      }
    }

    textarea {
      margin: ($_ / 4) 0 0;
    }

    th,
    td {
      white-space: nowrap;
    }

    .responsive-table {
      border-top: .1rem solid $_color_light;
      overflow-x: auto;
      padding: ($_ / 2 - .1rem) 0 ($_ / 2);

      table {
        margin: 0;
        text-align: center;

        tbody tr {
          cursor: move;
        }

        .id,
        .type,
        .special {
          text-align: left;
        }
      }
    }

    #army_list {
      label span {
        float: left;
        line-height: 2 * $_;
        width: 3.5em;
      }

      input[type='text'] {
        margin-left: 4em;
        width: calc(100% - 4em);
      }

      .fa {
        display: block;
        margin-left: 4em;

        &.fa-blank::before {
          content: '\00a0';
        }
      }
    }

    .fa {
      @include _(1.2rem);

      width: 1.5 * $_;
    }

    .handle {
      @include position(absolute, 0);

      cursor: move;
    }
  }
</style>
