import useAuth from "@/hooks/useAuth";
import { privateRoutes, publicRoutes } from "@/router/router.config";
import { Layout } from "antd";
import { Link, Outlet } from "react-router-dom";
import AppFooter from "../components/Footer";
import AppHeader from "../components/Header";

const { Content } = Layout;

const MainLayout = () => {
  const { role } = useAuth();
  const menuItems = [...publicRoutes, ...privateRoutes]
    .filter(
      (route) =>
        route.showInMenu && (!route.roles || route.roles.includes(role))
    )
    .map((route) => ({
      key: route.path,
      label: <Link to={route.path}>{route.label}</Link>,
    }));

  return (
    <Layout className="main-layout">
      <AppHeader menuItems={menuItems} />

      <Content className="main-content px-4">
        <div className="site-layout-background">
          <Outlet />
        </div>
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
