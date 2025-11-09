import { LoginPayload, LoginResponse, UserProfile } from '@/type/user.type';
import axiosClient, { axiosRefresh } from './axiosClient';

const authApi = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const res = await axiosClient.post('/auth/token', payload);
        return res.data;
    },

    logout: async (): Promise<void> => {
        await axiosClient.post('/auth/logout');
    },

    getProfile: async (): Promise<UserProfile> => {
        const res = await axiosClient.get('/users/me');
        return res.data;
    },

    updateProfile: async (payload: Partial<UserProfile>): Promise<UserProfile> => {
        const { data } = await axiosClient.put<UserProfile>('/users/me', payload);
        return data;
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
        const res = await axiosRefresh.post('/auth/refresh-token', { refreshToken }, { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data;
    },
};

export default authApi;
