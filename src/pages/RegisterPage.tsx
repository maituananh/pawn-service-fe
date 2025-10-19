import UserAuthForm from "@/components/UserAuthForm";

const RegisterPage = () => {
  const handleRegister = (values: any) => {
    console.log('Register:', values);
  };

  const handleRegisterGoogle = () => {
    console.log('handleRegisterGoogle');
  };

  const handleRegisterFacebook = () => {
    console.log('handleRegisterFacebook');
  };
  return <UserAuthForm mode="register" onSubmit={handleRegister} handleRegisterGoogle={handleRegisterGoogle} handleRegisterFacebook={handleRegisterFacebook} />;
};

export default RegisterPage;
