// src/api/axiosClient.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

export type CustomAxiosInstance = AxiosInstance & {
    get: <T = any>(url: string, config?: any) => Promise<T>; 
    post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    delete: <T = any>(url: string, config?: any) => Promise<T>;
};

const axiosClient: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
        accept: "*/*"
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (res: AxiosResponse<any>) => res.data, 
    (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
            console.error("Token invalid or expired. Logging out...");
            localStorage.removeItem("access_token");
        }
        return Promise.reject(error.response?.data || error); 
    }
);

export default axiosClient as CustomAxiosInstance;