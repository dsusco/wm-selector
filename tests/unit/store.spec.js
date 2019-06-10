import axios from 'axios';

import actions from '@/store/actions';
import getters from '@/store/getters';
import mutations from '@/store/mutations';
import router from '@/router';

const
  expected = {
    armyList: 'an armyList',
    armyRules: [{ text: [] }],
    errors: [],
    jsonPath: 'a jsonPath',
    label: 'a label',
    magic: true,
    specialRules: { 'a specialRule': { text: [] } },
    spells: [{ roll: 0 }],
    units: { 'a unit': { type: 'a type', order: 0, points: 50 } },
    upgradeConstraints: [{ unitType: ['a type'], upgrades: ['an upgrade'] }],
    upgrades: { 'an upgrade': { order: 0, points: 5 } },
    version: 'a version'
  },
  routerPushSpy = jest.spyOn(router, 'push');

var commit, state;

jest.mock('axios');
axios.get.mockImplementation(() => Promise.resolve({}));

describe('store.js', () => {
  beforeEach(() => state = {
    armyList: '',
    armyRules: undefined,
    errors: [],
    jsonPath: '',
    label: '',
    magic: undefined,
    specialRules: {},
    spells: [],
    units: {},
    upgradeConstraints: [],
    upgrades: {},
    version: ''
  });

  describe('actions', () => {
    beforeEach(() => commit = jest.fn());

    it('setArmy commits SET_JSON_PATH', async () => {
      await actions.setArmy({ commit }, expected.jsonPath);

      expect(commit).toHaveBeenCalledWith('SET_JSON_PATH', expected.jsonPath);
    });

    it('setArmy pushes Selector location to router', async () => {
      await actions.setArmy({ commit }, expected.jsonPath);
      expect(routerPushSpy).toHaveBeenCalledWith({ name: 'Selector' });
    });
  });

  describe('getters', () => {
    it('jsonPath returns state.jsonPath', () => {
      expect(getters.jsonPath(state)).toEqual('');
      state.jsonPath = expected.jsonPath;
      expect(getters.jsonPath(state)).toEqual(expected.jsonPath);
    });
  });

  describe('mutations', () => {
    it('CLEAR_ERRORS empties state.errors', () => {
      mutations.PUSH_ERROR(state, 'an error');
      expect(state.errors).toEqual(['an error']);
      mutations.CLEAR_ERRORS(state);
      expect(state.errors).toEqual([]);
    });

    it('PUSH_ERROR pushes an error on to state.errors', () => {
      mutations.PUSH_ERROR(state, 'an error');
      expect(state.errors).toEqual(['an error']);
    });

    it('SET_ARMY_LIST sets state.armyList', () => {
      mutations.SET_ARMY_LIST(state, expected.armyList);
      expect(state.armyList).toEqual(expected.armyList);
    });

    it('SET_ARMY_RULES sets state.armyRules', () => {
      mutations.SET_ARMY_RULES(state, expected.armyRules);
      expect(state.armyRules).toEqual(expected.armyRules);
    });

    it('SET_JSON_PATH sets state.jsonPath', () => {
      mutations.SET_JSON_PATH(state, expected.jsonPath);
      expect(state.jsonPath).toEqual(expected.jsonPath);
    });

    it('SET_LABEL sets state.label', () => {
      mutations.SET_LABEL(state, expected.label);
      expect(state.label).toEqual(expected.label);
    });

    it('SET_MAGIC sets state.magic', () => {
      mutations.SET_MAGIC(state, expected.magic);
      expect(state.magic).toEqual(expected.magic);
    });

    it('SET_SPECIAL_RULES sets state.specialRules', () => {
      mutations.SET_SPECIAL_RULES(state, expected.specialRules);
      expect(state.specialRules).toEqual(expected.specialRules);
    });

    it('SET_SPELLS sets state.spells', () => {
      mutations.SET_SPELLS(state, expected.spells);
      expect(state.spells).toEqual(expected.spells);
    });

    it('SET_UNIT_NUMBER sets state.units[].number', () => {
      mutations.SET_UNITS(state, expected.units);
      mutations.SET_UNIT_NUMBER(state, { unitID: 'a unit', number: 1 });
      expect(state.units).toEqual({
        'a unit': {
          number: 1,
          order: 0,
          points: 50,
          pointsCost: 0,
          type: 'a type'
        }
      });
    });

    it('SET_UNIT_POINTS_COST sets state.units[].pointsCost with upgrades', () => {
      mutations.SET_UPGRADES(state, expected.upgrades);
      mutations.SET_UPGRADE_CONSTRAINTS(state, expected.upgradeConstraints);
      mutations.SET_UNITS(state, expected.units);
      mutations.SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST(state, { unitID: 'a unit', upgradeID: 'an upgrade', number: 1 });
      mutations.SET_UNIT_NUMBER(state, { unitID: 'a unit', number: 1 });
      mutations.SET_UNIT_POINTS_COST(state, 'a unit');
      expect(state.units).toEqual({
        'a unit': {
          number: 1,
          order: 0,
          points: 50,
          pointsCost: 55,
          type: 'a type',
          upgrades: {
            'an upgrade': {
              number: 1,
              pointsCost: 5
            }
          }
        }
      });
    });

    it('SET_UNIT_POINTS_COST sets state.units[].pointsCost with no upgrades', () => {
      mutations.SET_UNITS(state, { 'a unit': { type: 'another type', order: 0, points: 50 } });
      mutations.SET_UNIT_NUMBER(state, { unitID: 'a unit', number: 1 });
      mutations.SET_UNIT_POINTS_COST(state, 'a unit');
      expect(state.units).toEqual({
        'a unit': {
          number: 1,
          order: 0,
          points: 50,
          pointsCost: 50,
          type: 'another type'
        }
      });
    });

    it('SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST sets state.units[].upgrades[].number', () => {
      mutations.SET_UPGRADES(state, expected.upgrades);
      mutations.SET_UPGRADE_CONSTRAINTS(state, expected.upgradeConstraints);
      mutations.SET_UNITS(state, expected.units);
      mutations.SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST(state, { unitID: 'a unit', upgradeID: 'an upgrade', number: 1 });
      expect(state.units).toEqual({
        'a unit': {
          number: 0,
          order: 0,
          points: 50,
          pointsCost: 0,
          type: 'a type',
          upgrades: {
            'an upgrade': {
              number: 1,
              pointsCost: 5
            }
          }
        }
      });
    });

    it('SET_UNITS sets state.units and adds number & pointsCost properties', () => {
      mutations.SET_UPGRADE_CONSTRAINTS(state, expected.upgradeConstraints);
      mutations.SET_UNITS(state, expected.units);
      expect(state.units).toEqual({
        'a unit': {
          number: 0,
          order: 0,
          points: 50,
          pointsCost: 0,
          type: 'a type',
          upgrades: {
            'an upgrade': {
              number: 0,
              pointsCost: 0
            }
          }
        }
      });
    });

    it('SET_UPGRADE_CONSTRAINTS sets state.upgradeConstraints', () => {
      mutations.SET_UPGRADE_CONSTRAINTS(state, expected.upgradeConstraints);
      expect(state.upgradeConstraints).toEqual(expected.upgradeConstraints);
    });

    it('SET_UPGRADE_NUMBER sets state.upgrades[].number', () => {
      mutations.SET_UPGRADES(state, expected.upgrades);
      mutations.SET_UPGRADE_NUMBER(state, { upgradeID: 'an upgrade', number: 1 });
      expect(state.upgrades).toEqual({
        'an upgrade': {
          order: 0,
          number: 1,
          points: 5
        }
      });
    });

    it('SET_UPGRADES sets state.upgrades and adds number property', () => {
      mutations.SET_UPGRADES(state, expected.upgrades);
      expect(state.upgrades).toEqual({
        'an upgrade': {
          order: 0,
          number: 0,
          points: 5
        }
      });
    });

    it('SET_VERSION sets state.version', () => {
      mutations.SET_VERSION(state, expected.version);
      expect(state.version).toEqual(expected.version);
    });
  });
});