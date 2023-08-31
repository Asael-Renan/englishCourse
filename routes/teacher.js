import express from 'express';
import { teacherAuth } from '../middlewares.js';
import ClassRepository from '../models/Classes.js';
import TeacherRepository from '../models/Teacher.js';
import StudentRepository from '../models/Student.js';
import __dirname from '../dirname.js';
import ExamsRepository from '../models/Exams.js';

const router = express.Router();

// Repositories
const examRepository = new ExamsRepository();
const classRepository = new ClassRepository();
const teacherRepository = new TeacherRepository();
const studentRepository = new StudentRepository();

// Load teacher page
router.get('/:id', teacherAuth, (req, res) => {
    try {
        res.sendFile(__dirname + '/public/pages/teacher.html');
    } catch {
        res.status(404).send('Teacher page not found');
    }
});

// Get teacher data
router.get('/getData/:id', teacherAuth, async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacherData = await teacherRepository.getById(teacherId);
        if (teacherData) {
            res.json(teacherData);
        } else {
            res.status(404).send('Teacher data not found');
        }
    } catch {
        res.status(404).send('Error fetching teacher data');
    }
});

// Get class data
router.get('/getClassData/:classNumber', teacherAuth, async (req, res) => {
    try {
        const classNumber = parseInt(req.params.classNumber);
        const classData = await classRepository.getDataByNumber(classNumber);
        if (classData) {
            res.json(classData);
        } else {
            res.status(404).send('Class data not found');
        }
    } catch (error) {
        res.status(404).send('Error fetching class data');
    }
});

// Create exam
router.post('/createExam', teacherAuth, async (req, res) => {
    try {
        const { title, grade, classNumber } = req.body;
        await examRepository.create(title, grade, classNumber);
        res.status(201).send('Exam created successfully');
    } catch (error) {
        res.status(400).send('Error creating exam');
    }
});

// Set exam grades for students
router.post('/setExamGradeToStudent', teacherAuth, async (req, res) => {
    try {
        const { data } = req.body;
        for (const studentData of data) {
            const { grade, studentId, examId } = studentData;
            await studentRepository.setExamGrade(grade, studentId, examId);
        }
        console.log('------------------------------------------');
        res.status(200).send('Exam grades set successfully');
    } catch (error) {
        console.error(error);
        res.status(400).send('Error setting exam grades');
    }
});

// Update exam
router.put('/updateExam/:id', teacherAuth, async (req, res) => {
    try {
        const { title, grade } = req.body;
        const examId = req.params.id;
        const updated = await examRepository.update(examId, title, grade);
        if (updated) {
            res.status(200).send('Exam updated successfully');
        } else {
            res.status(400).send('Failed to update exam');
        }
    } catch (error) {
        res.status(400).send('Error updating exam');
    }
});

export default router;
