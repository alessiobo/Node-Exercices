const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const db = require("./db");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    async (payload, done) => {
      try {
        const { rows } = await db.query("SELECT * FROM users WHERE id=$1", [
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

module.exports = passport;
