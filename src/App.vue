<template>
  <div id="wm-selector">
    <nav id="nav">
      <router-link tag="button" class="home-view-button" :to="{ name: 'Home' }">
        <span class="fa fa-home"></span>
        <span class="sr-only">Home</span>
      </router-link>

      <router-link tag="button" class="selector-view-button" :to="{ name: 'Selector' }" :disabled="!jsonPath">
        <span class="fa fa-hand-pointer-o"></span>
        <span class="sr-only">Selector</span>
      </router-link>

      <router-link tag="button" class="text-view-button" :to="{ name: 'Text' }" :disabled="!jsonPath">
        <span class="fa fa-file-text-o"></span>
        <span class="sr-only">Text</span>
      </router-link>

      <router-link tag="button" class="save-view-button" :to="{ name: 'Save' }" :disabled="!jsonPath">
        <span class="fa fa-save"></span>
        <span class="sr-only">Save</span>
      </router-link>

      <router-link tag="button" class="print-view-button" :to="{ name: 'Print' }" :disabled="!jsonPath">
        <span class="fa fa-print"></span>
        <span class="sr-only">Print</span>
      </router-link>
    </nav>

    <router-view id="main" />

    <PrintItems id="print_view" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import PrintItems from '@/views/print/PrintItems';

export default {
  name: 'wm-selector',
  components: { PrintItems },
  computed: mapGetters(['jsonPath', 'printItems'])
};
</script>

<style lang="scss">
  #wm-selector {
    @include grid-media($lg-neat-grid) {
      #nav,
      #main {
        margin: 0 auto;
        max-width: 96rem + 2 * map-get($lg-neat-grid, gutter);
      }
    }
  }

  #nav {
    button {
      background: $_color_lighter;
      border-color: $_color_black;
      border-radius: 0;
      padding: 0;
      margin: 0 .25em -.1rem;

      &.router-link-exact-active {
        background: $_color_white;
        border-bottom-color: $_color_white;
      }

      .fa {
        line-height: 2 * $_;
        width: 2 * $_;
      }
    }

    @include grid-media($md-neat-grid) {
      margin: 0 1em;

      button {
        @include _(1.2rem);

        line-height: $_ - .2rem;
        padding: 0 .5em;

        .fa {
          @include sr-only(false);
        }

        .sr-only {
          clip: auto;
          height: auto;
          overflow: visible;
          position: static;
          white-space: normal;
          width: auto;
        }
      }
    }
  }

  #main {
    background: $_color_white;
    border: .1rem solid $_color_black;
    @include border-width(null 0);
    padding: ($_ / 2) 1em;

    @include grid-media($md-neat-grid) {
      @include border-width(.1rem);
      margin: 0 1em;
    }
  }

  #print_view {
    display: none;
  }
</style>
