const COUNTABLE_UNITS = ['Artillery', 'Cavalry', 'Chariot', 'Elephant', 'Infantry', 'Machine', 'Monster'];

export default {
  activeArmyListAccordion: (state) => state.activeArmyListAccordion,
  armyList: (state) => state.armyList,
  armyRules: (state) => state.armyRules,
  errors: (state) => state.errors,
  json: (state) => state.json,
  jsonPath: (state) => state.jsonPath,
  label: (state) => state.label,
  magic: (state) => state.magic,
  pointsCost: (state) => Object.values(state.units)
    .reduce((pointsCost, unit) => pointsCost + +unit.pointsCost, 0),
  printItems: (state) => state.printItems,
  printableItems: (state) => state.printableItems,
  size: (state, getters) =>  Math.ceil(getters.pointsCost / 1000),
  specialRules: (state) => state.specialRules,
  spells: (state) => state.spells,
  unitCount (state) {
    var
      skirmishCount = 0,
      unarmouredSkirmishCount = 0,
      unitCount = Object.values(state.units)
        .reduce((unitCount, unit) => {
          if (COUNTABLE_UNITS.includes(unit.type)) {
            if (!unit.noCount) {
              unitCount += unit.number;
            }

            if (unit.specialRules && unit.specialRules.includes('Skirmish')) {
              skirmishCount += unit.number;

              if (!unit.armour) {
                unarmouredSkirmishCount += unit.number;
              }
            }
          }

          return unitCount;
        }, 0);

    return skirmishCount > (unitCount - skirmishCount) ? unitCount : unitCount - unarmouredSkirmishCount;
  },
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
