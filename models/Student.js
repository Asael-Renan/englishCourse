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

    async function setExamGrade(studentGrade, studentId, examId) {
        try {
            const studentExam = await Student_exams.findOrCreate({
                where: { studentId, examId },
                defaults: { studentGrade }
            });

            const [studentExamRecord, created] = studentExam;

            if (!created) {
                // Registro já existe, então atualize a nota
                await studentExamRecord.update({ studentGrade });

                await Student.update(
                    { grade: studentGrade },
                    { where: { id: studentId } }
                );

                return true;
            } else {
                // Registro criado, faça o que for necessário
                await Student.update(
                    { grade: studentGrade },
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