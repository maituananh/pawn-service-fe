// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import authApi, { LoginPayload, LoginResponse, UserProfile } from '../api/authApi'; 

const AUTH_QUERY_KEY = ['currentUser'];

// ĐỊNH NGHĨA VÀ EXPORT KIỂU UserRole (Named Export)
export type UserRole = UserProfile['role']; 

interface UseAuthHook {
    currentUser: UserProfile | null;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => void;
    isLoadingLogin: boolean;
    logout: () => void;
    role: UserRole | undefined;
}

// HÀM HOOK (Default Export)
const useAuth = (): UseAuthHook => { 
    const queryClient = useQueryClient();
    
    const initialUser = queryClient.getQueryData<UserProfile>(AUTH_QUERY_KEY);
    const currentUser = initialUser ?? null;
    const isAuthenticated = !!localStorage.getItem('access_token') && !!currentUser;
    const role = currentUser?.role; 

    // Logic Đăng Nhập
    const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            const { access_token, user } = data; 
            localStorage.setItem('access_token', access_token);
            queryClient.setQueryData<UserProfile>(AUTH_QUERY_KEY, user); 
            message.success('Đăng nhập thành công!');
        },
        onError: (error) => {
            const errorMessage = (error as any)?.message || 'Lỗi không xác định. Vui lòng thử lại.';
            message.error(`Đăng nhập thất bại: ${errorMessage}`);
        },
    });
    
    // Logic Đăng Xuất
    const logout = () => {
        localStorage.removeItem('access_token');
        queryClient.setQueryData<UserProfile | null>(AUTH_QUERY_KEY, null); 
        queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
        message.info('Bạn đã đăng xuất.');
        window.location.href = "/login"; 
    };
    
    return {
        currentUser,
        isAuthenticated,
        login: loginMutation.mutate,
        isLoadingLogin: loginMutation.isPending,
        logout,
        role,
    };
};

export default useAuth;