<template>
  <main class="mobile-selector-view">
    <input class="label" type="text" placeholder="Please enter a label for this list…" v-model="label" />

    <div class="armyList">
      {{armyList}}
      <small class="version">{{version}}</small>
    </div>

    <div class="units">
      <Unit v-for="(unit, id) in units" :key="id" :unitID="id" />
    </div>

    <div class="summary">
      <div class="pointsCost">
        {{pointsCost}} points
      </div>

      <span class="unitCount" title="Units/Half">
        {{unitCount}}/{{Math.ceil(unitCount / 2)}}
      </span>

      <button id="errors_toggle_button" class="errors-toggle-button" aria-controls="errors" :aria-expanded="errors.length < 1 || errorsHidden ? 'false' : 'true'" :disabled="errors.length < 1" @click="toggleErrors">
        <span class="fa" :class="{ 'fa-check': errors.length < 1, 'fa-times': errors.length > 0 }">
          <span class="sr-only">Toggle Errors</span>
        </span>
      </button>

      <ul id="errors" class="errors" aria-labelledby="errors_toggle_button" :hidden="errors.length < 1 || errorsHidden" v-if="errors.length > 0">
        <li v-for="error in errors" :key="error">{{error}}</li>
      </ul>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

import store from '@/store';
import Unit from '@/components/Unit';

export default {
  name: 'MobileSelectorView',
  components: { Unit },
  computed: Object.assign({
      label: {
        get: () => store.getters.label,
        set (label) { store.dispatch('setLabel', label) }
      }
    },
    mapGetters(['armyList', 'errors', 'pointsCost', 'unitCount', 'units', 'version'])
  ),
  data () {
    return {
      errorsHidden: true
    };
  },
  methods: {
    toggleErrors () {
      this.errorsHidden = !this.errorsHidden;
    }
  }
};
</script>

<style lang="scss">
  .mobile-selector-view {
    .label {
      border: 0;
      padding: 0;
    }

    .version {
      display: block;
    }

    .units {
      border-top: .1rem dotted $_color_black;
      margin: 0 ($_ / -2);
    }

    .summary {
      background: $_color_dark;
      color: $_color_white;
      margin: 0 ($_ / -2) ($_ / -2);
      position: relative;

      .errors-toggle-button {
        background: $_color_danger;
        border-color: darken($_color_danger, 31.25%);
        color: $_color_white;

        &[disabled] {
          background: $_color_success;
          border-color: darken($_color_success, 31.25%);
        }
      }

      .errors {
        @include position(absolute, null 0 (2 * $_));

        background: lighten($_color_danger, 32.5%);
        border: .1rem solid $_color_danger;
        color: $_color_black;
        list-style: none;
        margin: 0;
        padding: ($_ / 2);
      }
    }

    .number,
    .unitCount {
      @include position(absolute, 0 (2 * $_) null null);

      line-height: 2 * $_;
      text-align: center;
      width: 2 * $_;
    }

    .id,
    .pointsCost {
      margin: 0 (6 * $_) 0 (2 * $_);
      padding: ($_ / 2) .5em;
    }

    button {
      @include position(absolute, 0 null null);

      line-height: 2 * $_ - .6rem;
      margin: .2rem;
      padding: 0;
      width: 2 * $_ - .4rem;
    }

    @include grid-media($md-neat-grid) {
      .units,
      .summary {
        margin: 0;
      }
    }
  }
</style>
