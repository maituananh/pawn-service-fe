import useAuth from "@/hooks/useAuth";
import { privateRoutes, publicRoutes } from "@/router/router.config";
import { Layout } from "antd";
import { Link, Outlet } from "react-router-dom";
import AIAgent from "../components/AIAgent";
import AppFooter from "../components/Footer";
import AppHeader from "../components/Header";

const { Content } = Layout;

const MainLayout = () => {
    const { role } = useAuth();

    const menuItems = [...publicRoutes, ...privateRoutes]
        .filter(
            (route) =>
                route.showInMenu &&
                (!route.roles || route.roles.includes(role)) &&
                (!route.path.startsWith("/admin") || route.path === "/admin/dashboard")
        )
        .map((route) => ({
            key: route.path,
            label: <Link to={route.path}>{route.label}</Link>
        }));

    return (
        <div className="main-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppHeader menuItems={menuItems} />

            <Content className="main-content px-4" style={{ flex: 1 }}>
                <div className="site-layout-background">
                    <Outlet />
                </div>
            </Content>

            <AppFooter />
            <AIAgent />
        </div>
    );
};

export default MainLayout;
