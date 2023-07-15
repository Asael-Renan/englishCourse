import { Classes, Teacher, Student } from "./tables.js"

export default function createClasses() {

    async function create(number, level = 'basic') {
        try {
            return await Classes.create({ number: parseInt(number), level })
        } catch (error) {
            console.error('Erro ao criar classe: ' + error)
        }
    }

    async function getAll() {
        try {
            return await Classes.findAll({
                raw: true,
            })
        } catch (error) {
            console.error('Erro ao obter classe: ' + error)
        }
    }

    async function getByNumber(number) {
        return await Classes.findByPk(number)
    }

    async function getDataByNumber(number) {
        return await Classes.findByPk(number, {
            include: [
                {
                    model: Teacher,
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Student,
                    attributes: { exclude: ['password'] }
                }
            ]

        })
    }

    async function destroy(number) {
        return await Classes.destroy({ where: { number } })
    }

    return {
        create,
        getAll,
        getByNumber,
        getDataByNumber,
        destroy
    }
}