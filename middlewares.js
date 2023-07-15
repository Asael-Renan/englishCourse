import createAdm from "./models/Adm.js"
import createStudent from "./models/Student.js"
import createTeacher from "./models/Teacher.js"
import bcrypt from 'bcrypt'

const adm = createAdm()
const student = createStudent()
const teacher = createTeacher()


export async function login(req, res) {
    const users = [await adm.getAll(true), await teacher.getAll(true), await student.getAll(true)]

    const { name, password } = req.body
    let userFound = false

    for (let i = 0; i < users.length; i++) {
        for (const user of users[i]) {
            const match = await bcrypt.compare(password, user.password)
            if (user.name === name && match) {
                userFound = true
                if (0 === i) {
                    req.session.user = {
                        name,
                        role: 'adm',
                        id: user.id
                    }
                    res.redirect('/adm')
                } else if (1 === i) {
                    req.session.user = {
                        name,
                        role: 'teacher',
                        id: user.id
                    }
                    res.redirect(`teacher/${user.id}`)
                } else {
                    req.session.user = {
                        name,
                        role: 'student',
                        id: user.id
                    }
                    res.redirect('/student/' + user.id)
                }
                break
            }
        }
    }
    if (!userFound) {
        res.redirect('/login')
    }
}

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