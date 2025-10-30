import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { LoginPayload, LoginResponse, UserProfile } from '@/type/user.type';

const AUTH_QUERY_KEY = ['currentUser'];

const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: currentUser, isFetching } = useQuery<UserProfile>({
        queryKey: AUTH_QUERY_KEY,
        queryFn: authApi.getProfile,
        enabled: !!localStorage.getItem('access_token'),
        retry: false,
    });

    const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: authApi.login,
        onSuccess: async ({ accessToken, refreshToken, user }) => {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            queryClient.setQueryData<UserProfile>(AUTH_QUERY_KEY, user);
            console.log("user", user);
            try {
                const user = await authApi.getProfile();
                queryClient.setQueryData<UserProfile>(AUTH_QUERY_KEY, user);
                console.log("user", user);

                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } catch (error) {
                message.error('Không lấy được thông tin người dùng.');
            }
        },
        onError: error => {
            message.error(`Đăng nhập thất bại: ${(error as any)?.message || 'Lỗi không xác định.'}`);
        },
    });

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        queryClient.clear();
        navigate('/login');
    };

    return {
        currentUser: currentUser ?? null,
        isAuthenticated: !!localStorage.getItem('access_token'),
        // role: currentUser?.role,
        role: 'admin',
        login: loginMutation.mutateAsync,
        logout,
        isLoadingLogin: loginMutation.isPending || isFetching,
    };
};

export default useAuth;
