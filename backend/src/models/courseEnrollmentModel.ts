import { PrismaClient, Enrollment } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new pending enrollment record.
 * 
 * @param studentId - The ID of the student.
 * @param courseId - The ID of the course.
 * @returns The created enrollment record with a pending status.
 * @throws Error if an error occurs during creation.
 */
export const createPendingEnrollment = async (
  studentId: number,
  courseId: number
): Promise<Enrollment> => {
  try {
    return await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        paid: false, // Payment not completed yet
        status: 'PENDING' // Initial status
      }
    });
  } catch (error) {
    console.error('Error creating pending enrollment:', error);
    throw new Error('Could not create pending enrollment');
  }
};

/**
 * Update the enrollment status after payment confirmation.
 * 
 * @param enrollmentId - The ID of the enrollment.
 * @param paymentId - The ID of the payment.
 * @returns The updated enrollment record.
 * @throws Error if an error occurs during update.
 */
export const updateEnrollmentAfterPayment = async (
  enrollmentId: number,
  paymentId: number
): Promise<Enrollment> => {
  try {
    return await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        paid: true, // Payment is completed
        payment: {
          connect: { id: paymentId }
        },
        status: 'ACTIVE' // Enrollment is now active
      }
    });
  } catch (error) {
    console.error('Error updating enrollment after payment:', error);
    throw new Error('Could not update enrollment after payment');
  }
};
