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

    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'wm-selector',
  computed: mapGetters(['jsonPath'])
};
</script>

<style lang="scss">
  #nav {
    button {
      background: $_color_lighter;
      border-color: $_color_black;
      border-radius: 0;
      margin: 0 .25em -.1rem;

      &.router-link-exact-active {
        background: $_color_white;
        border-bottom-color: $_color_white;
      }

      .fa {
        margin: 0 .5rem;
        width: $_font_size;
      }
    }

    @include grid-media($md-neat-grid) {
      button {
        @include padding(0 null);

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
</style>
