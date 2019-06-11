import getters from '@/store/getters';

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
  };

var state;

jest.mock('axios');

describe('store.js getters', () => {
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

  it('size returns the max of the remainder of pointsCost / 1000 and 1', () => {
    expect(getters.size(state, { pointsCost: 500 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 1000 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 1500 })).toEqual(1);
    expect(getters.size(state, { pointsCost: 2000 })).toEqual(2);
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

  it('version returns state.version', () => {
    state.version = expected.version;
    expect(getters.version(state)).toEqual(expected.version);
  });
});
