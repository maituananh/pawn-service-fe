import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import authApi from './authApi';
export type CustomAxiosInstance = AxiosInstance & {
    get: <T = any>(url: string, config?: any) => Promise<T>;
    post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    delete: <T = any>(url: string, config?: any) => Promise<T>;
};
const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
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

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosClient(originalRequest);
                });
            }

            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');

                const { accessToken, refreshToken: newRefreshToken } = await authApi.refreshToken(refreshToken);
                localStorage.setItem('access_token', accessToken);
                if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

                processQueue(null, accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// axiosClient.interceptors.response.use(
//     (res: AxiosResponse<any>) => res.data,
//     (error: AxiosError<any>) => {
//         if (error.response?.status === 401) {
//             console.error("Token invalid or expired. Logging out...");
//             localStorage.removeItem("access_token");
//         }
//         return Promise.reject(error.response?.data || error);
//     }
// );

export default axiosClient as CustomAxiosInstance;
