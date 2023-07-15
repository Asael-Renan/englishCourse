import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { join } from 'path'
import { login, studentAuth } from './middlewares.js';
import { checkIfUserExists } from './helper.js';
import createTeacher from './models/Teacher.js';
import createStudent from './models/Student.js';
import admRoutes from './routes/adm.js';
import teacherRoutes from './routes/teacher.js'
import __dirname from './dirname.js';
//deploy config
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();

// Configurações do express
app.use(express.static(join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "IAsi93#@*SAdsa-JoA#@*(",
    cookie: { maxAge: 86400000 },
    resave: false,
    saveUninitialized: false
}));

//routes
app.use('/adm', admRoutes)
app.use('/teacher', teacherRoutes)

// Tables from db
const teacher = createTeacher();
const student = createStudent();

//login and logout
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/pages/login.html')
})

app.post('/login', login)

app.get('/logout', (req, res) => {
    req.session.user = {}
    res.redirect('/login')
})

//get only one
app.get('/getTeacher/:id', async (req, res) => {
    checkIfUserExists(res, await teacher.getById(req.params.id))
})

app.get('/getStudent/:id', async (req, res) => {
    checkIfUserExists(res, await student.getById(req.params.id))
})

app.get('/student/:id', studentAuth, async (req, res) => {
    try {
        res.sendFile(__dirname + '/public/pages/student.html')
    } catch {
        res.status(404).send()
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'))