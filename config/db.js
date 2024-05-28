import pkg from 'pg';
import 'dotenv/config';
process.loadEnvFile

const { Pool } = pkg;
const { DB_USER, DB_PASS, DB_DATABASE, DB_HOST } = process.env;

const config = {
    user: DB_USER,
    password: DB_PASS,
    database: DB_DATABASE,
    host: DB_HOST,
    allowExitOnIdle: true
}

const pool = new Pool(config);

/*/ TEST
const getData = async () => {
    const response = await pool.query('SELECT NOW()');
    console.log(response);
}

getData();*/

export default pool;