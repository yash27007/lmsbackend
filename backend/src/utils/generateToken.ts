import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "@prisma/client";
import env from "dotenv";
env.config();

const generateToken = (userId: User['id'], expiresIn: string = "1h") => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn, // Token expiration time
  });

  return token;
};

// This function is to generate an authentication token
const generateAuthToken = (res: Response, userId: User['id']) => {
  const token = generateToken(userId, "30d");

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
};

export { generateToken, generateAuthToken };
