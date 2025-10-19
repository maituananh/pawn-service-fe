import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/logo.png';
import { publicRoutes, privateRoutes } from '../router/router.config';
import { useAuth } from '../hooks/useAuth';
const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  const { isAuthenticated, role } = useAuth();
  const routes = isAuthenticated ? [...publicRoutes, ...privateRoutes] : publicRoutes;
  const menuItems = routes
    .filter(route =>
      route.showInMenu &&
      (!route.roles || route.roles.includes(role))
    )
    .map(route => ({
      key: route.path,
      label: <Link to={route.path}>{route.label}</Link>,
    }));

  if (!isAuthenticated) {
    menuItems.push({
      key: 'login',
      label: <Link to="/login">Đăng nhập</Link>,
    });
  }

  return (
    <Header
      // style={{
      //   backgroundColor: '#fff',
      //   padding: '0 24px',
      //   display: 'flex',
      //   alignItems: 'center',
      //   justifyContent: 'space-between',
      //   borderBottom: '1px solid #f0f0f0',
      //   height: 64,
      // }}
      className='bg-white flex-row align-center justify-between'
    >
      <div className="flex-centered">
        <img src={logoImage} alt="Logo Image" />
        <Title level={4} className="ml-4 mb-0">
          camdo<b>thaoquyen</b>
        </Title>
      </div>
      <Menu
        mode="horizontal"
        items={menuItems}
        className='flex-1'
      />
    </Header>
  );
};

export default AppHeader;
