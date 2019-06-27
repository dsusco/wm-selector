<template>
  <main class="home-view">
    <h1>Warmaster Army Selector</h1>

    <p>Choose an army from the lists below, select your units and print what you want!</p>

    <ArmyListGroupTab :group="'Warmaster Armies'" />
    <ArmyListGroupTab :group="'Warmaster Trial Armies Compendium 2009'" />
    <ArmyListGroupTab :group="'Warmaster Revolution'" />
    <ArmyListGroupTab :group="'Warmaster Ancients'" />
    <ArmyListGroupTab :group="'Warmaster Ancient Armies'" />
    <ArmyListGroupTab :group="'Warmaster Medieval Armies'" />
  </main>
</template>

<script>
import ArmyListGroupTab from '@/components/ArmyListGroupTab.vue';

export default {
  name: 'HomeView',
  components: { ArmyListGroupTab }
};
</script>

<style lang="scss">
  .home-view {
  }
</style>
