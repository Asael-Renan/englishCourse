import express from 'express';
import { admAuth } from '../middlewares.js';
import createAdm from '../models/Adm.js';
import createClasses from '../models/Classes.js';
import createTeacher from '../models/Teacher.js';
import createStudent from '../models/Student.js';
import classRoutes from './admClass.js'
import __dirname from '../dirname.js';

const router = express.Router();

router.use('/class', classRoutes)
// Tables from db
const adm = createAdm();
const classes = createClasses();
const teacher = createTeacher();
const student = createStudent();

//load pages
router.get('/', admAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/adm/adm.html')
})

router.get('/student/:id', admAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/adm/editStudent.html')
})
router.get('/teacher/:id', admAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/adm/editTeacher.html')
})

// get all
router.get('/getData', admAuth, async (req, res) => {
    res.json({
        adm: await adm.getAll(),
        student: await student.getAll(),
        teacher: await teacher.getAll(),
        classes: await classes.getAll()
    })
})

router.get('/getClasses', admAuth, async (req, res) => {
    res.json(await classes.getAll())
})


//create class
router.post('/createClass', admAuth, async (req, res) => {
    try {
        const { number, level } = req.body
        await classes.create(number, level) ? res.status(201).send() : res.status(400).send()
    } catch {
        res.status(400).send('Erro ao criar classe')
    }
})

// create users
router.post('/createAdm', admAuth, async (req, res) => {
    try {
        const { name, password } = req.body
        await adm.create(name, password)
        res.status(201).send()
    } catch {
        res.status(400).send()
    }
})

router.post('/createTeacher', admAuth, async (req, res) => {
    try {
        const { name, password, classesId } = req.body;
        const newTeacher = await teacher.create(name, password);

        for (const classId of classesId) {
            const classObj = await classes.getByNumber(classId);
            if (classObj) {
                classObj.addTeacher(newTeacher)
            } else {
                res.status(404).send();
            }
        }
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(400).send();
    }
});

router.post('/createStudent', admAuth, async (req, res) => {
    try {
        const { name, password, grade, absences, classNumber } = req.body
        await student.create(name, password, grade, absences, classNumber)
        res.status(201).send()
    } catch (error) {
        res.status(400).send()
        console.error(+ error)
    }
})

//delete users
router.delete('/deleteAdm/:id', admAuth, async (req, res) => {
    try {
        const id = req.params.id
        await adm.destroy(id) ? res.status(204).send() : res.status(404).send()
    } catch {
        res.status(400).send()
    }
})

router.delete('/deleteTeacher/:id', admAuth, async (req, res) => {
    try {
        const id = req.params.id
        await teacher.destroy(id) ? res.status(204).send() : res.status(404).send()
    } catch {
        res.status(400).send()
    }
})

router.delete('/deleteStudent/:id', admAuth, async (req, res) => {
    try {
        const id = req.params.id
        await student.destroy(id) ? res.status(204).send() : res.status(404).send()
    } catch {
        res.status(400).send()
    }
})

//delete class
router.delete('/deleteClass/:number', admAuth, async (req, res) => {
    try {
        const number = req.params.number
        await classes.destroy(number) ? res.status(204).send() : res.status(404).send()
    } catch {
        res.status(400).send()
    }
})

export default router;
