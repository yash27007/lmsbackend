import { PrismaClient,UserRole} from "@prisma/client";

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (user: {
  email: string;
  password?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  institution?: string;
  verified?: boolean;
  role:UserRole;
}) => {
  try {
    return await prisma.user.create({
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Could not create user");
  }
};

// Get a user by ID
export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user || null; // Return null if user is not found
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Could not fetch user by ID");
  }
};

// Get a user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user || null; // Return null if user is not found
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Could not fetch user by email");
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Could not fetch all users");
  }
};

// Update a user by ID
export const updateUser = async (id: number, data: Partial<{
  email: string;
  password?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  institution?: string;
  verified?: boolean;
  role:UserRole;
}>) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser || null; // Return null if user is not found
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw new Error("Could not update user by ID");
  }
};

// Update user by email
export const updateUserByEmail = async (email: string, data: Partial<{
  email?: string;
  password?: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  institution?: string;
  verified?: boolean;
  role?:UserRole;
}>) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data,
    });
    return updatedUser || null; // Return null if user is not found
  } catch (error) {
    console.error("Error updating user by email:", error);
    throw new Error("Could not update user by email");
  }
};

// Delete a user by ID
export const deleteUser = async (id: number) => {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    throw new Error("Could not delete user by ID");
  }
};

// Delete a user by email
export const deleteUserByEmail = async (email: string) => {
  try {
    return await prisma.user.delete({
      where: { email },
    });
  } catch (error) {
    console.error("Error deleting user by email:", error);
    throw new Error("Could not delete user by email");
  }
};

// Check if a user is verified by email
export const isUserVerifiedByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { verified: true },
    });
    return user?.verified || false; // Return false if user doesn't exist or isn't verified
  } catch (error) {
    console.error("Error checking user verification:", error);
    throw new Error("Could not verify user");
  }
};

// Get users by role (STUDENT, FACULTY, ADMIN)
export const getUsersByRole = async (role: UserRole) => {
  try {
    return await prisma.user.findMany({
      where: { role },
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new Error("Could not fetch users by role");
  }
};
