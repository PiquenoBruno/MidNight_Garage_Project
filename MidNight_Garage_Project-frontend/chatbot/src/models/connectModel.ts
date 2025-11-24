import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config()

export const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '8642B.f.t13062005',
    database: 'garage'
})