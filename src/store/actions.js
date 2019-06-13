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

export default {
  addPrintItem (context, index) {
    context.commit('ADD_PRINT_ITEM', index);
  },
  removePrintItem (context, index) {
    context.commit('REMOVE_PRINT_ITEM', index);
  },
  setArmy (context, jsonPath) {
    axios
      .get(process.env.BASE_URL + jsonPath)
      .then((response) => {
        var
          printableItems = ['Text List', 'Stats', 'Stats Used'],
          upgradeConstraints = response.data.upgradeConstraints || [];

        context.commit('SET_ARMY_LIST', response.data.name);
        context.commit('SET_ARMY_RULES', response.data.armyRules);

        if (response.data.armyRules) {
          printableItems.push('Army Rules');
        }

        context.commit('SET_JSON_PATH', jsonPath);
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

        context.commit('SET_PRINTABLE_ITEMS', printableItems);

        context.dispatch('validate');

        router.push({ name: 'Selector' });
      });
  },
  setLabel (context, label) {
    context.commit('SET_LABEL', label);
  },
  setUnitNumber (context, payload) {
    // don't let the number go negative
    if (payload.number < 0) {
      payload.number = 0;
    }

    context.commit('SET_UNIT_NUMBER', payload);

    // remove all unit upgrades greater than the new unit number
    for (var upgradeID in context.state.units[payload.unitID].upgrades) {
      if (context.state.units[payload.unitID].upgrades[upgradeID].number > payload.number) {
        // ensure setUnitUpgradeNumber doesn't validate, this action will do it
        context.dispatch('setUnitUpgradeNumber', Object.assign({}, payload, { skipValidation: true, upgradeID }));
      }
    }

    context.commit('SET_UNIT_POINTS_COST', payload);

    context.dispatch('validate');
  },
  setUnitUpgradeNumber (context, payload) {
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

    if (!payload.skipValidation) {
      context.commit('SET_UNIT_POINTS_COST', payload);

      context.dispatch('validate');
    }
  },
  validate (context) {
    context.commit('CLEAR_ERRORS');

    function checkValidations (id, item) {
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

    for (var unit in context.state.units) {
      checkValidations(unit, context.state.units[unit]);
    }

    for (var upgrade in context.state.upgrades) {
      checkValidations(upgrade, context.state.upgrades[upgrade]);
    }
  }
};
