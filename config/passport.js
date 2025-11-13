// file to configure the passport

// importing the required modules
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/user.js";
import bcrypt from "bcryptjs";

// creating the google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
      // to ensure we get refreshToken from Google:
      accessType: "offline",
      prompt: "consent",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails.length) {
          return done(new Error("No email found in Google profile"));
        }
        // Here you can save/find user in your DB
        const googleUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        // for checking if the user exists in the db
        const existingUser = await User.findOne({ email: googleUser.email });

        if (existingUser) {
          if (refreshToken) {
            existingUser.refreshToken = refreshToken;
            await existingUser.save();
          }
          // login
          return done(null, existingUser);
        }

        // for signup part
        const hashPassword = await bcrypt.hash(googleUser.googleId, 10);
        // for saving new user in the db
        const newUser = new User({
          username: googleUser.name,
          email: googleUser.email,
          password: hashPassword,
          refreshToken: refreshToken,
        });

        await newUser.save();

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (error) {
    console.error("error while google login", error);
    done(error, null);
  }
});
