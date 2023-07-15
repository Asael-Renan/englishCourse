import { Sequelize } from "sequelize"
import mysql2 from "mysql2"
import * as dotenv from 'dotenv'
dotenv.config()

// const database = process.env.DATABASE
const database = process.env.DATABASE
const password = process.env.PASSWORD
const databaseUser = process.env.USER

export const connect = new Sequelize(database, databaseUser, password, {
    host: 'localhost', // Especifica o host do banco de dados
    dialect: 'mysql',
    logging: false
})

connect.sync({ force: false })
