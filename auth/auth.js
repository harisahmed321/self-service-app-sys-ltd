const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user.model');

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_Secret_Key,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        process.env.userId = token.user._id;
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
