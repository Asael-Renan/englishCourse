import express from 'express';
import { admAuth } from '../middlewares.js';
import createClasses from '../models/Classes.js';
import __dirname from '../dirname.js';

const router = express.Router();

const classes = createClasses();

//load page
router.get('/:number', admAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/adm/editClass.html')
})

//get all data
router.get('/data/:number', admAuth, async (req, res) => {
    res.json(await classes.getDataByNumber(req.params.number))
})

router.get('', admAuth, async (req, res) => {

})

//remove from class
router.delete('/removeTeacher/:classNumber/:teacherId', admAuth, async (req, res) => {
    const {classNumber, teacherId} = req.params
    console.log(classNumber + teacherId)
    await classes.removeTeacher(classNumber, teacherId)
    res.status(201).send()
})

router.delete('removeStudent/:classNumber/:studentId', admAuth, async (req, res) => {
    await classes.removeStudent(req.params.id)
})

router.delete('removeExam/:classNumber/:examId', admAuth, async (req, res) => {
    await classes.removeExam(req.params.id)
})

export default router;