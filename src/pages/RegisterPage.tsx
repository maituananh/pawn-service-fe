import UserAuthForm from "@/components/UserAuthForm";

const RegisterPage = () => {
    const handleRegister = (values: any) => {
        console.info("Register:", values);
    };

    const handleRegisterGoogle = () => {
        console.info("handleRegisterGoogle");
    };

    const handleRegisterFacebook = () => {
        console.info("handleRegisterFacebook");
    };
    return (
        <UserAuthForm
            mode="register"
            onSubmit={handleRegister}
            handleRegisterGoogle={handleRegisterGoogle}
            handleRegisterFacebook={handleRegisterFacebook}
            isLoading={false}
        />
    );
};

export default RegisterPage;
