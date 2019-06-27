const COUNTABLE_UNITS = ['Artillery', 'Cavalry', 'Chariot', 'Chariots', 'Elephant', 'Infantry', 'Machine', 'Monster'];

export default {
  activeArmyListGroupTab: (state) => state.activeArmyListGroupTab,
  armyList: (state) => state.armyList,
  armyRules: (state) => state.armyRules,
  errors: (state) => state.errors,
  jsonPath: (state) => state.jsonPath,
  label: (state) => state.label,
  magic: (state) => state.magic,
  pointsCost: (state) => Object.values(state.units)
    .reduce((pointsCost, unit) => pointsCost + +unit.pointsCost, 0),
  printItems: (state) => state.printItems,
  printableItems: (state) => state.printableItems,
  size: (state, getters) => Math.max(1, Math.floor(getters.pointsCost / 1000)),
  specialRules: (state) => state.specialRules,
  spells: (state) => state.spells,
  unitCount: (state) => Object.values(state.units)
    .reduce((unitCount, unit) => {
      if (!unit.noCount && COUNTABLE_UNITS.includes(unit.type)) {
        unitCount += unit.number;
      }

      return unitCount;
    }, 0),
  units: (state) => state.units,
  upgradeConstraints: (state) => state.upgradeConstraints,
  upgrades: (state) => state.upgrades,
  usedUnits: (state) => Object.keys(state.units)
    .reduce((usedUnits, unitID) => {
      if (state.units[unitID].number > 0) {
        usedUnits[unitID] = Object.assign({}, state.units[unitID]);

        if (usedUnits[unitID].upgrades) {
          usedUnits[unitID].upgrades = Object.keys(usedUnits[unitID].upgrades)
            .filter((upgradeID) => usedUnits[unitID].upgrades[upgradeID].number > 0)
            .reduce((usedUpgrades, upgradeID) => {
              usedUpgrades[upgradeID] = Object.assign({}, state.upgrades[upgradeID], usedUnits[unitID].upgrades[upgradeID]);

              return usedUpgrades;
            }, {});
        }
      }

      return usedUnits;
    }, {}),
  usedUpgrades: (state) => Object.keys(state.upgrades)
    .reduce((usedUpgrades, upgradeID) => {
      if (state.upgrades[upgradeID].number > 0) {
        usedUpgrades[upgradeID] = Object.assign({}, state.upgrades[upgradeID]);
      }

      return usedUpgrades;
    }, {}),
  version: (state) => state.version
};
