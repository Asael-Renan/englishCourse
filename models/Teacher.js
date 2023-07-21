import { Classes, Teacher, Student, Exams, Student_exams } from "./tables.js"
import bcrypt from 'bcrypt'

export default function createTeacher() {

    async function create(name, password) {
        try {
            if (!name && !password) {
                return;
            }
            const hash = await bcrypt.hash(password, 10)
            return await Teacher.create({ name, password: hash })
        } catch (error) {
            console.error(error)
        }
    }


    async function getAll(password = false) {
        if (password) {
            return await Teacher.findAll({
                raw: true,
            })
        }
        return await Teacher.findAll({
            raw: true,
            attributes: { exclude: ['password'] }
        })
    }

    async function getById(id) {
        try {
            return await Teacher.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: Classes
            })
        } catch (error) {
            console.error('error: ' + error)
        }
    }

    async function getClassData(classNumber) {
        try {
            return await Classes.findByPk(classNumber, {
                include: [
                    {
                        model: Student,
                        include: Student_exams,
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: Exams
                    }
                ]
            })
        } catch (error) {
            console.error("Erro ao buscar dados da turma: " + error)
        }
    }

    async function destroy(id) {
        return await Teacher.destroy({ where: { id } })
    }
    return {
        create,
        getAll,
        destroy,
        getById,
        getClassData
    }
}