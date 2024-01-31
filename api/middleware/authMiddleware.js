const passport = require('passport');
const passportJWT = require('passport-jwt');
const { ExtractJwt } = passportJWT;
const mongoose = require('mongoose');
const User = require('../models/user');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY,
};

passport.use(
  new passportJWT.Strategy(jwtOptions, async (payload, done) => {
    console.log('JWT Payload:', payload);

    try {
      const user = await User.findById(payload.userId);

      if (user) {
        console.log('User found:', user);
        return done(null, user);
      } else {
        console.log('User not found');
        return done(null, false);
      }
    } catch (error) {
        console.error('Error:', error);
      return done(error, false);
    }
  })
);

const authMiddleware = passport.authenticate('jwt', { session: false });

module.exports = authMiddleware;