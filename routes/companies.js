"use strict";

const express = require("express");
const { NotFoundError, BadRequestError } = require("../expressError");

const router = new express.Router();
const db = require("../db");


/**
 * Return obj of company: {company: {code, name, description}}
 * If the company given cannot be found, this should return a 404 status response.
 */
router.get("/", async function (req, res) {
  const results = await db.query("SELECT code, name FROM companies");
  const companies = results.rows;

  return res.json({ companies });
});


/**
 * Return obj of company: {company: {code, name, description}}
 * If the company given cannot be found, this should return a 404 status response.
 */
router.get("/:code", async function (req, res) {
  const results = await db.query(
    `SELECT code, name, description
    FROM companies
    WHERE code = $1`,
    [req.params.code]);

  const company = results.rows[0];

  if (!company) throw new NotFoundError(`No matching company: ${code}`);
  return res.json({ company });
});


/**
 * Adds a company.
 * Needs to be given JSON like: {code, name, description}
 * Returns obj of new company: {company: {code, name, description}}
 */
router.post("/", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const { code, name, description } = req.body;

  const results = await db.query(
    `INSERT INTO companies
    VALUES ($1, $2, $3)
    RETURNING code, name, description`,
    [code, name, description]);

  const company = results.rows[0];

  return res.status(201).json({ company });
});


/**
 * Edit existing company.
 * Should return 404 if company cannot be found.
 * Needs to be given JSON like: {name, description}
 * Returns update company object: {company: {code, name, description}}
 */
router.put("/:code", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const { name, description } = req.body;

  const results = await db.query(
    `UPDATE companies
            SET name = $1, description = $2
            WHERE code = $3
            RETURNING code, name, description`,
            [name, description, req.params.code])

  const company = results.rows[0];

  if (!company) throw new NotFoundError()
  return res.json({ company });
})


/**
 * Deletes company.
 * Should return 404 if company cannot be found.
 * Returns {status: "deleted"}
 */
router.delete("/:code", async function (req, res) {
  await db.query(
    "DELETE FROM companies WHERE code = $1",
    [req.params.code],
  );

  if (!company) throw new NotFoundError()
  return res.json({ message: "Deleted" });
})

module.exports = router;