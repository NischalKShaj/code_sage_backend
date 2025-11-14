// file to generate the token for the application

// importing the required modules
import jwt from "jsonwebtoken";

// generating the access token
export const generateAccessToken = (userId, email) => {
  // for access_token
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

// for generating the refresh token
export const generateRefreshToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });
};
