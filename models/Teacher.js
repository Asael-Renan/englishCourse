import { Classes, Teacher, Student, Exams } from "./tables.js"
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
                include: {
                    model: Classes,
                    include: [
                        {
                            model: Student,
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: Exams
                        }
                    ]
                }, attributes: { exclude: ['password'] }
            })
        } catch (error) {
            console.error('error: ' + error)
        }
    }

    async function destroy(id) {
        return await Teacher.destroy({ where: { id } })
    }
    return {
        create,
        getAll,
        destroy,
        getById
    }
}