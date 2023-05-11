"use strict";

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");


/**
 * TODO: write me
 */
router.get("/", async function (req, res) {
  const results = await db.query("SELECT code, name FROM companies");
  console.log(results);
  const companies = results.rows;
  debugger
  return res.json({ companies });
});

module.exports = router;