var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient, UserRole, ScormVersion, CourseStatus, EnrollmentStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clean the database
        yield prisma.payment.deleteMany();
        yield prisma.courseAccess.deleteMany();
        yield prisma.enrollment.deleteMany();
        yield prisma.course.deleteMany();
        yield prisma.admin.deleteMany();
        yield prisma.faculty.deleteMany();
        yield prisma.student.deleteMany();
        yield prisma.user.deleteMany();
        // Create users
        const users = yield Promise.all([
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
        const courses = yield Promise.all([
            createCourse('Introduction to Programming', faculty[0].faculty.id, true),
            createCourse('Advanced Data Structures', faculty[1].faculty.id, true),
            createCourse('Web Development Fundamentals', faculty[2].faculty.id, true),
            createCourse('Machine Learning Basics', admins[0].admin.id, false),
            createCourse('Database Design', admins[1].admin.id, false),
            createCourse('Mobile App Development', faculty[0].faculty.id, true),
            createCourse('Network Security', faculty[1].faculty.id, true),
            createCourse('Cloud Computing', faculty[2].faculty.id, true),
            createCourse('Artificial Intelligence', admins[0].admin.id, false),
            createCourse('Software Engineering Principles', admins[1].admin.id, false),
        ]);
        // Create enrollments and payments
        for (const student of students) {
            for (const course of courses) {
                if (Math.random() > 0.3) { // 70% chance of enrollment
                    const enrollment = yield createEnrollment(student.student.id, course.id);
                    if (enrollment.paid) {
                        yield createPayment(enrollment.id, course.price);
                    }
                }
            }
        }
        console.log('Seed data created successfully');
    });
}
function createUser(email, firstName, lastName, role) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.create({
            data: Object.assign({ email, password: yield bcrypt.hash('password123', 10), firstName,
                lastName,
                role, verified: true }, (role === UserRole.ADMIN ? { admin: { create: {} } } :
                role === UserRole.FACULTY ? { faculty: { create: {} } } :
                    { student: { create: {} } })),
            include: {
                admin: true,
                faculty: true,
                student: true,
            }
        });
    });
}
function createCourse(name, creatorId, isFaculty) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.course.create({
            data: Object.assign({ name, description: `Description for ${name}`, duration: Math.floor(Math.random() * 7200) + 1800, price: Math.floor(Math.random() * 15000) / 100 + 50, scormVersion: ScormVersion.SCORM_2004_4TH_EDITION, status: CourseStatus.PUBLISHED, scormUrl: `https://example.com/scorm/${name.toLowerCase().replace(/\s+/g, '-')}`, manifestUrl: `https://example.com/scorm/${name.toLowerCase().replace(/\s+/g, '-')}/imsmanifest.xml` }, (isFaculty ? { facultyId: creatorId } : { adminId: creatorId }))
        });
    });
}
function createEnrollment(studentId, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function createPayment(enrollmentId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.payment.create({
            data: {
                enrollmentId,
                amount,
                status: PaymentStatus.COMPLETED,
                paymentMethod: ['CARD', 'BANK_TRANSFER', 'PAYPAL'][Math.floor(Math.random() * 3)],
                transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
            }
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map