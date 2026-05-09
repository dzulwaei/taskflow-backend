/**
 * Utility for generating JWT access tokens.
 * The token payload contains the authenticated user ID.
 */
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;