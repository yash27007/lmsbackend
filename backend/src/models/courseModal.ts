import { PrismaClient, Course } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new course
export const createCourse = async (data: {
  name: string;
  description?: string;
  duration: number;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  discountValidUntil?: Date;
  accessDuration?: number;
  scormVersion: 'SCORM_1_2' | 'SCORM_2004_3RD_EDITION' | 'SCORM_2004_4TH_EDITION';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  scormUrl: string;
  manifestUrl: string;
  facultyId?: number;
  adminId?: number;
}): Promise<Course> => {
  try {
    return await prisma.course.create({
      data,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Could not create course');
  }
};

// Get a course by ID
export const getCourseById = async (id: number): Promise<Course | null> => {
  try {
    return await prisma.course.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw new Error('Could not fetch course by ID');
  }
};

// Update a course by ID
export const updateCourse = async (id: number, data: Partial<{
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  discountValidUntil?: Date;
  accessDuration?: number;
  scormVersion?: 'SCORM_1_2' | 'SCORM_2004_3RD_EDITION' | 'SCORM_2004_4TH_EDITION';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  scormUrl?: string;
  manifestUrl?: string;
  facultyId?: number;
  adminId?: number;
}>): Promise<Course | null> => {
  try {
    return await prisma.course.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating course by ID:', error);
    throw new Error('Could not update course by ID');
  }
};

// Delete a course by ID
export const deleteCourse = async (id: number): Promise<Course | null> => {
  try {
    return await prisma.course.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting course by ID:', error);
    throw new Error('Could not delete course by ID');
  }
};
