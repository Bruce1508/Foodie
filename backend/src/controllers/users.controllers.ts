// import { Request, Response } from "express";
// import pool from "../config/database";
// import { ApiResponse, User } from "../types";

// export const handleGetUsers = async (req: Request, res: Response) => {
//     try {
//         const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
//         const response: ApiResponse<User[]> = {
//             success: true,
//             data: result.rows
//         }
//         res.json(response);
//     } catch (error: any) {
//         console.error('Error fetching users in handleGetUsers', error);
//         res.status(500).json({
//             success: false,
//             error: 'Internal server error in handleGetUsers'
//         });
//     }
// }

// export const handel