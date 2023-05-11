const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("./passport");
const db = require("./db");
require("dotenv").config();

const router = express.Router();

// signup route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hash,
    ]);
    res.json({ msg: "Signup successful. Now you can log in." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating your account." });
  }
});

// login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const payload = { sub: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        await db.query("UPDATE users SET token=$1 WHERE id=$2", [
          token,
          user.id,
        ]);
        res.json({ id: user.id, username: user.username, token });
      } else {
        res.status(401).json({ error: "Invalid password." });
      }
    } else {
      res.status(401).json({ error: "User not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

// test authentication
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You are authenticated." });
  }
);

module.exports = router;
