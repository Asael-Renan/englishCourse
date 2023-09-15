import express from 'express';
import { admAuth } from '../middlewares.js';
import AdmRepository from '../models/Adm.js';
import ClassRepository from '../models/Classes.js';
import TeacherRepository from '../models/Teacher.js';
import StudentRepository from '../models/Student.js';
import classRoutes from './admClass.js'
import __dirname from '../dirname.js';

const router = express.Router();

router.use('/class', classRoutes)
// Tables from db
const adm = new AdmRepository(),
    classes = new ClassRepository(),
    teacher = new TeacherRepository(),
    student = new StudentRepository();

//load pages
router.get('/', admAuth, (req, res) => {
    try {
        res.sendFile(__dirname + '/public/adm/adm.html');
    } catch (error) {
        console.error('Error loading admin page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/student/:id', admAuth, (req, res) => {
    try {
        res.sendFile(__dirname + '/public/adm/editStudent.html');
    } catch (error) {
        console.error('Error loading edit student page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/teacher/:id', admAuth, (req, res) => {
    try {
        res.sendFile(__dirname + '/public/adm/editTeacher.html');
    } catch (error) {
        console.error('Error loading edit teacher page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/getData', admAuth, async (req, res) => {
    try {
        res.json({
            adm: await adm.getAll(),
            student: await student.getAll(),
            teacher: await teacher.getAll(),
            classes: await classes.getAll()
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/getClasses', admAuth, async (req, res) => {
    try {
        res.json(await classes.getAll());
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/teachers', admAuth, async (req, res) => {
    try {
        res.json(await teacher.getAll());
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/students', admAuth, async (req, res) => {
    try {
        res.json(await student.getAll());
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/createClass', admAuth, async (req, res) => {
    try {
        const { number, level } = req.body;
        const created = await classes.create(number, level);
        if (created) {
            res.status(201).send();
        } else {
            res.status(400).send('Failed to create class');
        }
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).send('Internal Server Error');
    }
});

// create users
router.post('/createAdm', admAuth, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await adm.create(name, email, password);
        res.status(201).send();
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).send('Failed to create admin');
    }
});

router.post('/createTeacher', admAuth, async (req, res) => {
    try {
        const { name, email, password, classesId } = req.body;
        // console.log(classesId)
        await teacher.create(name, email, password, classesId);
        res.status(201).send();
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).send('Failed to create teacher');
    }
});

router.post('/createStudent', admAuth, async (req, res) => {
    try {
        const { name, email, password, grade, absences, classNumber } = req.body;
        console.log(req.body)
        console.log(req.body.classNumber)
        console.log(classNumber)
        await student.create(name, email, password, grade, absences, classNumber);
        res.status(201).send();
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).send('Failed to create student');
    }
});

// Delete users
router.delete('/deleteAdm/:id', admAuth, async (req, res) => {
    try {
        const id = req.params.id;
        await adm.delete(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).send('Failed to delete admin');
    }
});

router.delete('/deleteTeacher/:id', admAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await teacher.delete(id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Teacher not found');
        }
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).send('Failed to delete teacher');
    }
});

router.delete('/deleteStudent/:id', admAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await student.delete(id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Failed to delete student');
    }
});

// Delete class
router.delete('/deleteClass/:number', admAuth, async (req, res) => {
    try {
        const number = req.params.number;
        const deleted = await classes.delete(number);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Class not found');
        }
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).send('Failed to delete class');
    }
});

export default router;
