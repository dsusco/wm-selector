import _ from 'lodash';
import axios from 'axios';

import magicItems from '@/json/magic-items.json';
import router from '@/router';

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

        context.dispatch('setLabel', params.label);

        // backwards compatability for old print param
        if (params.hasOwnProperty('print')) {
          params.printItems = params.print;
        }

        params.printItems = params.printItems.split(',').map((printItem) => {
          context.dispatch('addPrintItem', _.findIndex(
              context.getters.printableItems,
              (printableItem) => printableItem.abbr === printItem
            ));
        });

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
  setActiveArmyListGroupTab (context, activeArmyListGroupTab) {
    context.commit('SET_ACTIVE_ARMY_LIST_GROUP_TAB', activeArmyListGroupTab);
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
    for (var upgradeID in context.state.units[payload.unitID].upgrades) {
      if (context.state.units[payload.unitID].upgrades[upgradeID].number > payload.number) {
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
    if (payload.number > context.state.units[payload.unitID].number) {
      payload.number = context.state.units[payload.unitID].number;
    }

    // set the upgrade's number first, as we need to calculate the difference of the change
    context.commit('SET_UPGRADE_NUMBER', {
      upgradeID: payload.upgradeID,
      number: context.state.upgrades[payload.upgradeID].number - context.state.units[payload.unitID].upgrades[payload.upgradeID].number + payload.number
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

    for (var unit in context.state.units) {
      checkValidations(context, unit, context.state.units[unit]);
    }

    for (var upgrade in context.state.upgrades) {
      checkValidations(context, upgrade, context.state.upgrades[upgrade]);
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
  // army min/max
  if (item.number < item.armyMin) {
    context.commit('PUSH_ERROR', 'Minimum of ' + item.armyMin + ' ' + id + ' per army.');
  }
  if (item.number > item.armyMax) {
    context.commit('PUSH_ERROR', 'Maximum of ' + item.armyMax + ' ' + id + ' per army.');
  }

  // min/max
  if (item.number < item.min * context.getters.size) {
    context.commit('PUSH_ERROR', 'Minimum of ' + (item.min * context.getters.size) + ' ' + id + ' per ' + context.getters.size + ',000 points.');
  }
  if (item.number > item.max * context.getters.size) {
    context.commit('PUSH_ERROR', 'Maximum of ' + (item.max * context.getters.size) + ' ' + id + ' per ' + context.getters.size + ',000 points.');
  }

  // Skirmishers, et al.
  if (item.augendUnits &&
      item.number > item.augendUnits.reduce((count, unitID) => count + context.state.units[unitID].number, 0)
  ) {
    context.commit('PUSH_ERROR', 'Minimum of ' + item.number + ' ' + item.augendUnits.toSentence() + ' required for ' + item.number + ' ' + id + '.');
  }

  // Warmaster Trial Armies Compendium 2009
  if (item.elite && item.number > context.getters.size - 1) {
    context.commit('PUSH_ERROR', 'Maximum of ' + (context.getters.size - 1) + ' ' + id + ' per ' + context.getters.size + ',000 points.');
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
      return 'warmaster-revolution/bretonnian';
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
      return 'warmaster-revolution/chaos-dwarf';
    case 'chaosrev':
      return 'warmaster-revolution/chaos';
    case 'dacian':
      return 'warmaster-ancients/dacian';
    case 'daemon':
      return 'warmaster-armies/daemon';
    case 'daemonrev':
      return 'warmaster-revolution/daemon';
    case 'daemontournament':
      return 'warmaster-trial-armies-compendium-2009/daemon-tournament';
    case 'darkelf':
      return 'warmaster-armies/dark-elf';
    case 'darkelfrev':
      return 'warmaster-revolution/dark-elf';
    case 'dogsofwar':
      return 'warmaster-trial-armies-compendium-2009/dogs-of-war';
    case 'dogsofwarrev':
      return 'warmaster-revolution/dogs-of-war';
    case 'dwarf':
      return 'warmaster-armies/dwarf';
    case 'dwarfengineeringguild':
      return 'warmaster-trial-armies-compendium-2009/dwarf-engineering-guild';
    case 'dwarfrev':
      return 'warmaster-revolution/dwarf';
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
      return 'warmaster-trial-armies-compendium-2009/grimgor-s-ardboyz';
    case 'highelf':
      return 'warmaster-armies/high-elf';
    case 'highelfrev':
      return 'warmaster-revolution/high-elf';
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
      return 'warmaster-revolution/orc';
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
      return 'warmaster-trial-armies-compendium-2009/slayer-king-s';
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
      return 'warmaster-trial-armies-compendium-2009/witch-hunters';
    case 'witchhuntersrev':
      return 'warmaster-revolution/witch-hunters';
    case 'woodelf':
      return 'warmaster-trial-armies-compendium-2009/wood-elf';
    case 'woodelfrev':
      return 'warmaster-revolution/wood-elf';
  }
}