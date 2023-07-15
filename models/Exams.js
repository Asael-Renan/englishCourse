import { Exams } from "./tables.js"

export default function createExams() {

    async function create(title, grade = 10) {
        try {
            return await Exams.create({ title, grade })
        } catch (error) {
            console.error('Erro ao criar exercicio: ' + error)
        }
    }

    async function update(examId, title, grade) {
        try {
            return await Exams.update({ title, grade }, {where: {id: examId}})
        } catch (error) {
            console.error('Erro ao criar exercicio: ' + error)
        }
    }

    async function getAll() {
        try {
            return await Exams.findAll({ raw: true })
        } catch (error) {
            console.error('Erro ao obter classe: ' + error)
        }
    }

    async function getById(id) {
        return await Exams.findByPk(id, { raw: true })
    }

    return {
        create,
        update,
        getAll,
        getById
    }
}