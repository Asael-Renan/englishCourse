import UserRepository from "./User.js";
import { Classes, Teacher, Student, Exams, Student_exams, User } from "./tables.js"
export default class TeacherRepository extends UserRepository {

    async create(name, email, password, classNumbers) {
        try {
            await super.checkClass(classNumbers)
            const user = await super.create(name, email, password);
            const teacher = await Teacher.create({ userId: user.dataValues.id });
            classNumbers.forEach(async number => {
                const classe = await Classes.findOne({ where: { number } })
                teacher.addClasses(classe)
            });
            return { user: user.dataValues, teacher: teacher.dataValues }
        } catch (error) {
            throw new Error(`Error creating teacher: ${error.message}`)
        }
    }

    async getAll() {
        try {
            const users = await super.getAll();
            const teachers = users.filter(user => user.dataValues.teacher !== null)
            return teachers.map(teacher => {
                delete teacher.dataValues.adm
                delete teacher.dataValues.student
                teacher.dataValues.teacher = teacher.dataValues.teacher.dataValues
                return teacher.dataValues
            })
        } catch (error) {
            throw new Error(`Error getting teacher: ${error.message}`);
        }
    }

    async getById(teacherId) {
        try {
            teacherId = parseInt(teacherId)
            const teacher = await Teacher.findByPk(teacherId, {
                include: [
                    { model: User, attributes: { exclude: ['password'] } },
                    { model: Classes }
                ]
            })

            if (teacher) {
                const { id, name, email } = teacher.dataValues.user.dataValues,
                    classes = teacher.dataValues.classes
                return { teacherId, userId: id, name, email, classes }
            } else {
                throw new Error(`Error: id ${id} teacher doesn't exist`)
            }
        } catch (error) {
            throw new Error(`Error getting teacher: ${error.message}`)
        }
    }

    async delete(id) {
        try {
            const teacher = await this.getById(id)
            if (teacher) {
                await Teacher.destroy({ where: { id } });
                await super.delete(teacher.userId)
                return true;
            } else {
                throw new Error(`Error teacher not found`);
            }
        } catch (error) {
            throw new Error(`Error deleting teacher: ${error.message}`);
        }
    }
}