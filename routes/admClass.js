import express from 'express';
import { admAuth } from '../middlewares.js';
import createClasses from '../models/Classes.js';
import __dirname from '../dirname.js';

const router = express.Router();

const classes = createClasses()

router.get('/:number', admAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/adm/editClass.html')
})

router.get('/getData/:number', admAuth, async (req, res) => {
    res.json(await classes.getDataByNumber(req.params.number))
})

export default router;