const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user.model');

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: process.env.JWT_Secret_Key,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
