// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import UserAuthForm from '../components/UserAuthForm';
import useAuth from '../hooks/useAuth';
import { LoginPayload } from '../api/authApi';

const LoginPage = () => {
  // Lấy các hàm và trạng thái cần thiết từ hook
  const { login, isLoadingLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Chuyển hướng nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to /dashboard...');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Xử lý Form Submit: Gọi hàm login từ hook
  const handleLogin = (values: LoginPayload) => {
    console.log('--- ĐÃ GỌI API LOGIN VỚI DATA:', values.username);
    // Hàm này kích hoạt useMutation để gọi API /auth/token
    login(values);
  };

  // Xử lý Social Login (Dummy)
  const handleLoginGoogle = () => {
    console.log('Redirecting to Google Auth...');
  };

  const handleLoginFacebook = () => {
    console.log('Redirecting to Facebook Auth...');
  };

  // Nếu đã xác thực, hiển thị spinner khi chuyển hướng
  if (isAuthenticated && !isLoadingLogin) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <Spin size="large" />
        <p>Đã đăng nhập, đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <UserAuthForm
      mode="login"
      onSubmit={handleLogin} // Truyền hàm xử lý đăng nhập
      handleLoginGoogle={handleLoginGoogle}
      handleLoginFacebook={handleLoginFacebook}
      isLoading={isLoadingLogin} // Truyền trạng thái loading
    />
  );
};

export default LoginPage;