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
  const companies = results.rows;

  return res.json({ companies });
});


/**
 * TODO: write me
 */
router.get("/:code", async function (req, res) {
  const code = req.params.code;

  const results = await db.query(
    `SELECT code, name, description
    FROM companies
    WHERE code = '${code}'`);

  const company = results.rows[0];

  // if (!company) throw new NotFoundError(`No matching company: ${code}`);
  return res.json({ company });
});


/**
 * TODO: write me
 */
router.post("/", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const { code, name, description } = req.body;

  const codeSearch = await db.query(
    `SELECT code FROM companies
    WHERE code = $1`, [code]
  );
  console.log("you made it");
  if (codeSearch.rows[0]) {
    throw new BadRequestError("This company already exists");
  }
  // console.log("you made it");
  const results = await db.query(
    `INSERT INTO companies
    VALUES ('${code}', '${name}', '${description}')
    RETURNING code, name, description`
  );

  const company = results.rows[0];
  // console.log(results.rows)

  return res.status(201).json({ company });
});





module.exports = router;