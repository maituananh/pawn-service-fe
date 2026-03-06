import useAuth from "@/hooks/useAuth";
import { privateRoutes } from "@/router/router.config";
import {
  AppstoreOutlined,
  DownOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Input, Layout, Menu, Typography } from "antd";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/images/logo.png";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = privateRoutes
  .filter((route) => route.showInMenu && route.roles?.includes("ADMIN"))
  .map((route) => ({
    key: route.path,
    icon: {
      "/admin/dashboard": <AppstoreOutlined />,
      "/admin/products": <ShoppingOutlined />,
      "/admin/customers": <UserOutlined />,
      "/admin/categories": <TagsOutlined />,
    }[route.path] || <QuestionCircleOutlined />,
    label: route.label,
  }));

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const activeMenuKey = useMemo(() => {
    const matchingPath = menuItems
      .map((item) => item.key as string)
      .sort((a, b) => b.length - a.length)
      .find((key) => location.pathname.startsWith(key));

    return matchingPath ? [matchingPath] : [];
  }, [location.pathname]);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const handleLogout = () => {
    logout();
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <Layout
      className={`admin-layout ${collapsed ? "admin-layout-collapsed" : ""}`}
    >
      <Sider
        theme="light"
        className="admin-sider"
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth={80}
      >
        <div className="sider-content">
          <div className="logo-section">
            <img src={logoImage} alt="Logo" className="logo-image" />
            {!collapsed && (
              <Title level={4} className="logo-title">
                camdo<b>TQ</b>
              </Title>
            )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={activeMenuKey}
            items={menuItems}
            className="admin-menu"
            onClick={handleMenuClick}
          />
          <div className="flex-centered">
            {isAuthenticated ? (
              <Button onClick={handleLogout}>Đăng xuất</Button>
            ) : (
              <Button type="primary" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            )}
          </div>
          <div
            className={`user-profile-section ${collapsed ? "user-profile-collapsed" : ""}`}
          >
            <Avatar size={40} src="https://i.pravatar.cc/150?u=evano" />
            {!collapsed && (
              <>
                <div className="user-info">
                  <Text strong>Evano</Text>
                  <Text type="secondary">Project Manager</Text>
                </div>
                <DownOutlined />
              </>
            )}
          </div>
        </div>
      </Sider>
      <Layout className="admin-main-layout">
        <Header className="admin-header">
          <Button
            className="mobile-menu-icon"
            type="text"
            icon={<MenuOutlined />}
            onClick={showDrawer}
          />
          <div className="mobile-logo-section">
            <img src={logoImage} alt="Logo" className="logo-image" />
            <Title level={4} className="logo-title">
              camdo<b>TQ</b>
            </Title>
          </div>
          <div className="desktop-header-content">
            <Title level={4}>Xin chào Evano 👋,</Title>
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              className="search-input"
            />
          </div>
        </Header>
        <Content className="admin-content">
          <div className="site-layout-background">
            <Outlet />
          </div>
        </Content>
      </Layout>
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        className="mobile-drawer"
      >
        <Menu
          mode="inline"
          selectedKeys={activeMenuKey}
          items={menuItems}
          onClick={handleMenuClick}
        />
        <div className="drawer-auth-section">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              style={{ width: "100%", marginTop: "16px" }}
            >
              Đăng xuất
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                navigate("/login");
                closeDrawer();
              }}
              style={{ width: "100%", marginTop: "16px" }}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </Drawer>
    </Layout>
  );
};

export default AdminLayout;
