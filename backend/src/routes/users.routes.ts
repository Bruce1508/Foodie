import { Request, Response, Router } from 'express';
import pool from '../config/database';
import { ApiResponse, CreateUserRequest, User } from '../types';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');

        const response: ApiResponse<User[]> = {
            success: true,
            data: result.rows
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const response: ApiResponse<User> = {
            success: true,
            data: result.rows[0]
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
});

// Create new user
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email }: CreateUserRequest = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                error: 'Name and email are required'
            });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        const response: ApiResponse<User> = {
            success: true,
            data: result.rows[0],
            message: 'User created successfully'
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        });
    }
});

export default router;