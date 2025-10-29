import useAuth from '@/hooks/useAuth';
import { MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Typography, type MenuProps } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.png';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = ({ menuItems }: { menuItems: MenuProps['items'] }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  const handleMenuClick = () => {
    closeDrawer();
  };


  return (
    <Header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <img src={logoImage} alt="Logo" className="logo-image" />
          <Title level={4} className="logo-title">
            camdo<b>thaoquyen</b>
          </Title>
        </div>
        <div className="menu-container desktop-menu">
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[location.pathname]}
            className="header-menu"
          />
        </div>
        <div className="auth-section">
          {isAuthenticated ? (
            <Button onClick={handleLogout}>Đăng xuất</Button>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          )}
        </div>
        <Button
          className="mobile-menu-icon"
          type="text"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        />
        <Drawer
          title="Menu"
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          className="mobile-drawer"
        >
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
          />
          <div className="drawer-auth-section">
            {isAuthenticated ? (
              <Button onClick={handleLogout} style={{ width: '100%', marginTop: '16px' }}>Đăng xuất</Button>
            ) : (
              <Button type="primary" onClick={() => { navigate('/login'); closeDrawer(); }} style={{ width: '100%', marginTop: '16px' }}>
                Đăng nhập
              </Button>
            )}
          </div>
        </Drawer>
      </div>
    </Header>
  );
};

export default AppHeader;