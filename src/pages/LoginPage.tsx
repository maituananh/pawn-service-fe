import UserAuthForm from '../components/UserAuthForm';

const LoginPage = () => {
  const handleLogin = (values: any) => {
    console.log('Login:', values);
  };

  const handleLoginGoogle = () => {
    console.log('handleLoginGoogle');
  };

  const handleLoginFacebook = () => {
    console.log('handleLoginFacebook');
  };

  return <UserAuthForm mode="login" onSubmit={handleLogin} handleLoginGoogle={handleLoginGoogle} handleLoginFacebook={handleLoginFacebook} />;
};

export default LoginPage;