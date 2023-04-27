'use strict';

const
  _ = require('lodash'),
  fs = require('fs'),
  glob = require('glob');

function UnitOrUpgradeToJSON () {
  let order = 0;

  return Object.keys(this)
    .sort((a, b) => this[a].order - this[b].order)
    .reduce((UnitsOrUpgrades, key) => {
      UnitsOrUpgrades[key] = {
        order: (typeof this[key].order === 'string' ? this[key].order : order++),
        type: this[key].type,
        attack: this[key].attack,
        range: this[key].range,
        hits: this[key].hits,
        armour: this[key].armour,
        command: this[key].command,
        size: this[key].size,
        points: this[key].points,
        min: this[key].min,
        max: this[key].max,
        armyMin: this[key].armyMin,
        armyMax: this[key].armyMax,
        specialRules: this[key].specialRules,
        addOnUpgrades: this[key].addOnUpgrades,
        augendUnits: this[key].augendUnits,
        homologousUnits: this[key].homologousUnits,
        noCount: this[key].noCount,
        noMagic: this[key].noMagic,
        prohibitedUnits: this[key].prohibitedUnits,
        prohibitedUpgrades: this[key].prohibitedUpgrades,
        requiredUnits: this[key].requiredUnits,
        requiredUpgrades: this[key].requiredUpgrades,
        upgrades: this[key].upgrades
      };

      return UnitsOrUpgrades;
    }, {});
}

function specialRulesToJSON () {
  let order = 1;

  return Object.keys(this)
    .sort((a, b) => this[a].order - this[b].order)
    .reduce((specialRules, key) => {
      specialRules[key] = {
        order: (typeof this[key].order === 'string' ? this[key].order : order++),
        text: this[key].text
      };

      return specialRules;
    }, {});
}

function spellsToJSON () {
  return Object.keys(this).map((i) => ({
    name: this[i].name,
    roll: this[i].roll,
    range: this[i].range,
    text: this[i].text
  }));
}

function fileToJSON () {
  Object.setPrototypeOf(this.units, {
    toJSON: UnitOrUpgradeToJSON
  });

  try {
    Object.setPrototypeOf(this.upgrades, {
      toJSON: UnitOrUpgradeToJSON
    });
  } catch (ignore) {}

  try {
    Object.setPrototypeOf(this.specialRules, {
      toJSON: specialRulesToJSON
    });
  } catch (ignore) {}

  try {
    Object.setPrototypeOf(this.spells, {
      toJSON: spellsToJSON
    });
  } catch (ignore) {}

  return {
    name: this.name,
    version: this.version,
    group: this.group,
    order: this.order,
    units: this.units,
    upgrades: this.upgrades,
    upgradeConstraints: this.upgradeConstraints,
    magic: this.magic,
    armyRules: this.armyRules,
    specialRules: this.specialRules,
    spells: this.spells
  };
}

glob('public/json/**/*.json', (error, filenames) => {
  if (error) {
    console.log(error);

    return;
  }

  filenames.forEach((filename) => {
    let json = JSON.parse(fs.readFileSync(filename));

    Object.setPrototypeOf(json, {
      toJSON: fileToJSON
    });

    fs.writeFileSync(filename, JSON.stringify(json, null, '  '));
  });
});
