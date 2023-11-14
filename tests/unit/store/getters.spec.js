import getters from '@/store/getters';

const
  expected = {
    activeArmyListAccordion: 'another accordion',
    armyList: 'an armyList',
    armyRules: [{ text: [] }],
    errors: [],
    jsonPath: 'a jsonPath',
    label: 'a label',
    magic: true,
    printItems: ['a print item'],
    printableItems: ['a second print item'],
    specialRules: { 'a specialRule': { text: [] } },
    spells: [{ roll: 0 }],
    units: { 'a unit': { type: 'a type', order: 0, points: 50 } },
    upgradeConstraints: [{ unitType: ['a type'], upgrades: ['an upgrade'] }],
    upgrades: { 'an upgrade': { order: 0, points: 5 } },
    version: 'a version'
  };

let state;

jest.mock('axios');

describe('store.js getters', () => {
  beforeEach(() => state = {
    activeArmyListAccordion: 'an accordion',
    armyList: '',
    armyRules: undefined,
    errors: [],
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
  });

  it('activeArmyListAccordion returns state.activeArmyListAccordion', () => {
    state.activeArmyListAccordion = expected.activeArmyListAccordion;
    expect(getters.activeArmyListAccordion(state)).toEqual(expected.activeArmyListAccordion);
  });

  it('armyList returns state.armyList', () => {
    state.armyList = expected.armyList;
    expect(getters.armyList(state)).toEqual(expected.armyList);
  });

  it('armyRules returns state.armyRules', () => {
    state.armyRules = expected.armyRules;
    expect(getters.armyRules(state)).toEqual(expected.armyRules);
  });

  it('errors returns state.errors', () => {
    state.errors = expected.errors;
    expect(getters.errors(state)).toEqual(expected.errors);
  });

  it('jsonPath returns state.jsonPath', () => {
    state.jsonPath = expected.jsonPath;
    expect(getters.jsonPath(state)).toEqual(expected.jsonPath);
  });

  it('label returns state.label', () => {
    state.label = expected.label;
    expect(getters.label(state)).toEqual(expected.label);
  });

  it('magic returns state.magic', () => {
    state.magic = expected.magic;
    expect(getters.magic(state)).toEqual(expected.magic);
  });

  it('pointsCost returns a reduction of all the unit value pointCosts', () => {
    state.units = { a: { pointsCost: '+1' }, b: { pointsCost: 1 } };
    expect(getters.pointsCost(state)).toEqual(2);
  });

  it('printItems returns state.printItems', () => {
    state.printItems = expected.printItems;
    expect(getters.printItems(state)).toEqual(expected.printItems);
  });

  it('printableItems returns state.printableItems', () => {
    state.printableItems = expected.printableItems;
    expect(getters.printableItems(state)).toEqual(expected.printableItems);
  });

  it('size returns the max of the remainder of pointsCost / 1000 and 1', () => {
    expect(getters.size(state, { pointsCost: 0 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 1 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 500 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 1000 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 1001 })).toEqual(2);
    expect(getters.size(state, { pointsCost: 1500 })).toEqual(2);
    expect(getters.size(state, { pointsCost: 2000 })).toEqual(2);
    expect(getters.size(state, { pointsCost: 2001 })).toEqual(3);
    expect(getters.size(state, { pointsCost: 3000 })).toEqual(3);
  });

  it('specialRules returns state.specialRules', () => {
    state.specialRules = expected.specialRules;
    expect(getters.specialRules(state)).toEqual(expected.specialRules);
  });

  it('spells returns state.spells', () => {
    state.spells = expected.spells;
    expect(getters.spells(state)).toEqual(expected.spells);
  });

  it('unitCount returns a reduction of all the unit value numbers', () => {
    state.units = {
      a: { number: 1, noCount: true, type: 'Infantry' },
      b: { number: 2, type: 'Infantry' },
      c: { number: 3, type: 'an uncountable type' }
    }

    expect(getters.unitCount(state)).toEqual(2);
  });

  it('unitCount ignores unarmoured skirmishes if they are half or less of the army', () => {
    state.units = {
      a: { number: 1, type: 'Infantry' },
      b: { number: 1, type: 'Infantry', specialRules: ['Skirmish'] }
    }

    expect(getters.unitCount(state)).toEqual(1);
  });

  it("unitCount counts unarmoured skirmishes if they are more than half of the army", () => {
    state.units = {
      a: { number: 1, type: 'Infantry' },
      b: { number: 2, type: 'Infantry', specialRules: ['Skirmish'] }
    }

    expect(getters.unitCount(state)).toEqual(3);
  });

  it("unitCount counts armoured skirmishes if they are half or less of the army", () => {
    state.units = {
      a: { number: 1, type: 'Infantry' },
      b: { number: 1, type: 'Infantry', specialRules: ['Skirmish'], armour: '6+' }
    }

    expect(getters.unitCount(state)).toEqual(2);
  });

  it("unitCount counts all skirmishes if they are more than half of the army", () => {
    state.units = {
      a: { number: 1, type: 'Infantry' },
      b: { number: 1, type: 'Infantry', specialRules: ['Skirmish'] },
      c: { number: 1, type: 'Infantry', specialRules: ['Skirmish'], armour: '6+' }
    }

    expect(getters.unitCount(state)).toEqual(3);
  });

  it("unitCount ignores unarmoured skirmishes but counts armoured skirmishes if they are half or less of the army", () => {
    state.units = {
      a: { number: 2, type: 'Infantry' },
      b: { number: 1, type: 'Infantry', specialRules: ['Skirmish'] },
      c: { number: 1, type: 'Infantry', specialRules: ['Skirmish'], armour: '6+' }
    }

    expect(getters.unitCount(state)).toEqual(3);
  });

  it('units returns state.units', () => {
    state.units = expected.units;
    expect(getters.units(state)).toEqual(expected.units);
  });

  it('upgradeConstraints returns state.upgradeConstraints', () => {
    state.upgradeConstraints = expected.upgradeConstraints;
    expect(getters.upgradeConstraints(state)).toEqual(expected.upgradeConstraints);
  });

  it('upgrades returns state.upgrades', () => {
    state.upgrades = expected.upgrades;
    expect(getters.upgrades(state)).toEqual(expected.upgrades);
  });

  it('usedUnits returns state.units[] with number > 0', () => {
    state.units = {
      a: { number: 0, upgrades: { a1: { number: 1 } } },
      b: { number: 1, upgrades: { b1: { number: 0 } } },
      c: { number: 1, upgrades: { c1: { number: 1 } } }
    };
    expect(getters.usedUnits(state)).toEqual({
      b: { number: 1, upgrades: { } },
      c: { number: 1, upgrades: { c1: { number: 1 } } }
    });
  });

  it('usedUpgrades returns state.upgrades[] with number > 0', () => {
    state.upgrades = {
      a: { number: 0 },
      b: { number: 1 },
      c: { number: 1 }
    };
    expect(getters.usedUpgrades(state)).toEqual({
      b: { number: 1 },
      c: { number: 1 }
    });
  });

  it('version returns state.version', () => {
    state.version = expected.version;
    expect(getters.version(state)).toEqual(expected.version);
  });
});
