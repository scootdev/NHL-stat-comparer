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


function playerInfo(playerID, index) {
    https.get("https://statsapi.web.nhl.com/api/v1/people/" + playerID, (res) => {
        var data = '';

        res.on('data', (d) => {
            data += d;
        });

        res.on('end', () => {
            nhlData.players[index].birthDate = JSON.parse(data).people[0].birthDate;
            nhlData.players[index].birthCity = JSON.parse(data).people[0].birthCity;
            nhlData.players[index].birthState = JSON.parse(data).people[0].birthStateProvince;
            nhlData.players[index].birthCountry = JSON.parse(data).people[0].birthCountry;
            nhlData.players[index].nationality = JSON.parse(data).people[0].nationality;
            nhlData.players[index].height = JSON.parse(data).people[0].height;
            nhlData.players[index].weight = JSON.parse(data).people[0].weight;
            nhlData.players[index].shoots = JSON.parse(data).people[0].shootsCatches;
            nhlData.players[index].position = JSON.parse(data).people[0].primaryPosition;
            nhlData.players[index].number = JSON.parse(data).people[0].primaryNumber;
            fs.writeFile("../db/nhlData.json", JSON.stringify(nhlData), function (err) {
                if (err) {
                    console.log(err);
                }
                console.log(playerID + " completed");
            });
        });
        res.on('error', (e) => {
        });
    })
}

function seasonStats(playerID, index) {
    https.get("https://statsapi.web.nhl.com/api/v1/people/" + playerID + "/stats?stats=yearByYear", (res) => {
        var data = '';

        res.on('data', (d) => {
            data += d;
        });

        res.on('end', () => {
            nhlData.players[index].stats = {}
            nhlData.players[index].stats.assists = {};
            nhlData.players[index].stats.goals = {};
            nhlData.players[index].stats.pim = {};
            nhlData.players[index].stats.shots = {};
            nhlData.players[index].stats.games = {};
            nhlData.players[index].stats.powerPlayGoals = {};
            nhlData.players[index].stats.powerPlayPoints = {};
            nhlData.players[index].stats.penaltyMinutes = {};
            nhlData.players[index].stats.shotPct = {};
            nhlData.players[index].stats.gameWinningGoals = {};
            nhlData.players[index].stats.overTimeGoals = {};
            nhlData.players[index].stats.shortHandedGoals = {};
            nhlData.players[index].stats.shortHandedPoints = {};
            nhlData.players[index].stats.plusMinus = {};
            nhlData.players[index].stats.points = {};
            for (let x = 0; x < JSON.parse(data).stats[0].splits.length; x++) {
                if (JSON.parse(data).stats[0].splits[x].league.name === "National Hockey League") {
                    if (JSON.parse(data).stats[0].splits[x].stat.goals >= 0) {
                        let currentSeason = JSON.parse(data).stats[0].splits[x].season;
                        let player = nhlData.players[index];
                        let assists = JSON.parse(data).stats[0].splits[x].stat.assists;
                        nhlData.players[index].stats.assists[currentSeason] = assists;
                        let goals = JSON.parse(data).stats[0].splits[x].stat.goals;
                        nhlData.players[index].stats.goals[currentSeason] = goals;
                        let pim = JSON.parse(data).stats[0].splits[x].stat.pim;
                        nhlData.players[index].stats.pim[currentSeason] = pim;
                        let shots = JSON.parse(data).stats[0].splits[x].stat.shots;
                        nhlData.players[index].stats.shots[currentSeason] = shots;
                        let games = JSON.parse(data).stats[0].splits[x].stat.games;
                        nhlData.players[index].stats.games[currentSeason] = games;
                        let powerPlayGoals = JSON.parse(data).stats[0].splits[x].stat.powerPlayGoals;
                        nhlData.players[index].stats.powerPlayGoals[currentSeason] = powerPlayGoals;
                        let powerPlayPoints = JSON.parse(data).stats[0].splits[x].stat.powerPlayPoints;
                        nhlData.players[index].stats.powerPlayPoints[currentSeason] = powerPlayPoints;
                        let penaltyMinutes = JSON.parse(data).stats[0].splits[x].stat.penaltyMinutes;
                        nhlData.players[index].stats.penaltyMinutes[currentSeason] = penaltyMinutes;
                        let shotPct = JSON.parse(data).stats[0].splits[x].stat.shotPct;
                        nhlData.players[index].stats.shotPct[currentSeason] = shotPct;
                        let gameWinningGoals = JSON.parse(data).stats[0].splits[x].stat.gameWinningGoals;
                        nhlData.players[index].stats.gameWinningGoals[currentSeason] = gameWinningGoals;
                        let overTimeGoals = JSON.parse(data).stats[0].splits[x].stat.overTimeGoals;
                        nhlData.players[index].stats.overTimeGoals[currentSeason] = overTimeGoals;
                        let shortHandedGoals = JSON.parse(data).stats[0].splits[x].stat.shortHandedGoals;
                        nhlData.players[index].stats.shortHandedGoals[currentSeason] = shortHandedGoals;
                        let shortHandedPoints = JSON.parse(data).stats[0].splits[x].stat.shortHandedPoints;
                        nhlData.players[index].stats.shortHandedPoints[currentSeason] = shortHandedPoints;
                        let plusMinus = JSON.parse(data).stats[0].splits[x].stat.plusMinus;
                        nhlData.players[index].stats.plusMinus[currentSeason] = plusMinus;
                        let points = JSON.parse(data).stats[0].splits[x].stat.points;
                        nhlData.players[index].stats.points[currentSeason] = points;
                    }
                };
            };
            fs.writeFile("../db/nhlData.json", JSON.stringify(nhlData), function (err) {
                if (err) {
                    console.log(err);
                }
                console.log(playerID + " completed");
            });
        });
        res.on('error', (e) => {
        });
    })
}

function careerStats(playerID, index) {
    https.get("https://statsapi.web.nhl.com/api/v1/people/" + playerID + "/stats?stats=careerRegularSeason", (res) => {
        var data = '';

        res.on('data', (d) => {
            data += d;
        });

        res.on('end', () => {
            for (let x = 0; x < JSON.parse(data).stats[0].splits.length; x++) {
            if (JSON.parse(data).stats[0].splits[x].stat.goals >= 0) {
                let currentSeason = JSON.parse(data).stats[0].splits[x].season;
                let player = nhlData.players[index];
                let assists = JSON.parse(data).stats[0].splits[x].stat.assists;
                let goals = JSON.parse(data).stats[0].splits[x].stat.goals;
                let pim = JSON.parse(data).stats[0].splits[x].stat.pim;
                let shots = JSON.parse(data).stats[0].splits[x].stat.shots;
                let games = JSON.parse(data).stats[0].splits[x].stat.games;
                let powerPlayGoals = JSON.parse(data).stats[0].splits[x].stat.powerPlayGoals;
                let powerPlayPoints = JSON.parse(data).stats[0].splits[x].stat.powerPlayPoints;
                let shotPct = JSON.parse(data).stats[0].splits[x].stat.shotPct;
                let gameWinningGoals = JSON.parse(data).stats[0].splits[x].stat.gameWinningGoals;
                let overTimeGoals = JSON.parse(data).stats[0].splits[x].stat.overTimeGoals;
                let shortHandedGoals = JSON.parse(data).stats[0].splits[x].stat.shortHandedGoals;
                let shortHandedPoints = JSON.parse(data).stats[0].splits[x].stat.shortHandedPoints;
                let plusMinus = JSON.parse(data).stats[0].splits[x].stat.plusMinus;
                let points = JSON.parse(data).stats[0].splits[x].stat.points;
                nhlData.players[index].stats.assists.career = assists;
                nhlData.players[index].stats.goals.career = goals;
                nhlData.players[index].stats.pim.career = pim;
                nhlData.players[index].stats.shots.career = shots;
                nhlData.players[index].stats.games.career = games;
                nhlData.players[index].stats.powerPlayGoals.career = powerPlayGoals;
                nhlData.players[index].stats.powerPlayPoints.career = powerPlayPoints;
                nhlData.players[index].stats.shotPct.career = shotPct;
                nhlData.players[index].stats.gameWinningGoals.career = gameWinningGoals;
                nhlData.players[index].stats.overTimeGoals.career = overTimeGoals;
                nhlData.players[index].stats.shortHandedGoals.career = shortHandedGoals;
                nhlData.players[index].stats.shortHandedPoints.career = shortHandedPoints;
                nhlData.players[index].stats.plusMinus.career = plusMinus;
                nhlData.players[index].stats.points.career = points;
            }
            fs.writeFile("../db/nhlData.json", JSON.stringify(nhlData), function (err) {
                if (err) {
                    console.log(err);
                }
                console.log(playerID + " completed");
            });
        }});
        res.on('error', (e) => {
        });
    })
}

// var getInfo = setInterval(() => {
//     if (index < (nhlData.players.length)) {
//         playerInfo(nhlData.players[index].id, index);
//         index++;
//     } else {
//         clearInterval(getInfo);
//         fs.writeFile("../db/nhlData.json", JSON.stringify(nhlData), function (err) {

//             if (err) {
//                 console.log(err);
//             }
//         });
//     }

// }, 50);

var getStats = setInterval(() => {
    if (index < (nhlData.players.length)) {
        // seasonStats(nhlData.players[index].id, index);
        careerStats(nhlData.players[index].id, index);
        index++;
    } else {
        clearInterval(getStats);
        fs.writeFile("../db/nhlData.json", JSON.stringify(nhlData), function (err) {

            if (err) {
                console.log(err);
            }
        });
    }

}, 50);


