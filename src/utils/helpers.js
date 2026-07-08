const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  });
};

const calculateGrade = (marks, total) => {
  const percentage = (marks / total) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

const generateStudentId = async (Student) => {
  const count = await Student.countDocuments();
  const year = new Date().getFullYear().toString().slice(-2);
  return `STU${year}${String(count + 1).padStart(4, '0')}`;
};

const generateEmployeeId = async (Teacher) => {
  const count = await Teacher.countDocuments();
  const year = new Date().getFullYear().toString().slice(-2);
  return `TCH${year}${String(count + 1).padStart(4, '0')}`;
};

const getConversationId = (userId1, userId2) => {
  return [userId1.toString(), userId2.toString()].sort().join('_');
};

module.exports = {
  generateToken,
  generateRefreshToken,
  calculateGrade,
  generateStudentId,
  generateEmployeeId,
  getConversationId,
};
