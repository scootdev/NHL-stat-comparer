const https = require('https');
const fs = require('fs')

var rawData = fs.readFileSync('../db/nhlData.json');
var nhlData = JSON.parse(rawData);

let index = 0;

fs.writeFile("../db/nhlData_backup.json", JSON.stringify(nhlData), function (err) {
    if (err) {
        console.log(err);
    }
    console.log("backup made");
});

for (let i = 0; i < nhlData.players.length; i++) {
    const player = nhlData.players[i];
    player.searches = 0;
}

for (let i = 0; i < nhlData.teams.length; i++) {
    const team = nhlData.teams[i];
    team.searches = 0;
}

fs.writeFile("../db/nhlData.json", JSON.stringify(nhlData), function (err) {
    if (err) {
        console.log(err);
    }
    console.log("stat added");
});