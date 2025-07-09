export interface User {
    id: string; // UUID
    google_id?: string;
    name: string;
    email: string;
    picture?: string;
    email_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserRequest {
    google_id: string;
    name: string;
    email: string;
    picture?: string;
    email_verified?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface GoogleAuthRequest {
    code: string;
    redirectUri: string;
}

export interface GoogleTokenResponse {
    access_token: string;
    id_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token?: string;
}

export interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export interface AuthResponse {
    success: boolean;
    user: User;
    token: string;
    message?: string;
}

export interface UserSession {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    created_at: Date;
}

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                name: string;
                googleId?: string;
            };
        }
    }
}