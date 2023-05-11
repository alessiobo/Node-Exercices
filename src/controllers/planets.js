const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "yourusername",
  host: "localhost",
  database: "yourdatabase",
  password: "yourpassword",
  port: 5432,
});

// get all planets
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM planets");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// get a single planet by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM planets WHERE id=$1", [
      id,
    ]);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// update a planet by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const { rows } = await pool.query(
      "UPDATE planets SET name=$1, image=$2 WHERE id=$3 RETURNING *",
      [name, image, id]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
