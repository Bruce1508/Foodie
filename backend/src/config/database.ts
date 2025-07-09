import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to the PostgreSQL database successfully');
    } catch (error) {
        console.error('Error with the PostgreSQL database connection', error);
    }
};

export default pool;