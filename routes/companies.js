"use strict";

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");


/**
 * TODO: write me
 */
router.get("/", function (req, res) {
  const results = db.query("SELECT * FROM companies");
  const companies = results.rows;

  return res.json({ companies });
});

module.exports = router;