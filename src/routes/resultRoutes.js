const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const resultController = require('../controllers/resultController');

const router = express.Router();

router.post('/upload', protect, authorize('teacher', 'admin'), resultController.uploadResults);
router.get('/student/:studentId', protect, resultController.getResultsByStudent);
router.get('/exam/:examId', protect, resultController.getResultsByExam);
router.get('/report/:studentId/pdf', protect, resultController.generateReportPDF);

module.exports = router;
