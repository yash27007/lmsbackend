import { PrismaClient, Course, Enrollment, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new course.
 *
 * @param facultyId - The ID of the faculty creating the course.
 * @param courseData - The course details.
 * @returns The created course record.
 * @throws Error if the course creation fails.
 */
export const createCourse = async (
  facultyId: number,
  courseData: {
    name: string;
    description?: string;
    duration: number; // in minutes
    price: number;
    discountedPrice?: number;
    discountPercentage?: number;
    discountValidUntil?: Date;
    scormVersion: 'SCORM_1_2' | 'SCORM_2004_3RD_EDITION' | 'SCORM_2004_4TH_EDITION';
    scormUrl: string;
    manifestUrl: string;
  }
): Promise<Course> => {
  try {
    return await prisma.course.create({
      data: {
        ...courseData,
        faculty: { connect: { id: facultyId } },
        status: 'DRAFT', // Default status for new courses
      },
    });
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Could not create course');
  }
};

/**
 * Update an existing course.
 *
 * @param courseId - The ID of the course to update.
 * @param updates - The fields to update.
 * @returns The updated course record.
 * @throws Error if the course update fails.
 */
export const updateCourse = async (
  courseId: number,
  updates: Partial<{
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
    discountedPrice?: number;
    discountPercentage?: number;
    discountValidUntil?: Date;
    scormVersion?: 'SCORM_1_2' | 'SCORM_2004_3RD_EDITION' | 'SCORM_2004_4TH_EDITION';
    scormUrl?: string;
    manifestUrl?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  }>
): Promise<Course> => {
  try {
    return await prisma.course.update({
      where: { id: courseId },
      data: updates,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Could not update course');
  }
};

/**
 * Get all courses created by a specific faculty.
 *
 * @param facultyId - The ID of the faculty.
 * @returns An array of courses created by the faculty.
 * @throws Error if fetching courses fails.
 */
export const getCoursesByFaculty = async (facultyId: number): Promise<Course[]> => {
  try {
    return await prisma.course.findMany({
      where: { facultyId },
    });
  } catch (error) {
    console.error('Error fetching courses by faculty:', error);
    throw new Error('Could not fetch courses by faculty');
  }
};

/**
 * Get students enrolled in a specific course.
 *
 * @param courseId - The ID of the course.
 * @returns An array of students enrolled in the course.
 * @throws Error if fetching enrolled students fails.
 */
export const getStudentsInCourse = async (courseId: number): Promise<User[]> => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId, status: 'ACTIVE' }, // Only active enrollments
      include: { student: { include: { user: true } } },
    });

    return enrollments.map(enrollment => enrollment.student.user);
  } catch (error) {
    console.error('Error fetching students in course:', error);
    throw new Error('Could not fetch students in course');
  }
};
