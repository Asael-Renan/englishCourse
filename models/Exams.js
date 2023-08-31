import { Exams, Classes } from "./tables.js";

export default class ExamsRepository {

    async create(title, grade = 10, classNumber) {
        try {
            const classe = await Classes.findByPk(classNumber)
            if (classe) {
                const exam = await Exams.create({ title, grade });
                exam.addClasses(classe)
            } else {
                throw new Error(`Class not found`)
            }
        } catch (error) {
            console.error('Error creating exam: ' + error);
            throw new Error('Failed to create exam');
        }
    }

    async update(examId, title, grade) {
        try {
            const updates = {};

            if (title) {
                updates.title = title;
            }

            if (grade !== undefined) {
                updates.grade = grade;
            }

            if (Object.keys(updates).length === 0) {
                throw new Error('No valid fields to update');
            }

            const [updatedCount] = await Exams.update(updates, { where: { id: examId } });
            if (updatedCount > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating exam: ' + error);
            throw new Error('Failed to update exam');
        }
    }


    async getAll() {
        try {
            return await Exams.findAll({ raw: true });
        } catch (error) {
            console.error('Error fetching exams: ' + error);
            throw new Error('Failed to fetch exams');
        }
    }

    async getById(id) {
        try {
            return await Exams.findByPk(id, { raw: true });
        } catch (error) {
            console.error('Error fetching exam by id: ' + error);
            throw new Error('Failed to fetch exam by id');
        }
    }

    async delete(id) {
        try {
            const deletedCount = await Exams.destroy({ where: { id } });
            return deletedCount > 0;
        } catch (error) {
            console.error('Error deleting exam: ' + error);
            throw new Error('Failed to delete exam');
        }
    }
}