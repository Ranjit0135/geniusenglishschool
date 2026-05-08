const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All routes are protected and require 'school_admin' role (or similar)
// Adjust 'restrictTo' roles as needed based on your permissions system
router.use(protect);

router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
