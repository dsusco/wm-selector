<template>
  <main class="home-view">
    <h1>Warmaster Army Selector</h1>

    <p>Choose an army from the lists below, select your units and print what you want!</p>

    <span class="downloads">
      <a target="_blank" title="Warmaster Rulebook – Part 1" href="/pdfs/Warmaster-RuleBook.pdf"><span>Warmaster Rulebook – Part 1</span></a>
      <a target="_blank" title="Warmaster Rulebook – Part 2" href="/pdfs/WarmasterRulebookPart2.pdf"><span>Warmaster Rulebook – Part 2</span></a>
      <a target="_blank" title="Warmaster Errata" href="/pdfs/Warmaster_LRB_Errata.pdf"><span>Warmaster Errata</span></a>
      <a target="_blank" title="Rules Update (included in the PDFs but not the printed rulebook)" href="/pdfs/Warmaster_Rules_Update.pdf"><span>Rules Update (included in the PDFs but not the printed rulebook)</span></a>
    </span>

    <ArmyListAccordion :title="'Warmaster Armies'">
      <a target="_blank" title="Warmaster Armies" href="/pdfs/Warmaster_Armies.pdf"><span>Warmaster Armies</span></a>
      <a target="_blank" title="Warmaster Armies Errata" href="/pdfs/Warmaster_Armies_Errata_2009.pdf"><span>Warmaster Armies Errata</span></a>
    </ArmyListAccordion>

    <ArmyListAccordion :title="'Warmaster Trial Armies Compendium 2009'">
      <a target="_blank" title="Warmaster Trial Armies Compendium 2009" href="/pdfs/Warmaster_Trial_Armies_2009.pdf"><span>Warmaster Trial Armies Compendium 2009</span></a>
    </ArmyListAccordion>

    <ArmyListAccordion :title="'Warmaster Revolution'">
      <a target="_blank" title="Warmaster Revolution Compendium" href="/pdfs/WMR1.1compendium.pdf"><span>Warmaster Revolution Compendium</span></a>
      <a target="_blank" title="Warmaster Revolution Armies" href="/pdfs/WMR armies1.1.pdf"><span>Warmaster Revolution Armies</span></a>
    </ArmyListAccordion>

    <ArmyListAccordion :title="'Warmaster Ancients'">
      <a target="_blank" title="Warmaster Ancients Rulebook Errata" href="/pdfs/WAerr.pdf"><span>Warmaster Ancients Rulebook Errata</span></a>
      <a target="_blank" title="Rules Update for Warmaster Ancients" href="/pdfs/WarmasterAncientsUpdate28.pdf"><span>Rules Update for Warmaster Ancients</span></a>
    </ArmyListAccordion>

    <ArmyListAccordion :title="'Warmaster Ancient Armies'">
      <a target="_blank" title="Warmaster Ancient Armies Errata" href="/pdfs/WAAerr.pdf"><span>Warmaster Ancient Armies Errata</span></a>
    </ArmyListAccordion>

    <ArmyListAccordion :title="'Warmaster Medieval'">
      <a target="_blank" title="Warmaster Medieval Armies Errata" href="/pdfs/WMAerr.pdf"><span>Warmaster Medieval Armies Errata</span></a>
    </ArmyListAccordion>
	
    <ArmyListAccordion :title="'Warmaster Evolution'">
      <a target="_blank" title="Warmaster Evolution Règles" href="/pdfs/WME_Regles_v4-0-0.pdf"><span>Warmaster Evolution Règles</span></a>
      <a target="_blank" title="Warmaster Evolution Armées" href="/pdfs/WME_Armees_v2.42_beta.pdf"><span>Warmaster Evolution Armées</span></a>
    </ArmyListAccordion>
  </main>
</template>

<script>
import ArmyListAccordion from '@/components/Home/ArmyListAccordion';

export default {
  name: 'HomeView',
  components: { ArmyListAccordion }
};
</script>

<style lang="scss">
  .home-view {
    position: relative;

    h1 {
      margin-right: 3em;
    }

    .downloads {
      @include position(absolute, ($_ / 2) 1em null null);

      a {
        margin-left: .5em;
        position: relative;

        &::before {
          @include font-awesome('\f1c1');
        }

        &:focus::after {
          @include _(1.4rem);
          @include position(absolute, $_ 0 null null);

          background: $_color_black;
          color: #ddd;
          content: attr(title);
          padding: 0 .8rem;
          white-space: nowrap;
        }
      }

      span {
        @include sr-only();
      }
    }
  }
</style>
