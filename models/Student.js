import { Classes, Student } from "./tables.js"
import { Student_exams } from "./tables.js";
import bcrypt from 'bcrypt'

export default function createStudent() {
    async function create(name, password, classNumber, grade = 0, absences = 0) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            return await Student.create({ name, password: hashedPassword, grade, absences, classNumber })
        } catch (error) {
            console.error('Erro ao criar aluno:', error)
        }
    }

    async function getAll(password = false) {
        if (password) {
            return await Student.findAll({
                raw: true,
            })
        }
        return await Student.findAll({
            raw: true,
            attributes: { exclude: ['password'] }
        })
    }

    async function getById(id) {
        return await Student.findByPk(id, { include: Classes, attributes: { exclude: ['password'] } })
    }

    async function setExamGrade(grade, studentId, examId) {
        try {
            grade = parseFloat(grade)
            if (grade < 0) return false

            const studentExam = await Student_exams.findOrCreate({
                where: { studentId, examId },
                defaults: { studentGrade: grade }
            });

            const [studentExamRecord, created] = studentExam,
                examGrade = studentExamRecord.dataValues.studentGrade,
                student = await Student.findByPk(studentId, { raw: true }),
                studentGrade = student.grade
            if (!created) {
                if (examGrade === grade) return false
                console.log(`Nota atualizada para ${student.name}: ${studentGrade} - ${examGrade} + ${grade} = ${studentGrade - examGrade + grade}`)
                await studentExamRecord.update({ studentGrade: grade });

                await Student.update(
                    { grade: studentGrade - examGrade + grade },
                    { where: { id: studentId } }
                );
                return true;
            } else {
                console.log(`Nota criada para ${student.name}: ${studentGrade} + ${grade} = ${studentGrade + examGrade}`)
                await Student.update(
                    { grade: studentGrade + examGrade },
                    { where: { id: studentId } }
                );

                return true;
            }
        } catch (error) {
            console.error('Erro ao atribuir nota: ' + error)
        }
    }

    async function destroy(id) {
        return await Student.destroy({ where: { id } })
    }

    return {
        create,
        getAll,
        destroy,
        getById,
        setExamGrade
    }
}