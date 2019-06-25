import _ from 'lodash';
import axios from 'axios';

import magicItems from '@/json/magic-items.json';
import router from '@/router';

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
    printableItems = ['Text List', 'Stats', 'Stats Used'],
    upgradeConstraints = response.data.upgradeConstraints || [];

  response.data.upgrades = response.data.upgrades || {};

  context.commit('SET_ARMY_LIST', response.data.name);
  context.commit('SET_ARMY_RULES', response.data.armyRules);

  if (response.data.armyRules) {
    printableItems.push('Army Rules');
  }

  context.commit('SET_JSON_PATH', response.config.url.slice(1));
  context.commit('SET_LABEL', '');
  context.commit('SET_MAGIC', response.data.magic);
  context.commit('SET_SPECIAL_RULES', response.data.specialRules);

  if (response.data.specialRules) {
    printableItems.push('Special Rules', 'Special Rules Used');
  }

  context.commit('SET_SPELLS', response.data.spells);

  if (response.data.magic) {
    Object.assign(response.data.upgrades, magicItems.upgrades);

    upgradeConstraints = upgradeConstraints.concat(magicItems.upgradeConstraints);

    printableItems.push('Magic Items', 'Magic Items Used', 'Spells');
  }

  context.commit('SET_UPGRADE_CONSTRAINTS', upgradeConstraints);
  // upgrades are needed by units, so set them first
  context.commit('SET_UPGRADES', response.data.upgrades);
  context.commit('SET_UNITS', response.data.units);
  context.commit('SET_VERSION', response.data.version);

  context.commit('SET_PRINT_ITEMS', []);
  context.commit('SET_PRINTABLE_ITEMS', printableItems);
}

export default {
  addPrintItem (context, index) {
    context.commit('ADD_PRINT_ITEM', index);
  },
  loadSaveURL (context, params) {
    if (params.list) {
      console.log('set params.jsonPath');
    }

    axios
      .get(process.env.BASE_URL + params.jsonPath)
      .then((response) => initializeState(context, response))
      .then(() => {
        var
          unitIDs = Object.keys(context.getters.units),
          upgradeIDs = Object.keys(context.getters.upgrades);

        // backwards compatability for old print param
        if (params.print) {
          params.printItems = (',' + params.print)
            .replace(',sp', ',Spells')
            .replace(',miu', ',Magic Items Used')
            .replace(',mi', ',Magic Items')
            .replace(',sru', ',Special Rules Used')
            .replace(',sr', ',Special Rules')
            .replace(',ar', ',Army Rules')
            .replace(',sl', ',Stats Used')
            .replace(',s', ',Stats')
            .replace(',l', ',Text List')
            .replace(/^,/, '');
        }

        params.printItems = params.printItems.split(',');

        context.dispatch('setLabel', params.label);
        context.commit('SET_PRINTABLE_ITEMS', _.difference(context.getters.printableItems, params.printItems));
        context.dispatch('setPrintItems', params.printItems);

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
