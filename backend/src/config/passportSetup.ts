import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `http://localhost:5000/auth/google/callback`,
    proxy: true,
    passReqToCallback: true, // Allows access to req object
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const role = req.query.role as string; // Extract role from query parameters

      // Check if the user already exists in the database
      let user = await prisma.user.findUnique({
        where: { email: profile.emails?.[0]?.value || '' },
      });

      if (user) {
        // If user exists, check role
        if (user.role !== role) {
          return done(null, false, { message: 'Role mismatch' });
        }
        return done(null, user);
      }

      // Create a new user if they do not exist
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails?.[0]?.value || '',
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          role: role as UserRole || UserRole.STUDENT, // Default to 'STUDENT' if no role is provided
          verified: true, // Since Google OAuth users are inherently verified
        },
      });

      done(null, user);
    } catch (err) {
      console.error('Error in Google authentication:', err);
      done(err);
    }
  }
));
