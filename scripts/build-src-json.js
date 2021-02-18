'use strict';

const
  fs = require('fs'),
  glob = require('glob'),
  path = require('path');

function groupOrder(group) {
  switch (group) {
    case 'Tournament Armies':
      return 0;
    case 'Experimental Armies':
      return 1;
    case 'Fan Armies':
      return 2;
    case 'Chariot Era':
      return 0;
    case 'Ancient Greece and the East':
      return 1;
    case 'The Rise of Rome':
      return 2;
    case 'The Dark Ages':
      return 3;
    case 'The Far East':
      return 4;
    default:
      return +group;
  }
}

// generate army-lists.json
glob('public/json/**/*.json', (error, fileNames) => {
  fs.writeFileSync('src/json/army-lists.json', (function () {
    var json = fileNames.reduce((armyLists, fileName) => {
      const armyList = JSON.parse(fs.readFileSync(fileName));

      if (armyLists[armyList.version] == undefined) {
        armyLists[armyList.version] = [];
      }

      if (armyLists[armyList.version][groupOrder(armyList.group)] == undefined) {
        armyLists[armyList.version][groupOrder(armyList.group)] = {
          name: armyList.group,
          lists: []
        };
      }

      armyLists[armyList.version][groupOrder(armyList.group)].lists[armyList.order] = {
        name: armyList.name,
        path: fileName.replace(/(^public\/json\/|\.json$)/g, '')
      };

      return armyLists;
    }, {});

    Object.keys(json).forEach((version) => json[version] = json[version].filter((group) => group !== null));

    return JSON.stringify(json, null, 2);
  }()));
});

// generate magic-items.json
glob('src/json/magic-items/*.json', (error, fileNames) => {
  fs.writeFileSync('src/json/magic-items.json', (function () {
    var json = fileNames.reduce((magicItems, fileName) => {
      magicItems[path.basename(fileName, '.json')] = JSON.parse(fs.readFileSync(fileName));

      return magicItems;
    }, {});

    return JSON.stringify(json, null, 2);
  }()));
});

// generate special-rules.json
glob('src/json/special-rules/*.json', (error, fileNames) => {
  fs.writeFileSync('src/json/special-rules.json', (function () {
    var json = fileNames.reduce((specialRules, fileName) => {
      specialRules[path.basename(fileName, '.json')] = JSON.parse(fs.readFileSync(fileName));

      return specialRules;
    }, {});

    return JSON.stringify(json, null, 2);
  }()));
});
