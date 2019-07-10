<template>
  <main class="home-view">
    <h1>Warmaster Army Selector</h1>

    <p>Choose an army from the lists below, select your units and print what you want!</p>

    <ArmyListAccordion :title="'Warmaster Armies'" />
    <ArmyListAccordion :title="'Warmaster Trial Armies Compendium 2009'" />
    <ArmyListAccordion :title="'Warmaster Revolution'" />
    <ArmyListAccordion :title="'Warmaster Ancients'" />
    <ArmyListAccordion :title="'Warmaster Ancient Armies'" />
    <ArmyListAccordion :title="'Warmaster Medieval Armies'" />
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
  }
</style>
