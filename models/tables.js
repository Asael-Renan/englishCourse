import { ENUM, Sequelize, DataTypes } from "sequelize"
import { connect } from '../db.js'

export const User = connect.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(255),
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { createdAt: false, updatedAt: false })

export const Classes = connect.define('classes', {
    number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    level: {
        type: ENUM('basic', 'intermediary', 'advanced'),
        allowNull: false
    }
}, { createdAt: false, updatedAt: false })

export const Adm = connect.define('adm', {}, { createdAt: false, updatedAt: false })

export const Teacher = connect.define('teacher', {}, { createdAt: false, updatedAt: false })

export const Student = connect.define('student', {
    grade: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    absences: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, { createdAt: false, updatedAt: false })

export const Exams = connect.define('exams', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    grade: {
        type: DataTypes.FLOAT
    }
})

//relational tables
export const Teacher_class = connect.define('teacher_class', {}, { timestamps: false, })

export const Class_exams = connect.define('class_exams', {}, { timestamps: false, })

export const Student_exams = connect.define('student_exams', {
    studentGrade: {
        type: DataTypes.FLOAT,
    }
}, { timestamps: false, })

// associations
User.hasOne(Adm, { onDelete: 'CASCADE' });
Adm.belongsTo(User);

User.hasOne(Teacher, { onDelete: 'CASCADE' });
Teacher.belongsTo(User);

User.hasOne(Student, { onDelete: 'CASCADE' });
Student.belongsTo(User);

Classes.hasMany(Student);
Student.belongsTo(Classes);

Student.belongsToMany(Exams, { through: Student_exams })
Exams.belongsToMany(Student, { through: Student_exams })
Student.hasMany(Student_exams)
Student_exams.belongsTo(Student)
Exams.hasMany(Student_exams)
Student_exams.belongsTo(Exams)

Classes.belongsToMany(Exams, { through: Class_exams });
Exams.belongsToMany(Classes, { through: Class_exams });

Classes.belongsToMany(Teacher, { through: Teacher_class });
Teacher.belongsToMany(Classes, { through: Teacher_class });

// sync tables
(async () => {
    try {
        await connect.sync({ force: false });
        console.log('Tabelas sincronizadas com sucesso.');
    } catch (error) {
        console.error('Erro ao sincronizar tabelas:', error);
    }
})();