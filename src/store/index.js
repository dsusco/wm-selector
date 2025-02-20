import Vue from 'vue';
import Vuex from 'vuex';

import actions from '@/store/actions';
import getters from '@/store/getters';
import mutations from '@/store/mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state: {
    activeArmyListAccordion: 'Warmaster Revolution',
    armyList: '',
    armyRules: undefined,
    errors: [],
    json: {
      magic: false,
      specialRules: {},
      spells: [],
      units: {},
      upgrades: {}
    },
    jsonPath: '',
    label: '',
    magic: undefined,
    printItems: [],
    printableItems: [],
    specialRules: {},
    spells: [],
    units: {},
    upgradeConstraints: [],
    upgrades: {},
    version: ''
  }
});
