import AdmRepository from './models/Adm.js';
import TeacherRepository from './models/Teacher.js';
import StudentRepository from './models/Student.js';
import bcrypt from 'bcrypt'

const adm = new AdmRepository(),
 teacher = new TeacherRepository(),
 student = new StudentRepository();

export function admAuth(req, res, next) {
    // if (req.session.user && req.session.user.role === 'adm') {
        next()
    // } else {
    //     res.send('no aut adm <a href="/">inicio</a>')
    // }
}

export function teacherAuth(req, res, next) {
    // if (!req.session.user) {
    //     res.send('no aut teacher <a href="/">inicio</a>')
    //     return
    // }
    // if (req.session.user.role === 'teacher' && req.session.user.id === parseInt(req.url.split('/').pop()) || req.session.user.role === 'adm') {
        next()
    // } else {
    //     res.send('no aut teacher <a href="/">inicio</a>')
    // }
}

export function studentAuth(req, res, next) {
    // if (req.session.user && req.session.user.id === parseInt(req.url.split('/').pop())) {
        next()
    // } else {
    //     res.send('no aut student <a href="/">inicio</a>')
    // }
}