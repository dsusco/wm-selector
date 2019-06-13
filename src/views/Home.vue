<template>
  <main id="main" class="home-view">
    <h1>Warmaster Army Selector</h1>

    <ArmyListGroupTab :group="'Warmaster Armies'" />
    <ArmyListGroupTab :group="'Warmaster Trial Armies Compendium 2009'" />
    <ArmyListGroupTab :group="'Warmaster Revolution'" />
    <ArmyListGroupTab :group="'Warmaster Ancients'" />
    <ArmyListGroupTab :group="'Warmaster Ancient Armies'" />
    <ArmyListGroupTab :group="'Warmaster Medieval Armies'" />
  </main>
</template>

<script>
import ArmyListGroupTab from '@/views/home/ArmyListGroupTab.vue';

export default {
  name: 'HomeView',
  components: { ArmyListGroupTab }
};
</script>

<style lang="scss">
  .home-view {
  }
</style>
