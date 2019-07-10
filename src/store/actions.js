import _ from 'lodash';
import axios from 'axios';

import magicItems from '@/json/magic-items.json';
import router from '@/router';

const MAGIC_ITEM_TYPES = ['Device of Power', 'Magic Standard', 'Magic Weapon', 'Holy Item', 'Other Item'];

export default {
  addPrintItem (context, index) {
    context.commit('ADD_PRINT_ITEM', index);
  },
  loadSaveURL (context, params) {
    if (params.hasOwnProperty('list')) {
      params.jsonPath = 'json/' + lookupOldList(params.list) + '.json';
    }

    axios
      .get(process.env.BASE_URL + params.jsonPath)
      .then((response) => initializeState(context, response))
      .then(() => {
        var
          unitIDs = Object.keys(context.getters.units),
          upgradeIDs = Object.keys(context.getters.upgrades);

        context.dispatch('setActiveArmyListAccordion', context.getters.version);

        context.dispatch('setLabel', params.label);

        // backwards compatability for old print param
        if (params.hasOwnProperty('print')) {
          params.printItems = params.print;
        }

        if (params.printItems) {
          params.printItems.split(',').map((printItem) => {
            context.dispatch('addPrintItem', _.findIndex(
                context.getters.printableItems,
                (printableItem) => printableItem.abbr === printItem
              ));
          });
        }

        // sort to ensure units get added before their upgrades
        Object.keys(params).sort()
          .forEach((key) => {
            var
              unitOrder = (key.match(/^(\d+)(?:-\w+)?/) || []).pop(),
              unitID = unitIDs[_.findIndex(
                unitIDs,
                (user) => context.getters.units[user].order == unitOrder
              )],
              upgradeOrder = (key.match(/^\d+-(\w+)?$/) || []).pop();

            if (unitOrder) {
              if (upgradeOrder) {
                context.dispatch('setUnitUpgradeNumber', {
                  unitID: unitID,
                  upgradeID: upgradeIDs[_.findIndex(
                    upgradeIDs,
                    (upgrade) => context.getters.upgrades[upgrade].order == upgradeOrder
                  )],
                  number: params[key],
                  skipValidation: true
                });
              } else {
                context.dispatch('setUnitNumber', {
                  unitID: unitID,
                  number: params[key],
                  skipValidation: true
                });
              }
            }
          });

        context.dispatch('validate');
      })
      .then(() => router.push({ name: 'Selector' }))
      .catch(() => router.push({ name: 'Home' }));
  },
  removePrintItem (context, index) {
    context.commit('REMOVE_PRINT_ITEM', index);
  },
  setActiveArmyListAccordion (context, activeArmyListAccordion) {
    context.commit('SET_ACTIVE_ARMY_LIST_ACCORDION', activeArmyListAccordion);
  },
  setArmy (context, jsonPath) {
    axios
      .get(process.env.BASE_URL + jsonPath)
      .then((response) => initializeState(context, response))
      .then(() => context.dispatch('validate'))
      .then(() => router.push({ name: 'Selector' }))
      .catch(() => router.push({ name: 'Home' }));
  },
  setLabel (context, label) {
    context.commit('SET_LABEL', label);
  },
  setPrintItems (context, printItems) {
    context.commit('SET_PRINT_ITEMS', printItems);
  },
  setUnitNumber (context, payload) {
    payload.number = +payload.number;

    // don't let the number go negative
    if (payload.number < 0) {
      payload.number = 0;
    }

    context.commit('SET_UNIT_NUMBER', payload);

    // remove all unit upgrades greater than the new unit number
    for (var upgradeID in context.getters.units[payload.unitID].upgrades) {
      if (context.getters.units[payload.unitID].upgrades[upgradeID].number > payload.number) {
        // ensure setUnitUpgradeNumber doesn't validate, this action will do it
        context.dispatch('setUnitUpgradeNumber', Object.assign({}, payload, { skipSettingUnitPointsCost: true, skipValidation: true, upgradeID }));
      }
    }

    context.commit('SET_UNIT_POINTS_COST', payload);

    if (!payload.skipValidation) {
      context.dispatch('validate');
    }
  },
  setUnitUpgradeNumber (context, payload) {
    payload.number = +payload.number;

    // don't let the number go negative
    if (payload.number < 0) {
      payload.number = 0;
    }

    // don't let the number exceed the unit number
    if (payload.number > context.getters.units[payload.unitID].number) {
      payload.number = context.getters.units[payload.unitID].number;
    }

    if (context.getters.upgrades[payload.upgradeID].addOnUpgrades) {
      if (payload.number <= 0) {
        context.getters.upgrades[payload.upgradeID].addOnUpgrades.forEach((upgradeID) => {
          context.commit('REMOVE_UNIT_UPGRADE', {
            unitID: payload.unitID,
            upgradeID: upgradeID
          });
        });
      } else if (context.getters.upgrades[payload.upgradeID].number === 0) {
        context.getters.upgrades[payload.upgradeID].addOnUpgrades.forEach((upgradeID) => {
          context.commit('ADD_UNIT_UPGRADE', {
            unitID: payload.unitID,
            upgradeID: upgradeID
          });
        });
      }
    }

    // set the upgrade's number first, as we need to calculate the difference of the change
    context.commit('SET_UPGRADE_NUMBER', {
      upgradeID: payload.upgradeID,
      number: context.getters.upgrades[payload.upgradeID].number - context.getters.units[payload.unitID].upgrades[payload.upgradeID].number + payload.number
    });
    context.commit('SET_UNIT_UPGRADE_NUMBER_AND_POINTS_COST', payload);

    if (!payload.skipSettingUnitPointsCost) {
      context.commit('SET_UNIT_POINTS_COST', payload);
    }

    if (!payload.skipValidation) {
      context.dispatch('validate');
    }
  },
  validate (context) {
    context.commit('CLEAR_ERRORS');

    for (var unit in context.getters.units) {
      checkValidations(context, unit, context.getters.units[unit]);
    }

    for (var upgrade in context.getters.upgrades) {
      checkValidations(context, upgrade, context.getters.upgrades[upgrade]);
    }
  }
};

Array.prototype.toSentence = function (connector = ', ', lastConnector = ' or ') {
  if (this.length > 1) {
    return this.slice(0, this.length - 1).join(connector) + lastConnector + this.slice(-1);
  } else {
    return this[0];
  }
};

function checkValidations (context, id, item) {
  var requiredCount, requiredSentence;

  // army min
  if (item.number < item.armyMin) {
    context.commit('PUSH_ERROR', 'Minimum of ' + item.armyMin + ' ' + id + ' per army.');
  }

  // army max
  if (item.number > item.armyMax) {
    context.commit('PUSH_ERROR', 'Maximum of ' + item.armyMax + ' ' + id + ' per army.');
  }

  // min
  if (/^As /.test(item.min)) {
    if (item.requiredUnits) {
      requiredCount = item.requiredUnits.reduce((count, unitID) => count + context.getters.units[unitID].number, 0);
      requiredSentence = item.requiredUnits.toSentence();
    } else {
      requiredCount = item.requiredUpgrades.reduce((count, upgradeID) => count + context.getters.upgrades[upgradeID].number, 0);
      requiredSentence = item.requiredUpgrades.toSentence();
    }

    if (item.number < requiredCount) {
      context.commit('PUSH_ERROR', 'Minimum of ' + requiredCount + ' ' + id + ' per ' + requiredCount + ' ' + requiredSentence + '.');
    }
  } else if (context.getters.pointsCost >= 1000 &&
      item.number < item.min * context.getters.size) {
    context.commit('PUSH_ERROR', 'Minimum of ' + (item.min * context.getters.size) + ' ' + id + ' per ' + context.getters.size + ',000 points.');
  }

  // max
  if (item.max === 'elite' &&
      item.number > context.getters.size - 1) {
    context.commit('PUSH_ERROR', 'Maximum of ' + (context.getters.size - 1) + ' ' + id + ' per ' + context.getters.size + ',000 points.');
  } else if (item.max === 'Up to Half') {
    if (item.requiredUnits) {
      requiredCount = item.requiredUnits.reduce((count, unitID) => count + context.getters.units[unitID].number, 0);
      requiredSentence = item.requiredUnits.toSentence();
    } else {
      requiredCount = item.requiredUpgrades.reduce((count, upgradeID) => count + context.getters.upgrades[upgradeID].number, 0);
      requiredSentence = item.requiredUpgrades.toSentence();
    }

    if (item.number > 0 &&
        item.number > Math.floor(requiredCount / 2)) {
      context.commit('PUSH_ERROR', 'Maximum of ' + Math.floor(requiredCount / 2) + ' ' + id + ' per ' + requiredCount + ' ' + requiredSentence + '.');
    }
  } else if (item.number > item.max * context.getters.size) {
    context.commit('PUSH_ERROR', 'Maximum of ' + (item.max * context.getters.size) + ' ' + id + ' per ' + context.getters.size + ',000 points.');
  }

  // magic items can't exceed number
  if (item.upgrades &&
      item.number < Object.keys(item.upgrades).reduce((count, upgradeID) => {
        if (MAGIC_ITEM_TYPES.includes(context.getters.upgrades[upgradeID].type)) {
          count += item.upgrades[upgradeID].number;
        }

        return count;
      }, 0)) {
    context.commit('PUSH_ERROR', item.number + ' ' + id + ' may only have ' + item.number + ' magic item' + (item.number > 1 ? 's.' : '.'));
  }

  // mounts can't exceed number
  if (item.upgrades &&
      item.number < Object.keys(item.upgrades).reduce((count, upgradeID) => {
        if (/Mount$/.test(context.getters.upgrades[upgradeID].type)) {
          count += item.upgrades[upgradeID].number;
        }

        return count;
      }, 0)) {
    context.commit('PUSH_ERROR', item.number + ' ' + id + ' may only have ' + item.number + ' mount' + (item.number > 1 ? 's.' : '.'));
  }

  // units added to other units/upgrades
  if (item.augendUnits &&
      item.number > item.augendUnits.reduce((count, unitID) => count + context.getters.units[unitID].number, 0)
  ) {
    context.commit('PUSH_ERROR', item.number + ' ' + id + ' requires at least ' + item.number + ' ' + item.augendUnits.toSentence() + '.');
  }

  // units required by a unit/upgrade
  if (item.requiredUnits &&
      item.number > 0 &&
      1 > item.requiredUnits.reduce((count, unitID) => count + context.getters.units[unitID].number, 0)) {
    context.commit('PUSH_ERROR', id + ' must be taken with ' + item.requiredUnits.toSentence() + '.');
  }

  // upgrades required by a unit/upgrade
  if (item.requiredUpgrades &&
      item.number > 0 &&
      1 > item.requiredUpgrades.reduce((count, upgradeID) => count + context.getters.upgrades[upgradeID].number, 0)) {
    context.commit('PUSH_ERROR', id + ' must be taken with ' + item.requiredUpgrades.toSentence() + '.');
  }

  // units prohibited by a unit/upgrade
  if (item.prohibitedUnits &&
      item.number > 0 &&
      0 < item.prohibitedUnits.reduce((count, unitID) => count + context.getters.units[unitID].number, 0)) {
    context.commit('PUSH_ERROR', id + ' cannot be taken with ' + item.prohibitedUnits.toSentence() + '.');
  }

  // upgrades prohibited by a unit/upgrade
  if (item.prohibitedUpgrades &&
      item.number > 0 &&
      0 < item.prohibitedUpgrades.reduce((count, upgradeID) => count + context.getters.upgrades[upgradeID].number, 0)) {
    context.commit('PUSH_ERROR', id + ' cannot be taken with ' + item.prohibitedUpgrades.toSentence() + '.');
  }
}

function initializeState (context, response) {
  var
    printableItems = [
      { abbr: 'l', title: 'Text List' },
      { abbr: 's', title: 'Stats' },
      { abbr: 'sl', title: 'Stats Used' }
    ],
    upgradeConstraints = response.data.upgradeConstraints || [];

  response.data.upgrades = response.data.upgrades || {};

  context.commit('SET_ARMY_LIST', response.data.name);
  context.commit('SET_ARMY_RULES', response.data.armyRules);

  if (response.data.armyRules) {
    printableItems.push({ abbr: 'ar', title: 'Army Rules' });
  }

  context.commit('SET_JSON_PATH', response.config.url.slice(1));
  context.commit('SET_LABEL', '');
  context.commit('SET_MAGIC', response.data.magic);
  context.commit('SET_SPECIAL_RULES', response.data.specialRules);

  if (response.data.specialRules) {
    printableItems.push({ abbr: 'sr', title: 'Special Rules' });
    printableItems.push({ abbr: 'sru', title: 'Special Rules Used' });
  }

  context.commit('SET_SPELLS', response.data.spells);

  if (response.data.magic) {
    Object.assign(response.data.upgrades, magicItems.upgrades);

    upgradeConstraints = upgradeConstraints.concat(magicItems.upgradeConstraints);

    printableItems.push({ abbr: 'mi', title: 'Magic Items' });
    printableItems.push({ abbr: 'miu', title: 'Magic Items Used' });
    printableItems.push({ abbr: 'sp', title: 'Spells' });
  }

  context.commit('SET_UPGRADE_CONSTRAINTS', upgradeConstraints);
  // upgrades are needed by units, so set them first
  context.commit('SET_UPGRADES', response.data.upgrades);
  context.commit('SET_UNITS', response.data.units);
  context.commit('SET_VERSION', response.data.version);

  printableItems.push({ abbr: 'qr', title: 'QR Code' });

  context.commit('SET_PRINT_ITEMS', []);
  context.commit('SET_PRINTABLE_ITEMS', printableItems);
}

function lookupOldList (oldList) {
  switch (oldList) {
    case 'achaemenidpersian':
      return 'warmaster-ancients/achaemenid-persian';
    case 'albion':
      return 'warmaster-trial-armies-compendium-2009/albion';
    case 'albionrev':
      return 'warmaster-revolution/albion';
    case 'alexandriangreek':
      return 'warmaster-ancients/alexandrian-greek';
    case 'anglosaxon':
      return 'warmaster-ancients/anglo-saxon';
    case 'araby':
      return 'warmaster-armies/araby';
    case 'arabycitystates':
      return 'warmaster-trial-armies-compendium-2009/araby-city-state';
    case 'arabyrev':
      return 'warmaster-revolution/araby';
    case 'arabytribal':
      return 'warmaster-trial-armies-compendium-2009/araby-tribal';
    case 'assyrian':
      return 'warmaster-ancients/assyrian';
    case 'beastmen':
      return 'warmaster-trial-armies-compendium-2009/beastmen';
    case 'beastmenrev':
      return 'warmaster-revolution/beastmen';
    case 'bretonnian':
      return 'warmaster-armies/bretonnian';
    case 'bretonnianrev':
      return 'warmaster-revolution/bretonnia';
    case 'bretonniantournament':
      return 'warmaster-trial-armies-compendium-2009/bretonnian-tournament';
    case 'britons':
      return 'warmaster-ancients/britons';
    case 'carthaginian':
      return 'warmaster-ancients/carthaginian';
    case 'cathay':
      return 'warmaster-trial-armies-compendium-2009/cathay';
    case 'chaos':
      return 'warmaster-armies/chaos';
    case 'chaosdwarf':
      return 'warmaster-trial-armies-compendium-2009/chaos-dwarf';
    case 'chaosdwarfrev':
      return 'warmaster-revolution/chaos-dwarfs';
    case 'chaosrev':
      return 'warmaster-revolution/chaos';
    case 'dacian':
      return 'warmaster-ancients/dacian';
    case 'daemon':
      return 'warmaster-armies/daemon';
    case 'daemonrev':
      return 'warmaster-revolution/daemons';
    case 'daemontournament':
      return 'warmaster-trial-armies-compendium-2009/daemon-tournament';
    case 'darkelf':
      return 'warmaster-armies/dark-elf';
    case 'darkelfrev':
      return 'warmaster-revolution/dark-elves';
    case 'dogsofwar':
      return 'warmaster-trial-armies-compendium-2009/dogs-of-war';
    case 'dogsofwarrev':
      return 'warmaster-revolution/dogs-of-war';
    case 'dwarf':
      return 'warmaster-armies/dwarf';
    case 'dwarfengineeringguild':
      return 'warmaster-trial-armies-compendium-2009/dwarf-engineering-guild';
    case 'dwarfrev':
      return 'warmaster-revolution/dwarfs';
    case 'dwarfyoungerholds':
      return 'warmaster-trial-armies-compendium-2009/dwarf-younger-holds';
    case 'earlybyzantine':
      return 'warmaster-ancients/early-byzantine';
    case 'earlyegypt':
      return 'warmaster-ancient-armies/early-egypt-old-middle-kingdoms';
    case 'egyptian':
      return 'warmaster-ancients/egyptian';
    case 'empire':
      return 'warmaster-armies/empire';
    case 'empirerev':
      return 'warmaster-revolution/empire';
    case 'gallic':
      return 'warmaster-ancients/gallic';
    case 'german':
      return 'warmaster-ancients/german';
    case 'goblin':
      return 'warmaster-trial-armies-compendium-2009/goblin';
    case 'goblinrev':
      return 'warmaster-revolution/goblin';
    case 'greek':
      return 'warmaster-ancients/greek';
    case 'grimgorsardboyz':
      return 'warmaster-trial-armies-compendium-2009/grimgors-ardboyz';
    case 'highelf':
      return 'warmaster-armies/high-elf';
    case 'highelfrev':
      return 'warmaster-revolution/high-elves';
    case 'highelftournament':
      return 'warmaster-trial-armies-compendium-2009/high-elf-tournament';
    case 'hittite':
      return 'warmaster-ancients/hittite';
    case 'homericgreektrojan':
      return 'warmaster-ancients/homeric-greek-trojan';
    case 'hun':
      return 'warmaster-ancients/hun';
    case 'imperialroman':
      return 'warmaster-ancients/imperial-roman';
    case 'indian':
      return 'warmaster-ancients/indian';
    case 'kislev':
      return 'warmaster-armies/kislev';
    case 'kislevexperimental':
      return 'warmaster-trial-armies-compendium-2009/kislev-experimental';
    case 'kislevrev':
      return 'warmaster-revolution/kislev';
    case 'lateachaemenidpersians':
      return 'warmaster-ancients/late-achaemenid-persians';
    case 'lateroman':
      return 'warmaster-ancients/late-roman';
    case 'lizardmen':
      return 'warmaster-armies/lizardmen';
    case 'lizardmenrev':
      return 'warmaster-revolution/lizardmen';
    case 'nippon':
      return 'warmaster-trial-armies-compendium-2009/nippon';
    case 'nomadicorc':
      return 'warmaster-trial-armies-compendium-2009/nomadic-orc';
    case 'norman':
      return 'warmaster-ancients/norman';
    case 'norse':
      return 'warmaster-trial-armies-compendium-2009/norse';
    case 'norserev':
      return 'warmaster-revolution/norse';
    case 'norsewma':
      return 'warmaster-ancients/norse';
    case 'ogrekingdoms':
      return 'warmaster-trial-armies-compendium-2009/ogre-kingdoms';
    case 'ogrekingdomsrev':
      return 'warmaster-revolution/ogre-kingdoms';
    case 'orc':
      return 'warmaster-armies/orc';
    case 'orcrev':
      return 'warmaster-revolution/orcs';
    case 'parthian':
      return 'warmaster-ancients/parthian';
    case 'peloponnesian':
      return 'warmaster-ancient-armies/peloponnesian';
    case 'republicanroman':
      return 'warmaster-ancients/republican-roman';
    case 'sassanidpersian':
      return 'warmaster-ancients/sassanid-persian';
    case 'skaven':
      return 'warmaster-armies/skaven';
    case 'skavenrev':
      return 'warmaster-revolution/skaven';
    case 'slayerkings':
      return 'warmaster-trial-armies-compendium-2009/slayer-kings';
    case 'spartan':
      return 'warmaster-ancient-armies/spartan';
    case 'successors':
      return 'warmaster-ancients/the-successors';
    case 'sumerakkad':
      return 'warmaster-ancient-armies/sumer-akkad';
    case 'syracusian':
      return 'warmaster-ancient-armies/syracusian';
    case 'tombkingsrev':
      return 'warmaster-revolution/tomb-kings';
    case 'undead':
      return 'warmaster-armies/undead-tomb-kings';
    case 'vampirecounts':
      return 'warmaster-armies/vampire-counts';
    case 'vampirecountsrev':
      return 'warmaster-revolution/vampire-counts';
    case 'witchhunters':
      return 'warmaster-trial-armies-compendium-2009/witch-hunter';
    case 'witchhuntersrev':
      return 'warmaster-revolution/witch-hunter';
    case 'woodelf':
      return 'warmaster-trial-armies-compendium-2009/wood-elf';
    case 'woodelfrev':
      return 'warmaster-revolution/wood-elves';
  }
}
