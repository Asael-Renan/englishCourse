import express from 'express';
import { teacherAuth } from '../middlewares.js';
import createClasses from '../models/Classes.js';
import createTeacher from '../models/Teacher.js';
import createExams from '../models/Exams.js';
import createStudent from '../models/Student.js';
import __dirname from '../dirname.js';

const router = express.Router();

// Table from database
const classes = createClasses(),
    teacher = createTeacher(),
    exams = createExams(),
    student = createStudent();

//load page
router.get('/:id', teacherAuth, (req, res) => {
    try {
        res.sendFile(__dirname + '/public/pages/teacher.html')
    } catch {
        res.status(404).send()
    }
})

//get data
router.get('/getData/:id', teacherAuth, async (req, res) => {
    try {
        res.json(await teacher.getById(req.params.id))
    } catch {
        res.status(404).send()
    }
})

router.get('/getClassData/:classNumber', teacherAuth, async (req, res) => {
    try {
        res.json(await teacher.getClassData(req.params.classNumber)) ? res.status(200).send() : res.status(404).send()
    } catch (error) {
        res.status(404).send()
    }
})

//create exams
router.post('/createExam', teacherAuth, async (req, res) => {
    try {
        const { title, grade, classNumber } = req.body
        const exam = await exams.create(title, grade)
        const classe = await classes.getByNumber(classNumber)
        console.log(classe)
        if (exam && classe) {
            console.log(classe)
            await classe.addExam(exam) ? res.status(201).send() : res.status(400).send()
        }
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/setExameGradeToStudent', teacherAuth, (req, res) => {
    try {
        req.body.data.forEach(async studentData => {
            const { grade, studentId, examId } = studentData
            await student.setExamGrade(grade, studentId, examId)
        });
        console.log('------------------------------------------')
        res.status(200).send()
    } catch (error) {
        console.error(error)
        res.status(400).send()
    }
})

router.put('/updateExam/:id', teacherAuth, async (req, res) => {
    try {
        const { title, grade } = req.body
        const examId = req.params.id
        await exams.update(examId, title, grade) ? res.status(200).send() : res.status(400).send()
    } catch (error) {
        res.status(400).send()
    }
})
export default router;