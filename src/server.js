const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: "yourusername",
  host: "localhost",
  database: "yourdatabase",
  password: "yourpassword",
  port: 5432,
});

// configure passport to use JWT strategy
const secretKey = process.env.SECRET_KEY;
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    async (payload, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [
          payload.sub,
        ]);
        if (rows.length > 0) {
          const user = rows[0];
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// middleware to authenticate requests
const auth = passport.authenticate("jwt", { session: false });

app.use(bodyParser.json());

// signup route
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows } = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    res.status(201).json({ msg: "Signup successful. Now you can log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error signing up user." });
  }
});

// login route
app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    if (rows.length === 0) {
      res.status(401).json({ msg: "Invalid username or password." });
      return;
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ msg: "Invalid username or password." });
      return;
    }
    const token = jwt.sign(
      { sub: user.id, username: user.username },
      secretKey
    );
    await pool.query("UPDATE users SET token=$1 WHERE id=$2", [token, user.id]);
    res.status(200).json({ id: user.id, username: user.username, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error logging in user." });
  }
});

// test authentication
app.get("/users/test", auth, (req, res) => {
  res.json({ msg: "You are authenticated." });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
