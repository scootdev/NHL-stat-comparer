const express = require("express");
const db = require("../db/nhlData.json");
const fs = require("fs");
const router = express.Router();
let database = db;

router.get("/", (req, res) => {
    res.json(db);
})

module.exports = router;
