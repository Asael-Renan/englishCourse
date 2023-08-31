import { Classes, User, Student, Student_exams } from "./tables.js"
import UserRepository from "./User.js";

export default class StudentRepository extends UserRepository {
    async create(name, email, password, grade = 0, absences = 0, classNumber) {
        try {
            console.log(classNumber)
            await super.checkClass(classNumber)
            const user = await super.create(name, email, password);
            const student = await Student.create({ userId: user.dataValues.id, classNumber, grade, absences });
            return { user: user.dataValues, student: student.dataValues }
        } catch (error) {
            throw new Error(`Error creating student: ${error.message}`)
        }
    }

    async getAll() {
        try {
            const users = await super.getAll();
            if (!users) {
                return false
            }
            const students = users.filter(user => user.dataValues.student !== null)
            return students.map(student => {
                delete student.dataValues.teacher
                delete student.dataValues.adm
                student.dataValues.student = student.dataValues.student.dataValues
                return student.dataValues
            })
        } catch (error) {
            throw new Error(`Error getting student: ${error.message}`);
        }
    }

    async getById(studentId) {
        try {
            studentId = parseInt(studentId);
            const student = await Student.findByPk(studentId, { include: { model: User, attributes: { exclude: ['password', 'id'] } }, });

            if (student) {
                const data = student.dataValues,
                    { id, userId, grade, absences, classNumber } = data,
                    userData = data.user.dataValues;

                return { studentId: id, userId, ...userData, grade, absences, classNumber };
            } else {
                return false;
            }
        } catch (error) {
            throw new Error(`Error getting student: ${error.message}`);
        }
    }


    async setExamGrade(grade, studentId, examId) {
        try {
            grade = parseFloat(grade);

            if (grade < 0) {
                return false;
            }

            const [studentExamRecord, created] = await Student_exams.findOrCreate({
                where: { studentId, examId },
                defaults: { studentGrade: grade }
            });

            const student = await Student.findByPk(studentId);

            if (!created) {
                const examGrade = studentExamRecord.studentGrade;
                const updatedGrade = student.grade - examGrade + grade;
                console.log(`Nota atualizada para ${student.name}: ${student.grade} - ${examGrade} + ${grade} = ${updatedGrade}`);
                await studentExamRecord.update({ studentGrade: grade });
                await student.update({ grade: updatedGrade });
            } else {
                const newGrade = student.grade + grade;
                console.log(`Nota criada para ${student.name}: ${student.grade} + ${grade} = ${newGrade}`);
                await student.update({ grade: newGrade });
            }

            return true;
        } catch (error) {
            throw new Error(`Error setting exam grade: ${error.message}`)
        }
    }

    async delete(id) {
        try {
            const Student = await this.getById(id)
            if (Student) {
                await Student.destroy({ where: { id } });
                await super.delete(Student.userId)
                return true
            } else {
                throw new Error(`Error student not found`);
            }
        } catch (error) {
            throw new Error(`Error deleting student: ${error.message}`);
        }
    }
}