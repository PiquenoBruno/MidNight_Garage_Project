import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config()

export const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ra100630029.',
    database: 'garage'
})