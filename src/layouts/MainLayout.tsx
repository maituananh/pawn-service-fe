import { Layout } from 'antd';
import AppHeader from '../components/Header';
import AppFooter from '../components/Footer';
import { Link, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { privateRoutes, publicRoutes } from '@/router/router.config';

const { Content } = Layout;

const MainLayout = () => {
  const { role } = useAuth();
  const menuItems = [...publicRoutes, ...privateRoutes]
    .filter(route =>
      route.showInMenu &&
      (!route.roles || route.roles.includes(role))
    )
    .map(route => ({
      key: route.path,
      label: <Link to={route.path}>{route.label}</Link>,
    }));
  return (
    <Layout className="main-layout">
      <AppHeader menuItems={menuItems} />
      <Content className="main-content px-4">
        <div className="site-layout-background"><Outlet /></div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;