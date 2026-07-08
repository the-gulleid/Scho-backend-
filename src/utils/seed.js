require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { User, School, Class, Subject, Teacher, Student, Parent } = require('../models');

const seed = async () => {
  await connectDB();

  // Clear existing data in development
  if (process.env.NODE_ENV !== 'production') {
    await Promise.all([
      User.deleteMany({}),
      School.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Parent.deleteMany({}),
    ]);
    console.log('Cleared existing data');
  }

  // Create admin user
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@school.com',
    password: 'Admin@123',
    role: 'admin',
    isEmailVerified: true,
  });

  // Create school info
  await School.create({
    name: 'Greenwood High School',
    motto: 'Excellence in Education',
    address: '123 Education Street, City',
    phone: '+1-555-0100',
    email: 'info@greenwood.edu',
    principalName: 'Dr. Sarah Johnson',
    establishedYear: 1995,
    academicYear: '2025-2026',
  });

  // Create teacher user
  const teacherUser = await User.create({
    firstName: 'John',
    lastName: 'Smith',
    email: 'teacher@school.com',
    password: 'Teacher@123',
    role: 'teacher',
  });

  const teacher = await Teacher.create({
    user: teacherUser._id,
    employeeId: 'TCH250001',
    department: 'Science',
    qualification: 'M.Sc Physics',
    experience: 8,
  });

  // Create class
  const class10A = await Class.create({
    name: '10',
    section: 'A',
    academicYear: '2025-2026',
    classTeacher: teacher._id,
    room: 'Room 101',
    capacity: 40,
  });

  // Create subjects
  const math = await Subject.create({ name: 'Mathematics', code: 'MATH10', class: class10A._id, teacher: teacher._id });
  const science = await Subject.create({ name: 'Science', code: 'SCI10', class: class10A._id, teacher: teacher._id });

  await Teacher.findByIdAndUpdate(teacher._id, {
    subjects: [math._id, science._id],
    classes: [class10A._id],
  });
  await Class.findByIdAndUpdate(class10A._id, { subjects: [math._id, science._id] });

  // Create parent
  const parentUser = await User.create({
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'parent@school.com',
    password: 'Parent@123',
    role: 'parent',
  });

  const parent = await Parent.create({
    user: parentUser._id,
    occupation: 'Engineer',
    relationship: 'father',
  });

  // Create student
  const studentUser = await User.create({
    firstName: 'Emma',
    lastName: 'Brown',
    email: 'student@school.com',
    password: 'Student@123',
    role: 'student',
  });

  const student = await Student.create({
    user: studentUser._id,
    studentId: 'STU250001',
    class: class10A._id,
    parent: parent._id,
    gender: 'female',
    dateOfBirth: new Date('2010-05-15'),
  });

  await Parent.findByIdAndUpdate(parent._id, { children: [student._id] });
  await Class.findByIdAndUpdate(class10A._id, { students: [student._id] });

  console.log('Seed data created successfully!');
  console.log('\n--- Demo Accounts ---');
  console.log('Admin:   admin@school.com / Admin@123');
  console.log('Teacher: teacher@school.com / Teacher@123');
  console.log('Student: student@school.com / Student@123');
  console.log('Parent:  parent@school.com / Parent@123');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
