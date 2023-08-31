import UserRepository from "./User.js";
import { Adm, User } from "./tables.js";

export default class AdmRepository extends UserRepository {
    async create(name, email, password) {
        try {
            const user = await super.create(name, email, password);
            const adm = await Adm.create({ userId: user.dataValues.id });
            return { user: user.dataValues, adm: adm.dataValues }
        } catch (error) {
            throw new Error(`Error creating adm: ${error.message}`)
        }
    }

    async getAll() {
        try {
            const users = await super.getAll();
            const adms = users.filter(user => user.dataValues.adm !== null)
            return adms.map(adm => {
                delete adm.dataValues.teacher
                delete adm.dataValues.student
                adm.dataValues.adm = adm.dataValues.adm.dataValues
                return adm.dataValues
            })
        } catch (error) {
            throw new Error(`Error getting adm: ${error.message}`);
        }
    }

    async getById(admId) {
        try {
            admId = parseInt(admId);
            const adm = await Adm.findByPk(admId, { include: User, attributes: { exclude: ['password'] } });

            if (adm) {
                const { id, name, email } = adm.dataValues.user.dataValues;
                return { admId, userId: id, name, email };
            } else {
                throw new Error(`Error: id ${admId} adm doesn't exist`);
            }
        } catch (error) {
            throw new Error(`Error getting adm: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const adm = await this.getById(id)
            if (adm) {
                await Adm.destroy({ where: { id } });
                await super.delete(adm.userId)
            } else {
                throw new Error(`Error adm not found`);
            }
        } catch (error) {
            throw new Error(`Error deleting adm: ${error.message}`);
        }
    }
}