const COUNTABLE_UNITS = ['Artillery', 'Cavalry', 'Chariot', 'Chariots', 'Elephant', 'Infantry', 'Machine', 'Monster'];

export default {
  armyList: (state) => state.armyList,
  armyRules: (state) => state.armyRules,
  errors: (state) => state.errors,
  jsonPath: (state) => state.jsonPath,
  label: (state) => state.label,
  magic: (state) => state.magic,
  pointsCost: (state) =>
    Object.values(state.units).reduce((pointsCost, unit) => {
      return pointsCost + +unit.pointsCost;
    }, 0),
  printItems: (state) => state.printItems,
  printableItems: (state) => state.printableItems,
  size: (state, getters) => Math.max(1, Math.floor(getters.pointsCost / 1000)),
  specialRules: (state) => state.specialRules,
  spells: (state) => state.spells,
  unitCount: (state) =>
    Object.values(state.units).reduce((unitCount, unit) => {
      if (!unit.noCount && COUNTABLE_UNITS.includes(unit.type)) {
        unitCount += unit.number;
      }
      return unitCount;
    }, 0),
  units: (state) => state.units,
  upgradeConstraints: (state) => state.upgradeConstraints,
  upgrades: (state) => state.upgrades,
  version: (state) => state.version
};
