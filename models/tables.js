import { ENUM, Sequelize, DataTypes } from "sequelize"
import { connect } from '../db.js'

export const Adm = connect.define('adm', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
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

export const Student = connect.define('student', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    grade: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    absences: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, { createdAt: false, updatedAt: false })

export const Teacher = connect.define('teacher', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { createdAt: false, updatedAt: false })

export const Exams = connect.define('exams', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
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
Classes.hasMany(Student)
Student.belongsTo(Classes)

Classes.belongsToMany(Teacher, { through: Teacher_class })
Teacher.belongsToMany(Classes, { through: Teacher_class })

Student.belongsToMany(Exams, { through: Student_exams })
Exams.belongsToMany(Student, { through: Student_exams })

Classes.belongsToMany(Exams, { through: Class_exams })
Exams.belongsToMany(Classes, { through: Class_exams })

//sync
Adm.sync({ force: false })
Classes.sync({ force: false })
Student.sync({ force: false })
Teacher.sync({ force: false })
Exams.sync({ force: false })
Teacher_class.sync({ force: false })
Class_exams.sync({ force: false })
Student_exams.sync({ force: false })