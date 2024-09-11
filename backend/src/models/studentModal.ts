import { PrismaClient, Student } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new student
export const createStudent = async (userId: number): Promise<Student> => {
  try {
    return await prisma.student.create({
      data: {
        userId,
      },
    });
  } catch (error) {
    console.error('Error creating student:', error);
    throw new Error('Could not create student');
  }
};

// Get a student by ID
export const getStudentById = async (id: number): Promise<Student | null> => {
  try {
    return await prisma.student.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    throw new Error('Could not fetch student by ID');
  }
};

// Update a student by ID
export const updateStudent = async (id: number, data: Partial<{
  userId: number;
}>): Promise<Student | null> => {
  try {
    return await prisma.student.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating student by ID:', error);
    throw new Error('Could not update student by ID');
  }
};

// Delete a student by ID
export const deleteStudent = async (id: number): Promise<Student | null> => {
  try {
    return await prisma.student.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting student by ID:', error);
    throw new Error('Could not delete student by ID');
  }
};
