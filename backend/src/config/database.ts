import dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export const connectDB = async (): Promise<PoolClient> => {
    try {
        const client = await pool.connect();
        console.log('Connected to the PostgreSQL database successfully');
        return client;
    } catch (error) {
        console.error('Error with the PostgreSQL database connection', error);
        throw error;
    }
};

// Test connection function
export const testConnection = async () => {
    try {
        const client = await connectDB();
        await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection test successful');
    } catch (error) {
        console.error('Database connection test failed:', error);
    }
};

export default pool;