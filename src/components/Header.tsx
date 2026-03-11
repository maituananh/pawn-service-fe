// [UI ONLY] Redesigned AppHeader for a premium fintech feel
import useAuth from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { MenuOutlined, LogoutOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Typography, Flex, theme, Badge, type MenuProps } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.png';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ menuItems }: { menuItems: MenuProps['items'] }) => {
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  const handleMenuClick = () => {
    closeDrawer();
  };

  return (
    <Header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        padding: '0 24px',
        height: 64,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid rgba(0, 0, 0, 0.05)`,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}
    >
      <Flex align="center" justify="space-between" style={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>
        {/* [UI ONLY] Enhanced Logo Section */}
        <Flex align="center" gap={12} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ 
            background: '#fff', 
            padding: '6px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={logoImage} alt="Logo" style={{ height: 28, width: 'auto' }} />
          </div>
          <Text style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            camdo<span style={{ color: token.colorPrimary }}>ThảoQuyên</span>
          </Text>
        </Flex>

        {/* [UI ONLY] Premium Desktop Navigation */}
        <Flex gap={8} align="center" className="desktop-menu" style={{ flex: 1, justifyContent: 'center' }}>
          {menuItems?.map((item: any) => {
            const isActive = location.pathname === item.key;
            const isDashboard = item.key === '/admin/dashboard';
            
            return (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? (isDashboard ? token.colorPrimary : 'rgba(0, 0, 0, 0.04)') : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                }}
                className="nav-item-hover"
              >
                <Text 
                  style={{ 
                    fontSize: 14, 
                    fontWeight: isActive ? 600 : 500, 
                    color: isActive ? (isDashboard ? '#fff' : token.colorPrimary) : 'rgba(0, 0, 0, 0.65)',
                    transition: 'color 0.3s'
                  }}
                >
                  {item.label?.props?.children || item.label}
                </Text>
              </div>
            );
          })}
        </Flex>

        {/* [UI ONLY] Refined Auth Section */}
        <Flex align="center" gap={16}>
          {isAuthenticated && (
            <Badge count={cart?.length || 0} offset={[-4, 4]}>
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined style={{ fontSize: 20, color: 'rgba(0,0,0,0.65)' }} />} 
                onClick={() => navigate('/mycart')}
                style={{ 
                  borderRadius: '50%', 
                  width: 40, 
                  height: 40, 
                  background: 'rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                className="cart-button-hover"
              />
            </Badge>
          )}

          <div className="desktop-menu">
            {isAuthenticated ? (
              <Button 
                type="text"
                onClick={handleLogout} 
                icon={<LogoutOutlined style={{ fontSize: 16 }} />}
                style={{ 
                  borderRadius: '10px', 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.65)',
                  background: 'rgba(0,0,0,0.03)'
                }}
              >
                Đăng xuất
              </Button>
            ) : (
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
                style={{ 
                  borderRadius: '10px', 
                  height: 40, 
                  padding: '0 24px', 
                  fontWeight: 700, 
                  fontSize: 14,
                  boxShadow: `0 4px 14px ${token.colorPrimary}40`
                }}
              >
                Đăng nhập
              </Button>
            )}
          </div>

          <Button
            className="mobile-menu-icon"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={showDrawer}
            style={{ display: 'none' }} 
          />
        </Flex>
      </Flex>

      <Drawer
        title={
          <Flex align="center" gap={8}>
            <img src={logoImage} alt="Logo" style={{ height: 32 }} />
            <Text strong style={{ whiteSpace: 'nowrap' }}>camdo Thảo Quyên</Text>
          </Flex>
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={280}
        styles={{ body: { padding: '12px 0' } }}
      >
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
        <div style={{ padding: '24px 16px' }}>
          {isAuthenticated ? (
            <Button 
              danger 
              onClick={handleLogout} 
              icon={<LogoutOutlined />}
              style={{ width: '100%', height: 44, borderRadius: 10 }}
            >
              Đăng xuất
            </Button>
          ) : (
            <Button 
              type="primary" 
              onClick={() => { navigate('/login'); closeDrawer(); }} 
              icon={<LoginOutlined />}
              style={{ width: '100%', height: 44, borderRadius: 10, fontWeight: 600 }}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </Drawer>
    </Header>
  );
};

export default AppHeader;