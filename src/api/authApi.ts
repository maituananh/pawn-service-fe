// src/api/authApi.ts
import axiosClient from "./axiosClient"; 

// --- Định nghĩa Interfaces (CẦN EXPORT) ---
export interface UserProfile {
    id: number;
    username: string; 
    email: string;
    role: 'admin' | 'user' | 'guest'; // Khắc phục lỗi 'role'
}

export interface LoginPayload {
    username: string; // Khắc phục lỗi LoginPayload
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: UserProfile; 
}

// --- Auth API Service ---
const authApi = {
    async login(payload: LoginPayload): Promise<LoginResponse> {
        const responseData = await axiosClient.get<LoginResponse>("/products", payload);
        return responseData as unknown as LoginResponse; 
    },
    
    async getProfile(): Promise<UserProfile> {
        const responseData = await axiosClient.get<UserProfile>("/auth/profile");
        return responseData as unknown as UserProfile;
    }
};

export default authApi;