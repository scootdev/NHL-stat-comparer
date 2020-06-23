const express = require("express");
const db = require("../db/nhlData.json");
const fs = require("fs");
const router = express.Router();
let database = db;

router.get("/", (req, res) => {
    res.json(db);
})

router.post("/players", (req, res) => {
    db.players[req.body.index].searches++;
    res.json(`Updated searches for ${db.players[req.body.index].fullName}`);
    fs.writeFile("./db/nhlData.json", JSON.stringify(db), (err) => {
        if (err) {
            return console.log(err);
        }
    })
})

module.exports = router;
