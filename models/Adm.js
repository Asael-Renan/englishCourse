import { Adm } from './tables.js'
import bcrypt from 'bcrypt'

export default function createAdm() {

    async function create(name, password) {
        const hash = await bcrypt.hash(password, 10)
        return await Adm.create({ name, password: hash })
    }

    async function getAll(password = false) {
        if (password) {
            return await Adm.findAll({ raw: true, })
        }
        return await Adm.findAll({
            raw: true,
            attributes: { exclude: ['password'] }
        })
    }

    async function getById(id) {
        return await Adm.findByPk(id)
    }

    async function destroy(id) {
        return await Adm.destroy({ where: { id } })
    }

    return {
        create,
        getAll,
        destroy,
        getById
    }
}