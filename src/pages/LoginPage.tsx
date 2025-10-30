import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import UserAuthForm from '../components/UserAuthForm';
import useAuth from '../hooks/useAuth';
import { LoginPayload } from '@/type/user.type';

const LoginPage = () => {
  const { login, isLoadingLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  const handleLogin = (values: LoginPayload) => {
    login(values);
  };

  const handleLoginGoogle = () => {
    console.log('Redirecting to Google Auth...');
  };

  const handleLoginFacebook = () => {
    console.log('Redirecting to Facebook Auth...');
  };

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
      onSubmit={handleLogin}
      handleLoginGoogle={handleLoginGoogle}
      handleLoginFacebook={handleLoginFacebook}
      isLoading={isLoadingLogin}
    />
  );
};

export default LoginPage;