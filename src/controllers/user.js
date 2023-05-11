const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const router = express.Router();

// configure JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id=$1', [jwtPayload.id]);

    if (user.rows.length) {
      return done(null, user.rows[0]);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtStrategy);

// signup user
router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;

  // check if username already exists
  const existingUser = await pool.query('SELECT * FROM users WHERE username=$1', [username]);

  if (existingUser.rows.length) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  // hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // insert new user into DB
  const newUser = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);

  // create JWT token
  const token = jwt.sign({ id: newUser.rows[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  // update user's token in DB
  const updatedUser = await pool.query('UPDATE users SET token=$1 WHERE id=$2 RETURNING id, username, token', [token, newUser.rows[0].id]);

  res.json({ user: updatedUser.rows[0] });
});

// login user
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // check if username exists
  const user = await pool.query('SELECT * FROM users WHERE username=$1', [username]);

  if (!user.rows.length) {
    return res.status(401).json({ message: 'Authentication failed. User not found.' });
  }

  // check if password matches
  bcrypt.compare(password, user.rows[0].password, async (err, result) => {
    if (err) {
      return next(err);
    }

    if (!result) {
      return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

    // create JWT token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // update user's token in DB
    const updatedUser = await pool.query('UPDATE users SET token=$1 WHERE id=$2 RETURNING id, username, token', [token, user.rows[0].id]);

    res.json({ user: updatedUser.rows[0] });
  });
});

// test authentication
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Authorized');
    });
    
    module.exports = router;