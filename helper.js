// import { createAdm } from './models/Adm.js';
// import { createClasses } from './models/Classes.js';
// import { createTeacher } from './models/Teacher.js';
// import { createStudent } from './models/Student.js';

// // Tables from db
// const adm = createAdm();
// const classes = createClasses();
// const teacher = createTeacher();
// const student = createStudent();


export function checkIfUserExists(res, data) {
    try {
        if (data) {
            res.json(data)
        } else {
            res.status(404).send()
        }
    } catch {
        res.status(404).send()
    }
}