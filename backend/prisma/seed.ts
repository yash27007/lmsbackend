import { PrismaClient, UserRole, ScormVersion, CourseStatus, EnrollmentStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.payment.deleteMany();
  await prisma.courseAccess.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    createUser('admin1@example.com', 'Admin1', 'User', UserRole.ADMIN),
    createUser('admin2@example.com', 'Admin2', 'User', UserRole.ADMIN),
    createUser('faculty1@example.com', 'Faculty1', 'User', UserRole.FACULTY),
    createUser('faculty2@example.com', 'Faculty2', 'User', UserRole.FACULTY),
    createUser('faculty3@example.com', 'Faculty3', 'User', UserRole.FACULTY),
    createUser('student1@example.com', 'Student1', 'User', UserRole.STUDENT),
    createUser('student2@example.com', 'Student2', 'User', UserRole.STUDENT),
    createUser('student3@example.com', 'Student3', 'User', UserRole.STUDENT),
    createUser('student4@example.com', 'Student4', 'User', UserRole.STUDENT),
    createUser('student5@example.com', 'Student5', 'User', UserRole.STUDENT),
    createUser('student6@example.com', 'Student6', 'User', UserRole.STUDENT),
    createUser('student7@example.com', 'Student7', 'User', UserRole.STUDENT),
  ]);

  const admins = users.filter(u => u.role === UserRole.ADMIN && u.admin);
  const faculty = users.filter(u => u.role === UserRole.FACULTY && u.faculty);
  const students = users.filter(u => u.role === UserRole.STUDENT && u.student);

  // Create courses
  const courses = await Promise.all([
    createCourse('Introduction to Programming', faculty[0].faculty!.id, true),
    createCourse('Advanced Data Structures', faculty[1].faculty!.id, true),
    createCourse('Web Development Fundamentals', faculty[2].faculty!.id, true),
    createCourse('Machine Learning Basics', admins[0].admin!.id, false),
    createCourse('Database Design', admins[1].admin!.id, false),
    createCourse('Mobile App Development', faculty[0].faculty!.id, true),
    createCourse('Network Security', faculty[1].faculty!.id, true),
    createCourse('Cloud Computing', faculty[2].faculty!.id, true),
    createCourse('Artificial Intelligence', admins[0].admin!.id, false),
    createCourse('Software Engineering Principles', admins[1].admin!.id, false),
  ]);

  // Create enrollments and payments
  for (const student of students) {
    for (const course of courses) {
      if (Math.random() > 0.3) { // 70% chance of enrollment
        const enrollment = await createEnrollment(student.student!.id, course.id);
        if (enrollment.paid) {
          await createPayment(enrollment.id, course.price);
        }
      }
    }
  }

  console.log('Seed data created successfully');
}

async function createUser(email: string, firstName: string, lastName: string, role: UserRole) {
  return prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash('password123', 10),
      firstName,
      lastName,
      role,
      verified: true,
      ...(role === UserRole.ADMIN ? { admin: { create: {} } } :
          role === UserRole.FACULTY ? { faculty: { create: {} } } :
          { student: { create: {} } })
    },
    include: {
      admin: true,
      faculty: true,
      student: true,
    }
  });
}

async function createCourse(name: string, creatorId: number, isFaculty: boolean) {
  return prisma.course.create({
    data: {
      name,
      description: `Description for ${name}`,
      duration: Math.floor(Math.random() * 7200) + 1800, // Between 30 and 150 minutes
      price: Math.floor(Math.random() * 15000) / 100 + 50, // Between $50 and $200
      scormVersion: ScormVersion.SCORM_2004_4TH_EDITION,
      status: CourseStatus.PUBLISHED,
      scormUrl: `https://example.com/scorm/${name.toLowerCase().replace(/\s+/g, '-')}`,
      manifestUrl: `https://example.com/scorm/${name.toLowerCase().replace(/\s+/g, '-')}/imsmanifest.xml`,
      ...(isFaculty ? { facultyId: creatorId } : { adminId: creatorId })
    }
  });
}

async function createEnrollment(studentId: number, courseId: number) {
  const paid = Math.random() > 0.2; // 80% chance of being paid
  return prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      paid,
      completionStatus: paid ? Math.random() : null,
      score: paid ? Math.floor(Math.random() * 101) : null,
      status: paid ? EnrollmentStatus.ACTIVE : EnrollmentStatus.PENDING
    }
  });
}

async function createPayment(enrollmentId: number, amount: number) {
  return prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      status: PaymentStatus.COMPLETED,
      paymentMethod: ['CARD', 'BANK_TRANSFER', 'PAYPAL'][Math.floor(Math.random() * 3)],
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });