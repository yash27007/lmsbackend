import { PrismaClient, Payment } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a payment record for an existing enrollment.
 * 
 * @param amount - The amount of the payment.
 * @param status - The status of the payment (initially 'PENDING').
 * @param paymentMethod - The method used for payment.
 * @param transactionId - Optional transaction ID for external tracking.
 * @param enrollmentId - The ID of the enrollment this payment is associated with.
 * @returns The created payment record.
 * @throws Error if an error occurs during creation.
 */
export const createPayment = async (
  amount: number,
  status: 'PENDING' | 'COMPLETED' | 'FAILED',
  enrollmentId: number,
  paymentMethod?: string,
  transactionId?: string
): Promise<Payment> => {
  try {
    return await prisma.payment.create({
      data: {
        amount,
        status,
        paymentMethod,
        transactionId,
        enrollment: {
          connect: { id: enrollmentId }
        }
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Could not create payment');
  }
};

/**
 * Confirm payment status.
 * 
 * @param paymentId - The ID of the payment.
 * @param status - The new status of the payment.
 * @returns The updated payment record.
 * @throws Error if an error occurs during update.
 */
export const confirmPayment = async (
  paymentId: number,
  status: 'COMPLETED' | 'FAILED'
): Promise<Payment> => {
  try {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: { status }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error('Could not confirm payment');
  }
};
