import axios from 'axios';

import actions from '@/store/actions';
import magicItems from '@/json/magic-items.json';
import router from '@/router';

jest.mock('axios');

describe('store.js actions', () => {
  const
    axiosResponse = {
      data: {
        armyRules: 'some armyRules',
        magic: 'magic flag',
        name: 'a name',
        specialRules: 'some specialRules',
        spells: 'some spells',
        units: 'some units',
        upgradeConstraints: ['some upgradeConstraints'],
        upgrades: {
          'a upgrade': {}
        },
        version: 'a version',
      }
    },
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

  var context, commit, dispatch;

  axios.get.mockImplementation(() => Promise.resolve(axiosResponse));

  beforeEach(() => {
    commit = jest.fn()
    dispatch = jest.fn();

    context = {
      commit,
      dispatch
    };
  });

  describe('setArmy', () => {
    it('commits SET_JSON_PATH and the response data', async () => {
      await actions.setArmy(context, expected.jsonPath);

      expect(commit).toHaveBeenCalledWith('SET_ARMY_LIST', axiosResponse.data.name);
      expect(commit).toHaveBeenCalledWith('SET_ARMY_RULES', axiosResponse.data.armyRules);
      expect(commit).toHaveBeenCalledWith('SET_JSON_PATH', expected.jsonPath);
      expect(commit).toHaveBeenCalledWith('SET_MAGIC', axiosResponse.data.magic);
      expect(commit).toHaveBeenCalledWith('SET_SPECIAL_RULES', axiosResponse.data.specialRules);
      expect(commit).toHaveBeenCalledWith('SET_SPELLS', axiosResponse.data.spells);
      expect(commit).toHaveBeenCalledWith('SET_UPGRADE_CONSTRAINTS', axiosResponse.data.upgradeConstraints.concat(magicItems.upgradeConstraints));
      expect(commit).toHaveBeenCalledWith('SET_UPGRADES', Object.assign({}, axiosResponse.data.upgrades, magicItems.upgrades));
      expect(commit).toHaveBeenCalledWith('SET_UNITS', axiosResponse.data.units);
      expect(commit).toHaveBeenCalledWith('SET_VERSION', axiosResponse.data.version);
    });

    it('pushes Selector location to router', async () => {
      await actions.setArmy(context, expected.jsonPath);
      expect(routerPushSpy).toHaveBeenCalledWith({ name: 'Selector' });
    });

    it('dispatches validate', async () => {
      await actions.setArmy(context, expected.jsonPath);
      expect(dispatch).toHaveBeenCalledWith('validate');
    });
  });

  it('setLabel commits SET_LABEL', () => {
    actions.setLabel(context, expected.label);
    expect(commit).toHaveBeenCalledWith('SET_LABEL', expected.label);
  });

  describe('setUnitNumber', () => {
    var context, dispatch, payload;

    beforeEach(() => {
      dispatch = jest.fn();

      context = {
        commit,
        dispatch,
        state: {
          units: {
            'a unit': {
              upgrades: {
                'an upgrade': {
                  number: 1
                }
              }
            }
          }
        }
      };

      payload = {
        unitID: 'a unit',
        number: 1
      };
    });

    it('commits SET_UNIT_NUMBER and SET_UNIT_POINTS_COST', () => {
      actions.setUnitNumber(context, payload);
      expect(commit).toHaveBeenCalledWith('SET_UNIT_NUMBER', payload);
      expect(commit).toHaveBeenCalledWith('SET_UNIT_POINTS_COST', payload);
    });

    it('does not let number go negative', () => {
      payload.number = -1;
      actions.setUnitNumber(context, payload);
      expect(payload.number).toEqual(0);
      expect(commit).toHaveBeenCalledWith('SET_UNIT_NUMBER', payload);
      expect(commit).toHaveBeenCalledWith('SET_UNIT_POINTS_COST', payload);
    });

    it('dispatches setUnitUpgradeNumber if upgrade.number > number', () => {
      payload.number = -1;
      actions.setUnitNumber(context, payload);
      expect(dispatch).toHaveBeenCalledWith('setUnitUpgradeNumber', {
        unitID: 'a unit',
        number: 0,
        skipValidation: true,
        upgradeID: 'an upgrade'
      });
    });

    it('dispatches validate', () => {
      actions.setUnitNumber(context, payload);
      expect(dispatch).toHaveBeenCalledWith('validate');
    });
  });

  describe('setUnitUpgradeNumber', () => {
    var payload;

    beforeEach(() => {
      context.state = {
        units: {
          'a unit': {
            number: 1,
            upgrades: {
              'an upgrade': {
                number: 0
              }
            }
          }
        },
        upgrades: {
          'an upgrade': {
            number: 1
          }
        }
      };

      payload = {
        unitID: 'a unit',
        upgradeID: 'an upgrade',
        number: 1,
        skipValidation: true
      };
    });

    it('commits SET_UPGRADE_NUMBER and SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST', () => {
      actions.setUnitUpgradeNumber(context, payload);
      expect(commit).toHaveBeenCalledWith('SET_UPGRADE_NUMBER', { upgradeID: 'an upgrade', number: 2 });
      expect(commit).toHaveBeenCalledWith('SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST', payload);
    });

    it('does not let number go negative', () => {
      payload.number = -1;
      actions.setUnitUpgradeNumber(context, payload);
      expect(payload.number).toEqual(0);
      expect(commit).toHaveBeenCalledWith('SET_UPGRADE_NUMBER', { upgradeID: 'an upgrade', number: 1 });
      expect(commit).toHaveBeenCalledWith('SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST', payload);
    });

    it('does not let number go above unit.number', () => {
      payload.number = 2;
      actions.setUnitUpgradeNumber(context, payload);
      expect(payload.number).toEqual(1);
      expect(commit).toHaveBeenCalledWith('SET_UPGRADE_NUMBER', { upgradeID: 'an upgrade', number: 2 });
      expect(commit).toHaveBeenCalledWith('SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST', payload);
    });

    it('commits SET_UNIT_POINTS_COST and dispatches validate when not skipping validation', () => {
      delete payload.skipValidation;
      actions.setUnitUpgradeNumber(context, payload);
      expect(commit).toHaveBeenCalledWith('SET_UNIT_POINTS_COST', payload);
      expect(dispatch).toHaveBeenCalledWith('validate');
    });
  });

  describe('validate', () => {
    var
      getters = {
        size: 1
      },
      state = {
        units: {
        },
        upgrades: {
        }
      };

    beforeEach(() => {
      context.getters = getters;
      context.state = state;
    });

    it('commits CLEAR_ERRORS', () => {
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('CLEAR_ERRORS');
    });

    it('armyMin violation commits PUSH_ERROR', () => {
      state.units['unit'] = { armyMin: 1, number: 0 }
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 1 unit per army.');
    });

    it('armyMax violation commits PUSH_ERROR', () => {
      state.units['unit'] = { armyMax: 1, number: 2 }
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit per army.');
    });

    it('min violation commits PUSH_ERROR', () => {
      state.units['unit'] = { min: 1, number: 0 }
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 1 unit per 1,000 points.');
    });

    it('max violation commits PUSH_ERROR', () => {
      state.units['unit'] = { max: 1, number: 2 }
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit per 1,000 points.');
    });

    it('max violation commits PUSH_ERROR', () => {
      state.units['unit'] = { number: 1, augendUnits: ['augend'] }
      state.units['augend'] = { number: 0 }
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 1 augend required for 1 unit.');
    });

    it('elite violation commits PUSH_ERROR', () => {
      state.units['unit'] = { number: 1, elite: true }
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 0 unit per 1,000 points.');
    });
  });
});
