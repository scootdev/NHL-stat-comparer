const https = require('https');
const fs = require('fs')

var rawData = fs.readFileSync('../assets/nhlData.json');
var nhlData = JSON.parse(rawData);

function getTeams() {
    for (let i = 1; i < 55; i++) {
        https.get('https://statsapi.web.nhl.com/api/v1/teams/' + i, (res) => {

            var data = '';

            res.on('data', (d) => {
                data += d;
            });

            res.on('end', () => {
                if (JSON.parse(data).teams) {
                    teamObject = {
                        name: JSON.parse(data).teams[0].name,
                        id: JSON.parse(data).teams[0].id
                    }
                    if (!checkDup(teamObject.id, "teams")) {
                        nhlData.teams.push(teamObject);
                    }
                }
            });

        }).on('error', (e) => {
        });
    }
}

function getPlayers(startYear, endYear) {
    for (let i = 1; i < 55; i++) {
        for (let s = startYear; s < endYear; s++) {
            var seasonStart = s.toString();
            var seasonEnd = (s + 1).toString();
            var season = seasonStart + seasonEnd;
            https.get("https://statsapi.web.nhl.com/api/v1/teams/" + i + "?expand=team.roster&season=" + season, (res) => {
                var data = '';

                res.on('data', (d) => {
                    data += d;
                });

                res.on('end', () => {
                    if (JSON.parse(data).teams) {
                        if (JSON.parse(data).teams[0].roster) {
                            var roster = JSON.parse(data).teams[0].roster.roster;
                            for (let p = 0; p < roster.length; p++) {
                                var playerName = roster[p].person.fullName;
                                var playerID = roster[p].person.id;
                                var playerObject = {
                                    fullName: playerName,
                                    id: playerID
                                };
                                if (!checkDup(playerID, "players")) {
                                    nhlData.players.push(playerObject);
                                }
                            }
                        }
                    }
                });
                res.on('error', (e) => {
                });
            })
        }

    }
}

function checkDup(playerID, cat) {
    if (nhlData[cat].length) {
        for (let i = 0; i < nhlData[cat].length; i++) {
            if (playerID === nhlData[cat][i].id) {
                return true;
            }

        }
    } else {
        return false;
    }
}


getTeams();

var startYear = 1916
var endYear = 1917

var eachSeason = setInterval(() => {
        getPlayers(startYear, endYear);
        if (endYear < 2020) {
            startYear++
            endYear++
            fs.writeFile("../assets/nhlData.json", JSON.stringify(nhlData), function (err) {

                if (err) {
                    console.log(err);
                }
                console.log(startYear + " complete");
            });
        } else {
            clearInterval(eachSeason);
            fs.writeFile("../assets/nhlData.json", JSON.stringify(nhlData), function (err) {

                if (err) {
                    console.log(err);
                }
                console.log("Complete");
            });
        }
}, 1000);








