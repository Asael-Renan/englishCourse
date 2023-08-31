import bcrypt from 'bcrypt';
import { Adm, Student, Teacher, User, Classes } from './tables.js';

export default class UserRepository {
    async create(name, email, password) {
        try {
            const hash = await this.hashPassword(password);
            return await User.create({ name, email, password: hash });
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
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
            throw new Error(`Classes not found: ${missingClasses.join(', ')}.`);
        }

        return true;
    }


    async getAll() {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email'],
                include: [
                    { model: Adm },
                    { model: Teacher },
                    { model: Student }
                ],
            });
            if (!users) return false
            return users
        } catch (error) {
            throw new Error(`Error getting users: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await User.findByPk(id, {
                attributes: ['id', 'name', 'email'],
                include: [
                    { model: Adm },
                    { model: Teacher },
                    { model: Student }
                ]
            });
        } catch (error) {
            throw new Error(`Error getting Userin by ID: ${error.message}`);
        }
    }


    async updateName(userId, newName) {
        try {
            if (!newName) {
                throw new Error('New name is required');
            }

            const [updatedCount] = await User.update({ name: newName }, { where: { id: userId } });

            return updatedCount > 0;
        } catch (error) {
            console.error('Error updating name: ' + error);
            throw new Error('Failed to update name');
        }
    }

    async updateEmail(userId, newEmail) {
        try {
            if (!newEmail) {
                throw new Error('New email is required');
            }

            const [updatedCount] = await User.update({ email: newEmail }, { where: { id: userId } });

            return updatedCount > 0;
        } catch (error) {
            console.error('Error updating email: ' + error);
            throw new Error('Failed to update email');
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            if (!newPassword) {
                throw new Error('New password is required');
            }

            const [updatedCount] = await User.update({ password: newPassword }, { where: { id: userId } });

            return updatedCount > 0;
        } catch (error) {
            console.error('Error updating password: ' + error);
            throw new Error('Failed to update password');
        }
    }

    async delete(id) {
        try {
            await User.destroy({ where: { id } });
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async hashPassword(password) {
        try {
            const hash = await bcrypt.hash(password, 10);
            return hash;
        } catch (error) {
            throw new Error(`Error hashing password: ${error.message}`);
        }
    }

    async checkPassword(user, password) {
        try {
            return await bcrypt.compare(password, user.dataValues.password)
        } catch (error) {
            throw new Error(`Error checking password: ${error.message}`);
        }
    }

    async checkRole(user) {
        try {
            const { adm, teacher, student, name, email } = user.dataValues;
            let role = null;
            let id = null

            if (adm !== null) {
                role = 'adm';
                id = adm.dataValues.id
            } else if (teacher !== null) {
                role = 'teacher';
                id = teacher.dataValues.id
            } else if (student !== null) {
                role = 'student';
                id = student.dataValues.id
            }

            if (role) {
                return { name, email, role, id };
            } else {
                return null;
            }
        } catch (error) {
            throw new Error(`Error checking role: ${error.message}`);
        }
    }


    async login(email, password) {
        try {
            if (!email || !password) {
                throw new Error("Missing email or password")
            }
            const user = await User.findOne({
                where: { email },
                include: [
                    { model: Adm },
                    { model: Teacher },
                    { model: Student }
                ],
            })

            if (!user) {
                throw new Error("User not found")
            }
            const match = await this.checkPassword(user, password)
            if (!match) {
                return false
            }
            return await this.checkRole(user)
        } catch (error) {
            throw new Error(`Error login: ${error.message}`)
        }
    }
}
