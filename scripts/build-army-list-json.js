'use strict';

const
  fs = require('fs'),
  glob = require('glob');

glob('public/json/**/*.json', (error, fileNames) => {
  fs.writeFileSync('src/json/army-lists.json', JSON.stringify(fileNames.reduce((armyLists, fileName) => {
    const armyList = JSON.parse(fs.readFileSync(fileName));

    if (armyLists[armyList.version] == undefined) {
      armyLists[armyList.version] = {};
    }

    if (armyLists[armyList.version][armyList.group] == undefined) {
      armyLists[armyList.version][armyList.group] = {};
    }

    armyLists[armyList.version][armyList.group][armyList.name] = fileName.replace('public/', '');

    return armyLists;
  }, {})));
});