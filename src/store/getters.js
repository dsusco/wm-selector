const COUNTABLE_UNITS = ['Artillery', 'Cavalry', 'Chariot', 'Chariots', 'Elephant', 'Infantry', 'Machine', 'Monster'];

export default {
  armyList: (state) => state.armyList,
  armyRules: (state) => state.armyRules,
  errors: (state) => state.errors,
  jsonPath: (state) => state.jsonPath,
  label: (state) => state.label,
  magic: (state) => state.magic,
  pointsCost: (state) =>
    Object.values(state.units).reduce((pointsCost, unit) => pointsCost + +unit.pointsCost, 0),
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
  usedUnits: (state) => Object.keys(state.units)
    .filter((unitID) => state.units[unitID].number > 0)
    .reduce((usedUnits, unitID) => {
      usedUnits[unitID] = state.units[unitID];

      usedUnits[unitID].upgrades = Object.keys(usedUnits[unitID].upgrades)
        .filter((upgradeID) => usedUnits[unitID].upgrades[upgradeID].number > 0)
        .reduce((usedUpgrades, upgradeID) => {
          usedUpgrades[upgradeID] = usedUnits[unitID].upgrades[upgradeID];

          return usedUpgrades;
        }, {});

      return usedUnits;
    }, {}),
  usedUpgrades: (state) => Object.keys(state.upgrades)
    .filter((upgradeID) => state.upgrades[upgradeID].number > 0)
    .reduce((usedUpgrades, upgradeID) => {
      usedUpgrades[upgradeID] = state.upgrades[upgradeID];

      return usedUpgrades;
    }, {}),
  version: (state) => state.version
};
