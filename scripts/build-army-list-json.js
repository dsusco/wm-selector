'use strict';

const
  fs = require('fs'),
  glob = require('glob');

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
