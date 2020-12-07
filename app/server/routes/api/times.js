const express = require("express");
const fetch = require("node-fetch");
const db = require("../../database/db");

const router = express.Router();

//get all times
router.get("/", (req, res) => {
  db.getAllFromDB(req, res);
});

//Create new time
router.post("/", (req, res) => {
  console.log(req.body);

  //Send a ping to esp server to update data
  db.addToDB(req, res);
});

//Delete Time
router.delete("/:id", (req, res) => {
  db.deleteFromDB(req, res);
});

module.exports = router;
