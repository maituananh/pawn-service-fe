import { LoginPayload } from "@/type/user.type";
import { Spin } from "antd";
import UserAuthForm from "../components/UserAuthForm";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
    const { login, isLoadingLogin, isAuthenticated } = useAuth();

    // useEffect(() => {
    //   if (isAuthenticated) {
    //     navigate('/', { replace: true });
    //   }
    // }, [isAuthenticated, navigate]);

    const handleLogin = (values: LoginPayload) => {
        login(values).catch(() => {
            // Error managed by useAuth's onError
        });
    };

    const handleLoginGoogle = () => {
        console.info("Redirecting to Google Auth...");
    };

    const handleLoginFacebook = () => {
        console.info("Redirecting to Facebook Auth...");
    };

    if (isAuthenticated && !isLoadingLogin) {
        return (
            <div style={{ padding: 50, textAlign: "center" }}>
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
