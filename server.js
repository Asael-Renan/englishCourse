import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { join } from 'path'
import { studentAuth } from './middlewares.js';
import UserRepository from './models/User.js';
import StudentRepository from './models/Student.js';
import admRoutes from './routes/adm.js';
import teacherRoutes from './routes/teacher.js'
import __dirname from './dirname.js';
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
const user = new UserRepository(),
    student = new StudentRepository();
// Login and logout
app.get('/login', (req, res) => {
    try {
        console.log(req.session.user)
        res.sendFile(__dirname + '/public/login.html');
    } catch (error) {
        console.error('Error loading login page:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        console.log(req.body)
        if (!email && !password) {
            res.send('missing email or password')
            return
        }
        const result = await user.login(email, password);
        req.session.user = result
        res.send(result);
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    try {
        req.session.user = {};
        res.redirect('/login');
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get only one student
app.get('/getStudent/:id', async (req, res) => {
    try {
        const data = await student.getById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/student/:id', studentAuth, (req, res) => {
    try {
        res.sendFile(__dirname + '/public/pages/student.html');
    } catch (error) {
        console.error('Error loading student page:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'))