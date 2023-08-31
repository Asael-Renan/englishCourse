import { Classes, Teacher, Student, Exams, User, Student_exams } from "./tables.js";

export default class ClassRepository {

    async create(number, level = 'basic') {
        try {
            return await Classes.create({ number: parseInt(number), level });
        } catch (error) {
            console.error('Error creating class:', error);
            throw new Error('Error creating class: ' + error.message);
        }
    }

    async checkClass(numbers) {
        const classes = await Classes.findAll();

        if (classes.length <= 0) {
            throw new Error("No classes");
        }

        if (!Array.isArray(numbers)) {
            numbers = [numbers];
        }

        const missingClasses = numbers.filter(number => !classes.some(cls => cls.number === number));
        if (missingClasses.length > 0) {
            throw new Error(`Classes not found: ${missingClasses.join(', ')}`);
        }

        return true;
    }

    async getAll() {
        try {
            return await Classes.findAll({
                raw: true,
            });
        } catch (error) {
            throw new Error('Error getting classes: ' + error.message);
        }
    }

    async getByNumber(number) {
        try {
            const classe = await Classes.findByPk(number, { raw: true });
            console.log(classe)
            if (classe) {
                return classe
            } else {
                throw new Error(`Error class not found`)
            }
        } catch (error) {
            console.error('Error getting class:', error);
            throw new Error('Error getting class: ' + error.message);
        }
    }

    async getDataByNumber(number) {
        try {
            return await Classes.findByPk(number, {
                include: [
                    {
                        model: Teacher,
                        include: {
                            model: User,
                            attributes: { exclude: ['password'] }
                        }
                    },
                    {
                        model: Student,
                        include: [
                            { model: User, attributes: { exclude: ['password'] } },
                            { model: Student_exams }
                        ],
                    },
                    {
                        model: Exams,
                    }
                ]
            });
        } catch (error) {
            console.error('Error getting class data:', error);
            throw new Error('Error getting class data: ' + error.message);
        }
    }

    async addTeacher(classNumber, teacherId) {
        try {
            const classe = await Classes.findByPk(classNumber);
            const teacher = await Teacher.findByPk(teacherId);
            if (classe && teacher) {
                await classe.addTeacher(teacher);
                return true;
            }
            throw new Error('Error adding teacher to class: Class or teacher not found');
        } catch (error) {
            console.error('Error adding teacher to class:', error);
            throw new Error('Error adding teacher to class: ' + error.message);
        }
    }

    async addExam(exam, classNumber) {
        try {
            const classe = await Classes.findByPk(classNumber);
            const teacher = await Teacher.findByPk(exam);
            if (classe && teacher) {
                await classe.addTeacher(teacher);
                return true;
            }
            throw new Error('Error adding teacher to class: Class or teacher not found');
        } catch (error) {
            console.error('Error adding teacher to class:', error);
            throw new Error('Error adding teacher to class: ' + error.message);
        }
    }

    async removeTeacher(classNumber, teacherId) {
        try {
            const classe = await Classes.findByPk(classNumber);
            if (!classe) {
                throw new Error('Error removing teacher: Class not found');
            }
            await classe.removeTeacher(teacherId);
            return true;
        } catch (error) {
            console.error('Error removing teacher from class:', error);
            throw new Error('Error removing teacher from class: ' + error.message);
        }
    }

    async delete(number) {
        try {
            const deletedRows = await Classes.destroy({ where: { number } });
            if (deletedRows === 1) {
                console.log('Class deleted successfully.');
                return true;
            } else {
                throw new Error('Error deleting class: Class not found.');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            throw new Error('Error deleting class: ' + error.message);
        }
    }
}
