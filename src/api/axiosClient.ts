import axios, { AxiosError, AxiosInstance } from 'axios';
import { notification } from 'antd';
import authApi from './authApi';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const REFRESH_URL = import.meta.env.VITE_API_REFRESH_URL || '';

export type CustomAxiosInstance = AxiosInstance & {
    get: <T = any>(url: string, config?: any) => Promise<T>;
    post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    delete: <T = any>(url: string, config?: any) => Promise<T>;
};

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const axiosRefresh = axios.create({
    baseURL: REFRESH_URL,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(p => {
        if (error) p.reject(error);
        else p.resolve(token!);
    });
    failedQueue = [];
};

axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined' && config.url !== '/auth/refresh-token') {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    res => res,
    async (error: AxiosError & { config?: any }) => {
        const originalRequest = error.config;

        // Extract error message from response
        const errorData = error.response?.data as any;
        const errorMessage = errorData?.message || errorData?.error || error.message || 'Lỗi hệ thống, vui lòng thử lại sau';

        // Show global error notification at bottom left
        // Skip notification only for the FIRST 401/403 attempt so we can try silenty refreshing token
        const isAuthError = error.response?.status === 401 || error.response?.status === 403;
        const isFirstAttempt = !originalRequest?._retry;

        if (!isAuthError || !isFirstAttempt) {
            notification.error({
                message: 'Phát hiện lỗi!',
                description: errorMessage,
                placement: 'bottomLeft',
                duration: 4,
            });
        }

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');

                const response = await authApi.refreshToken(refreshToken);
                const { accessToken, refreshToken: newRefreshToken } = response;

                if (!accessToken) throw new Error('No access token returned');

                localStorage.setItem('access_token', accessToken);
                if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

                processQueue(null, accessToken);

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (err) {
                console.error('❌ Refresh token failed, logging out...');
                processQueue(err, null);

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                // Show notification for authentication failure
                notification.warning({
                    message: 'Phiên làm việc hết hạn',
                    description: 'Vui lòng đăng nhập lại.',
                    placement: 'bottomLeft',
                });

                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient as CustomAxiosInstance;
