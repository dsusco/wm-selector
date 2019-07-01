<template>
  <div id="wm-selector">
    <nav id="nav">
      <router-link tag="button" class="home-view-button" :to="{ name: 'Home' }">
        <span class="fa fa-home"></span>
        <span class="sr-only">Home</span>
      </router-link>

      <router-link tag="button" class="selector-view-button" :to="{ name: 'Selector' }" :disabled="!jsonPath">
        <span class="fa fa-mouse-pointer"></span>
        <span class="sr-only">Selector</span>
      </router-link>

      <router-link tag="button" class="mobile-selector-view-button" :to="{ name: 'Mobile Selector' }" :disabled="!jsonPath">
        <span class="fa fa-hand-pointer-o"></span>
        <span class="sr-only">Mobile Selector</span>
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

    <footer id="footer">
      <p>This website is completely unofficial and in no way endorsed by Games Workshop Limited.</p>

      <p>This Warmaster army selector is open source and maintained on <a href="https://github.com/dsusco/wm-selector" target="_blank">GitHub</a>.</p>

      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="ADMR9VQE2JRTE" />
        <button type="submit">Donate</button>
      </form>
    </footer>

    <PrintItems id="print_view" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import PrintItems from '@/components/PrintItems';

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
        @include margin(null auto);

        max-width: 96rem + 2 * map-get($lg-neat-grid, gutter);
      }
    }
  }

  #nav {
    overflow: hidden;
    white-space: nowrap;

    button {
      background: $_color_lighter;
      border-color: $_color_black;
      border-radius: 0;
      padding: 0;
      margin: 0 .25em;

      &:focus,
      &:hover {
        background: $_color_light;
        outline: none;
        text-decoration: underline;
      }

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
      margin: 0 1.6rem;

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
    margin: -.1rem 0 0;
    padding: ($_ / 2);

    @include grid-media($md-neat-grid) {
      @include border-width(.1rem);
      @include margin(null 1.6rem);
    }
  }

  #footer {
    @include _(1.2rem);

    color: $_color_white;
    text-align: center;
    padding: ($_ / 2) 1.6rem;

    p,
    form {
      margin: 0;
    }

    a,
    button {
      color: inherit;
      text-decoration: underline;

      &:focus,
      &:hover {
        border-bottom: .1rem solid $_color_white;
      }
    }

    button {
      background: 0;
      border: 0;
      border-radius: 0;
      line-height: 1;
      padding: 0;
      vertical-align: baseline;

      &:focus,
      &:hover {
        background: 0;
      }
    }
  }

  #print_view {
    display: none;
  }
</style>
