import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';
import { createUser, getUserByEmail } from "../models/userModal.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import env from "dotenv";

env.config();
const prisma = new PrismaClient();

// Email login
export const emailLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords        
        if(!user.password){
            return res.status(401).json({ message: "No password is set, please sign in using google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email address" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Set JWT token as HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error('Error in email login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Register student with email
export const studentRegisterWithMail = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: "STUDENT",
            verified: false,
        });

        // Generate JWT token
        // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Set JWT token as HTTP-only cookie
        // res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send verification email
        const verificationToken = generateToken(user.id);
        const baseUrl = process.env.BASE_URL || "http://localhost:5173";
        await sendVerificationEmail({
            from: process.env.EMAIL!,
            to: user.email,
            subject: "Verify your account",
            html: `
              <p>Hello ${user.firstName},</p>
              <p>Thank you for registering to our app. To complete the registration process, please verify your email by clicking the button below:</p>
              <a href="${baseUrl}/auth/verify/${verificationToken}" 
                 style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                Verify your account
              </a>
              <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
              <p>${baseUrl}/auth/verify/${verificationToken}</p>
            `,
        });

        res.status(201).json({ message: "User (Student) created successfully, please verify your email" });
    } catch (err) {
        console.error('Error in student registration:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Register faculty with email
export const facultyRegisterWithMail = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: "FACULTY",
            verified: false,
        });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Set JWT token as HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send verification email
        const verificationToken = generateToken(user.id);
        const baseUrl = process.env.BASE_URL || "http://localhost:5173";
        await sendVerificationEmail({
            from: process.env.EMAIL!,
            to: user.email,
            subject: "Verify your account",
            html: `
              <p>Hello ${user.firstName},</p>
              <p>Thank you for registering to our app. To complete the registration process, please verify your email by clicking the button below:</p>
              <a href="${baseUrl}/auth/verify/${verificationToken}" 
                 style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                Verify your account
              </a>
              <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
              <p>${baseUrl}/auth/verify/${verificationToken}</p>
            `,
        });

        res.status(201).json({ message: "User (Faculty) created successfully, please verify your email" });
    } catch (err) {
        console.error('Error in faculty registration:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Google OAuth callback
export const googleCallback = async (req: Request, res: Response) => {
    try {
        const user = req.user as PrismaUser;

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Set JWT token as HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Redirect to frontend dashboard
    } catch (err) {
        console.error('Error in Google OAuth callback:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
