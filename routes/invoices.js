"use strict";

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");


/**
Return info on invoices: like {invoices: [{id, comp_code}, ...]}
 */
router.get("/", async function (req, res) {
  const results = await db.query("SELECT id, comp_code FROM invoices");
  const invoices = results.rows;

  return res.json({ invoices });
});

/**
 * /Returns obj on given invoice.
 * If invoice cannot be found, returns 404.
 * Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}
*/

router.get("/:id", async function (req, res) {
  const iResults = await db.query(
    "SELECT amt, paid, add_date, paid_date, comp_code FROM invoices WHERE id=$1",
    [req.params.id]
  );
  const invoice = iResults.rows[0];

  const cResults = await db.query(
    "SELECT code, name, description FROM companies WHERE code=$1",
    [invoice.comp_code]
  );
  const company = cResults.rows[0];
  invoice["company"] = company;

  return res.json({ invoice });
});

/**
 *Adds an invoice.
  Needs to be passed in JSON body of: {comp_code, amt}
  Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 */

router.post("/", async function (req, res) {
  const { comp_code, amt } = req.body;
  // console.log("c_c, amt", comp_code, amt);
  const results = await db.query(
    `INSERT INTO invoices VALUES (${comp_code}, ${amt}) RETURNING id, comp_code, amt, paid, add_date, paid_date`);
  const invoice = results.rows[0];

  return res.json({ invoice });
});

module.exports = router;