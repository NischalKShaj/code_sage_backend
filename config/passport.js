// file to configure the passport

// importing the required modules
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import dotenv from "dotenv";
dotenv.config();
import { user as User } from "../model/user.js";
import bcrypt from "bcryptjs";

// creating the google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/login/google/callback",
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

// creating github strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/login/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        let existingUser = null;

        // If email exists, use it to match
        if (email) {
          existingUser = await User.findOne({ email });
        }

        if (existingUser) {
          if (refreshToken) {
            existingUser.refreshToken = refreshToken;
            await existingUser.save();
          }
          // login
          return done(null, existingUser);
        }

        // Register new user
        const hashPassword = await bcrypt.hash(profile.id, 10);

        const newUser = new User({
          username: profile.username,
          email: email,
          password: hashPassword,
          refreshToken: refreshToken,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.error("error while login", error);
        done(error, null);
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
