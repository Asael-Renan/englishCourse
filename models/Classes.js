import { Classes, Teacher, Student, Exams } from "./tables.js"

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
        return await Classes.findByPk(number, { raw: true })
    }

    async function getDataByNumber(number) {
        try {
            return (await Classes.findByPk(number, {
                include: [
                    {
                        model: Teacher,
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: Student,
                        attributes: { exclude: ['password'] },
                    },
                    {
                        model: Exams,
                    }
                ]
            })).dataValues
        } catch (error) {
            console.error(error)
        }
    }

    //remove
    async function removeTeacher(classNumber, teacherId) {
        try {
            const classe = await Classes.findByPk(classNumber);
            console.log(classe)
            if (classe) {
                await classe.removeTeacher(teacherId);
                console.log('professor removido')
                return true
            } else {
                console.log('Turma não encontrada.');
                return false
            }
        } catch (error) {
            console.error('Erro ao remover a relação:', error);
            return false
        }
    }

    async function removeStudent(id) {

    }

    async function removeExam(id) {

    }

    async function destroy(number) {
        return await Classes.destroy({ where: { number } })
    }

    return {
        create,
        getAll,
        getByNumber,
        getDataByNumber,
        removeTeacher,
        destroy
    }
}