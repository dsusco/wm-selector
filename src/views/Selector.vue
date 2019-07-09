<template>
  <main class="selector-view">
    <div id="selector_container">
      <input id="label" type="text" placeholder="Please enter a label for this list…" v-model="label" />

      <div id="armyList">
        {{armyList}}
        <small id="version">{{version}}</small>
      </div>

      <ul id="errors" v-if="errors.length > 0">
        <li v-for="error in errors" :key="error">{{error}}</li>
      </ul>

      <table id="units">
        <thead>
          <tr>
            <th class="id">Troop</th>
            <th class="minMax">Min/Max</th>
            <th class="points">Points</th>
          </tr>
        </thead>
        <tbody>
          <Unit v-for="(unit, unitID) in units" :key="unitID" :unitID="unitID" />
        </tbody>
      </table>

      <table id="usedUnits">
        <thead>
          <tr>
            <th id="unitCount" title="Units/Half">{{unitCount}}/{{Math.ceil(unitCount / 2)}}</th>
            <th></th>
            <th id="pointsCost">{{pointsCost}}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(unit, unitID) in usedUnits">
            <UsedUnit :key="unitID" :unitID="unitID" />
            <UsedUpgrade v-for="(upgrade, upgradeID) in unit.upgrades" :key="unitID + upgradeID" :unitID="unitID" :upgradeID="upgradeID" />
          </template>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

import Unit from '@/components/Selector/Unit';
import UsedUnit from '@/components/Selector/UsedUnit';
import UsedUpgrade from '@/components/Selector/UsedUpgrade';
import store from '@/store';

export default {
  name: 'SelectorView',
  components: { Unit, UsedUnit, UsedUpgrade },
  computed: Object.assign({
      label: {
        get: () => store.getters.label,
        set (label) { store.dispatch('setLabel', label) }
      }
    },
    mapGetters(['armyList', 'errors', 'pointsCost', 'unitCount', 'units', 'usedUnits', 'version'])
  ),
  mounted () {
    if (document.getElementsByClassName('selector-view-button')[0]) {
      document.getElementsByClassName('selector-view-button')[0].focus();
    }
  }
};
</script>

<style lang="scss">
  .selector-view {
    #label {
      border: 0;
      padding: 0;
    }

    #version {
      display: block;
    }

    #errors {
      @include _(1.4rem);

      color: red;
      list-style: none;
      margin: 0 0 ($_ / 2);
      padding: 0 0 0 .5em;
    }

    #unitCount {
      cursor: help;
    }

    #unitCount,
    #pointsCost,
    .number,
    .pointsCost,
    .minMax,
    .points {
      width: 4em;
      text-align: center;
    }

    .minMax,
    .points {
      width: 5em;
    }

    #units,
    .upgrades {
      border: .1rem solid $_color_black;

      thead {
        background: $_color_primary;
        border-bottom: .1rem solid $_color_black;
        color: $_color_white;
      }

      thead th,
      tbody tr:last-child td {
        line-height: $_ - .1rem;
      }
    }

    #usedUnits {
      thead {
        border-bottom: .1rem dotted $_color_black;

        th {
          line-height: $_ - .1rem;
        }
      }
    }

    table {
      @include _(1.4rem);

      color: $_color_black;

      [tabindex] {
        &:focus,
        &:hover {
          background: $_color_primary;
          color: $_color_white;
          outline: none;
        }
      }

      th,
      td {
        @include padding(($_ / 2) null);
      }
    }

    @include grid-media($md-neat-grid) {
      #selector_container {
        min-height: 25 * $_;
        padding-right: calc(40% + 1.2rem);
        position: relative;
      }

      #units {
        @include position(absolute, 0 0 null null);

        width: 40%;
      }

      table {
        th,
        td {
          @include padding(0 null);
        }
      }
    }
  }
</style>
