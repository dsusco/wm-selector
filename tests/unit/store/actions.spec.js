import axios from 'axios';

import actions from '@/store/actions';
import magicItems from '@/json/magic-items.json';
import router from '@/router';
import versionKey from '@/utils/version-key';

jest.mock('@/utils/version-key', () => ({
  'a version': 'Warmaster'
}));

jest.mock('axios');

describe('store.js actions', () => {
  const
    axiosResponse = {
      config: {
        url: '/json/a jsonPath.json'
      },
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
      printItems: [{ abbr: 'a', title: 'a print item' }],
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

  it('addPrintItem commits ADD_PRINT_ITEM', () => {
    actions.addPrintItem(context, 0);
    expect(commit).toHaveBeenCalledWith('ADD_PRINT_ITEM', 0);
  });

  describe('loadSaveURL', () => {
    var params;

    beforeEach(() => {
      context = {
        commit,
        dispatch,
        getters: {
          printableItems: [
            { abbr: 'pi1', title: 'printable item 1' },
            { abbr: 'pi2', title: 'printable item 2' },
            { abbr: 'pi3', title: 'printable item 3' }
          ],
          units: {
            'a unit': {
              order: 0
            }
          },
          upgrades: {
            'an upgrade': {
              order: 'au'
            }
          },
          version: 'a version'
        }
      };

      params = {
        label: 'a label',
        printItems: 'pi2,pi1',
        '0': 2,
        '0-au': 1
      };
    });

    it('dispatches setActiveArmyListAccordion', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(dispatch).toHaveBeenCalledWith('setActiveArmyListAccordion', 'a version');
    });

    it('dispatches setLabel', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(dispatch).toHaveBeenCalledWith('setLabel', 'a label');
    });

    it('dispatches addPrintItem', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(dispatch).toHaveBeenCalledWith('addPrintItem', 1);
      expect(dispatch).toHaveBeenCalledWith('addPrintItem', 0);
    });

    it('dispatches setUnitNumber', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(dispatch).toHaveBeenCalledWith('setUnitNumber', {
        unitID: 'a unit',
        number: 2,
        skipValidation: true
      });
    });

    it('dispatches setUnitUpgradeNumber', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(dispatch).toHaveBeenCalledWith('setUnitUpgradeNumber', {
        unitID: 'a unit',
        upgradeID: 'an upgrade',
        number: 1,
        skipValidation: true
      });
    });

    it('dispatches validate', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(dispatch).toHaveBeenCalledWith('validate');
    });

    it('pushes Selector location to router', async () => {
      await Promise.all([actions.loadSaveURL(context, params)]);
      expect(routerPushSpy).toHaveBeenCalledWith({ name: 'Selector' });
    });
  });

  it('removePrintItem commits REMOVE_PRINT_ITEM', () => {
    actions.removePrintItem(context, 0);
    expect(commit).toHaveBeenCalledWith('REMOVE_PRINT_ITEM', 0);
  });

  it('setActiveArmyListAccordion commits SET_ACTIVE_ARMY_LIST_ACCORDION', () => {
    actions.setActiveArmyListAccordion(context, 'an accordion');
    expect(commit).toHaveBeenCalledWith('SET_ACTIVE_ARMY_LIST_ACCORDION', 'an accordion');
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
      expect(commit).toHaveBeenCalledWith('SET_UPGRADE_CONSTRAINTS', axiosResponse.data.upgradeConstraints.concat(magicItems[versionKey[axiosResponse.data.version]].upgradeConstraints));
      expect(commit).toHaveBeenCalledWith('SET_UPGRADES', Object.assign({}, axiosResponse.data.upgrades, magicItems[versionKey[axiosResponse.data.version]].upgrades));
      expect(commit).toHaveBeenCalledWith('SET_UNITS', axiosResponse.data.units);
      expect(commit).toHaveBeenCalledWith('SET_VERSION', axiosResponse.data.version);
    });

    it('pushes Selector location to router', async () => {
      await actions.setArmy(context, expected.jsonPath);
      expect(routerPushSpy).toHaveBeenCalledWith({ name: 'Selector' });
    });

    it('dispatches validate', async () => {
      await Promise.all([actions.setArmy(context, expected.jsonPath)]);
      expect(dispatch).toHaveBeenCalledWith('validate');
    });

    it('commits SET_PRINT_ITEMS', async () => {
      await actions.setArmy(context, expected.jsonPath);
      expect(commit).toHaveBeenCalledWith('SET_PRINT_ITEMS', []);
    });

    it('commits SET_PRINTABLE_ITEMS', async () => {
      await actions.setArmy(context, expected.jsonPath);
      expect(commit).toHaveBeenCalledWith('SET_PRINTABLE_ITEMS', [
        { abbr: 'l', title: 'Text List' },
        { abbr: 's', title: 'Stats' },
        { abbr: 'sl', title: 'Stats Used' },
        { abbr: 'ar', title: 'Army Rules' },
        { abbr: 'sr', title: 'Special Rules' },
        { abbr: 'sru', title: 'Special Rules Used' },
        { abbr: 'mi', title: 'Magic Items' },
        { abbr: 'miu', title: 'Magic Items Used' },
        { abbr: 'sp', title: 'Spells' },
        { abbr: 'qr', title: 'QR Code' },
        { abbr: 'url', title: 'URL' }
      ]);
    });
  });

  it('setLabel commits SET_LABEL', () => {
    actions.setLabel(context, expected.label);
    expect(commit).toHaveBeenCalledWith('SET_LABEL', expected.label);
  });

  it('setPrintItems commits SET_PRINT_ITEMS', () => {
    actions.setPrintItems(context, expected.printItems);
    expect(commit).toHaveBeenCalledWith('SET_PRINT_ITEMS', expected.printItems);
  });

  describe('setUnitNumber', () => {
    var context, dispatch, payload;

    beforeEach(() => {
      dispatch = jest.fn();

      context = {
        commit,
        dispatch,
        getters: {
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
        skipSettingUnitPointsCost: true,
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
      context.getters = {
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

    it('commits ADD_UNIT_UPGRADE when addOnUpgrades are present and the upgrade.number is being set to a positive number', () => {
      context.getters.upgrades['an upgrade'] = {
        number: 0,
        addOnUpgrades: ['another upgrade']
      };

      actions.setUnitUpgradeNumber(context, payload);
      expect(commit).toHaveBeenCalledWith('ADD_UNIT_UPGRADE', { unitID: 'a unit', upgradeID: 'another upgrade' });
    });

    it('commits REMOVE_UNIT_UPGRADE when addOnUpgrades are present and the upgrade.number is being set to 0', () => {
      context.getters.upgrades['an upgrade'].addOnUpgrades = ['another upgrade'];
      payload.number = 0;

      actions.setUnitUpgradeNumber(context, payload);
      expect(commit).toHaveBeenCalledWith('REMOVE_UNIT_UPGRADE', { unitID: 'a unit', upgradeID: 'another upgrade' });
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
        pointsCost: 1000,
        size: 1,
        units: {},
        upgrades: {}
      };

    beforeEach(() => {
      context.getters = getters;
    });

    it('commits CLEAR_ERRORS', () => {
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('CLEAR_ERRORS');
    });

    describe('homologousUnits', () => {
      beforeEach(() => {
        context.getters.units['homologous_unit'] = { number: 1 };
      });

      it('armyMin violation commits PUSH_ERROR', () => {
        context.getters.units['unit'] = { armyMin: 2, number: 0, homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 unit or homologous_unit per army.');
      });

      it('prevent armyMin violation', () => {
        context.getters.units['unit'] = { armyMin: 2, number: 1, homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).not.toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 unit or homologous_unit per army.');
      });

      it('armyMax violation commits PUSH_ERROR', () => {
        context.getters.units['unit'] = { armyMax: 1, number: 1, homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit or homologous_unit per army.');
      });

      it('min violation commits PUSH_ERROR', () => {
        context.getters.units['unit'] = { min: 2, number: 0, homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 unit or homologous_unit per 1,000 points.');
      });

      it('prevent min violation', () => {
        context.getters.units['unit'] = { min: 2, number: 1, homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).not.toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 unit or homologous_unit per 1,000 points.');
      });

      it('max elite violation commits PUSH_ERROR', () => {
        context.getters.units['unit'] = { number: 0, max: 'elite', homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 0 unit or homologous_unit per 1,000 points.');
      });

      it('max violation commits PUSH_ERROR', () => {
        context.getters.units['unit'] = { max: 1, number: 1, homologousUnits: ['homologous_unit'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit or homologous_unit per 1,000 points.');
      });
    });

    describe('homologousUpgrades', () => {
      beforeEach(() => {
        context.getters.upgrades['homologous_upgrade'] = { number: 1 };
      });

      it('armyMin violation commits PUSH_ERROR', () => {
        context.getters.upgrades['upgrade'] = { armyMin: 2, number: 0, homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 upgrade or homologous_upgrade per army.');
      });

      it('prevent armyMin violation', () => {
        context.getters.upgrades['upgrade'] = { armyMin: 2, number: 1, homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).not.toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 upgrade or homologous_upgrade per army.');
      });

      it('armyMax violation commits PUSH_ERROR', () => {
        context.getters.upgrades['upgrade'] = { armyMax: 1, number: 1, homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 upgrade or homologous_upgrade per army.');
      });

      it('min violation commits PUSH_ERROR', () => {
        context.getters.upgrades['upgrade'] = { min: 2, number: 0, homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 upgrade or homologous_upgrade per 1,000 points.');
      });

      it('prevent min violation', () => {
        context.getters.upgrades['upgrade'] = { min: 2, number: 1, homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).not.toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 2 upgrade or homologous_upgrade per 1,000 points.');
      });

      it('max elite violation commits PUSH_ERROR', () => {
        context.getters.upgrades['upgrade'] = { number: 0, max: 'elite', homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 0 upgrade or homologous_upgrade per 1,000 points.');
      });

      it('max violation commits PUSH_ERROR', () => {
        context.getters.upgrades['upgrade'] = { max: 1, number: 1, homologousUpgrades: ['homologous_upgrade'] };
        actions.validate(context);
        expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 upgrade or homologous_upgrade per 1,000 points.');
      });
    });

    it('armyMin violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { armyMin: 1, number: 0 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 1 unit per army.');
    });

    it('armyMax violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { armyMax: 1, number: 2 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit per army.');
    });

    it('min "As *" violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { min: 'As some unit', number: 0, requiredUnits: ['another unit'] };
      context.getters.units['another unit'] = { number: 1 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 1 unit per 1 another unit.');
    });

    it('min violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { min: 1, number: 0 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Minimum of 1 unit per 1,000 points.');
    });

    it('max elite violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, max: 'elite' };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 0 unit per 1,000 points.');
    });

    it('max "Up to Half" violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { max: 'Up to Half', number: 1, requiredUnits: ['another unit'] };
      context.getters.units['another unit'] = { number: 1 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 0 unit per 1 another unit.');
    });

    it('max "As *" violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { max: 'As some unit', number: 2, requiredUnits: ['another unit'] };
      context.getters.units['another unit'] = { number: 1 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit per 1 another unit.');
    });

    it('max violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { max: 1, number: 2 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'Maximum of 1 unit per 1,000 points.');
    });

    it('magic item count violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, upgrades: { upgrade: { number: 2 } } };
      context.getters.upgrades['upgrade'] = { type: 'Device of Power' };
            actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', '1 unit may only have 1 magic item.');
    });

    it('mount count violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, upgrades: { upgrade: { number: 2 } } };
      context.getters.upgrades['upgrade'] = { type: 'Mount' };
            actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', '1 unit may only have 1 mount.');
    });

    it('augendUnits violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, augendUnits: ['augend'] };
      context.getters.units['augend'] = { number: 0 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', '1 unit requires at least 1 augend.');
    });

    it('requiredUnits violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, requiredUnits: ['required unit'] };
      context.getters.units['required unit'] = { number: 0 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'unit must be taken with required unit.');
    });

    it('requiredUpgrades violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, requiredUpgrades: ['required upgrade'] };
      context.getters.upgrades['required upgrade'] = { number: 0 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'unit must be taken with required upgrade.');
    });

    it('prohibitedUnits violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, prohibitedUnits: ['prohibited unit'] };
      context.getters.units['prohibited unit'] = { number: 1 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'unit cannot be taken with prohibited unit.');
    });

    it('prohibitedUpgrades violation commits PUSH_ERROR', () => {
      context.getters.units['unit'] = { number: 1, prohibitedUpgrades: ['prohibited upgrade'] };
      context.getters.upgrades['prohibited upgrade'] = { number: 1 };
      actions.validate(context);
      expect(commit).toHaveBeenCalledWith('PUSH_ERROR', 'unit cannot be taken with prohibited upgrade.');
    });
  });
});
