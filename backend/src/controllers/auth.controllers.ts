import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { connectDB } from '../config/database';
import { GoogleAuthRequest, GoogleUserInfo, AuthResponse, User } from '../types';

// **CẦN THAY ĐỔI**: Lấy từ environment variables
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // For server-side flow
);

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthController {
    // Google OAuth callback
    static async googleAuth(req: Request, res: Response) {
        try {
            const { code, redirectUri }: GoogleAuthRequest = req.body;

            if (!code) {
                return res.status(400).json({
                    success: false,
                    error: 'Authorization code is required'
                });
            }

            // Exchange authorization code for tokens
            const { tokens } = await googleClient.getToken({
                code,
                redirect_uri: redirectUri
            });

            if (!tokens.id_token) {
                return res.status(400).json({
                    success: false,
                    error: 'No ID token received from Google'
                });
            }

            // Verify the ID token and get user info
            const ticket = await googleClient.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            
            if (!payload) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid token payload'
                });
            }

            const googleUserInfo: GoogleUserInfo = {
                id: payload.sub!,
                email: payload.email!,
                verified_email: payload.email_verified!,
                name: payload.name!,
                given_name: payload.given_name!,
                family_name: payload.family_name!,
                picture: payload.picture!
            };

            // Find or create user in database
            const user = await AuthController.findOrCreateUser(googleUserInfo);

            // Generate JWT token
            const jwtToken = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email,
                    googleId: user.google_id 
                },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            const response: AuthResponse = {
                success: true,
                user,
                token: jwtToken,
                message: 'Authentication successful'
            };

            res.json(response);

        } catch (error) {
            console.error('Google auth error:', error);
            res.status(500).json({
                success: false,
                error: 'Authentication failed. Please try again.'
            });
        }
    }

    // Find existing user or create new one
    private static async findOrCreateUser(googleUserInfo: GoogleUserInfo): Promise<User> {
        const db = await connectDB();

        try {
            // First, try to find user by Google ID
            let result = await db.query(
                'SELECT * FROM users WHERE google_id = $1',
                [googleUserInfo.id]
            );

            if (result.rows.length > 0) {
                // User exists, update their info
                result = await db.query(`
                    UPDATE users 
                    SET name = $1, email = $2, picture = $3, email_verified = $4, updated_at = CURRENT_TIMESTAMP
                    WHERE google_id = $5
                    RETURNING *
                `, [
                    googleUserInfo.name,
                    googleUserInfo.email,
                    googleUserInfo.picture,
                    googleUserInfo.verified_email,
                    googleUserInfo.id
                ]);

                return result.rows[0];
            }

            // Check if user exists with the same email (from different auth method)
            result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [googleUserInfo.email]
            );

            if (result.rows.length > 0) {
                // User exists with same email, link Google account
                result = await db.query(`
                    UPDATE users 
                    SET google_id = $1, name = $2, picture = $3, email_verified = $4, updated_at = CURRENT_TIMESTAMP
                    WHERE email = $5
                    RETURNING *
                `, [
                    googleUserInfo.id,
                    googleUserInfo.name,
                    googleUserInfo.picture,
                    googleUserInfo.verified_email,
                    googleUserInfo.email
                ]);

                return result.rows[0];
            }

            // Create new user
            result = await db.query(`
                INSERT INTO users (google_id, name, email, picture, email_verified)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [
                googleUserInfo.id,
                googleUserInfo.name,
                googleUserInfo.email,
                googleUserInfo.picture,
                googleUserInfo.verified_email
            ]);

            return result.rows[0];

        } finally {
            db.release();
        }
    }

    // Verify JWT token middleware
    static async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET) as any;
            req.user = decoded;
            next();

        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
    }

    // Get current user info
    static async getCurrentUser(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }

            const db = await connectDB();

            try {
                const result = await db.query(
                    'SELECT id, name, email, picture, email_verified, created_at, updated_at FROM users WHERE id = $1',
                    [userId]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                }

                res.json({
                    success: true,
                    data: result.rows[0]
                });

            } finally {
                db.release();
            }

        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user information'
            });
        }
    }

    // Sign out (optional - mainly for client-side cleanup)
    static async signOut(req: Request, res: Response) {
        // In a stateless JWT setup, signout is mainly handled client-side
        // But you could implement token blacklisting here if needed
        res.json({
            success: true,
            message: 'Signed out successfully'
        });
    }
} 