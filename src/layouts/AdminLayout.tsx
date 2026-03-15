// [UI ONLY] Redesigned AdminLayout with fixed 220px sidebar and modern fintech aesthetic
import AIAgent from "@/components/AIAgent";
import useAuth from "@/hooks/useAuth";
import { privateRoutes } from "@/router/router.config";
import {
  AppstoreOutlined,
  LogoutOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Input,
  Layout,
  Menu,
  Typography,
  theme,
} from "antd";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/images/logo.png";
import { getImageUrl } from "@/lib/imageUtils";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = privateRoutes
  .filter((route) => route.showInMenu && route.roles?.includes("ADMIN") && route.path.startsWith('/admin'))
  .map((route) => ({
    key: route.path,
    icon: {
      "/admin/dashboard": <AppstoreOutlined />,
      "/admin/products": <ShoppingOutlined />,
      "/admin/customers": <UserOutlined />,
      "/admin/categories": <TagsOutlined />,
      "/admin/orders": <ShoppingCartOutlined />,
    }[route.path] || <QuestionCircleOutlined />,
    label: route.label,
  }));

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { isAuthenticated, logout, currentUser } = useAuth();
  const { token } = theme.useToken();

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

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ của tôi",
      icon: <UserOutlined />,
      onClick: () => navigate("/my-profile"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        {/* [UI ONLY] Fixed 220px Sider with custom styling */}
        <Sider
          theme="light"
          width={260}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={80}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            zIndex: 1000,
          }}
        >
          <Flex vertical gap={24} style={{ height: "100%", paddingBottom: 24 }}>
            <div style={{ padding: "24px 24px 12px" }}>
              <Flex
                align="center"
                gap={12}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                <img
                  src={logoImage}
                  alt="Logo"
                  style={{ height: 36, width: "auto", objectFit: "contain" }}
                />
                {!collapsed && (
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      margin: 0,
                      letterSpacing: "-0.03em",
                      color: "#1a1a1a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Camdo
                    <span
                      style={{ color: token.colorPrimary, fontWeight: 900 }}
                    >
                      TQ
                    </span>
                  </Text>
                )}
              </Flex>
            </div>

            <Menu
              mode="inline"
              selectedKeys={activeMenuKey}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ borderInlineEnd: "none", flexGrow: 1 }}
            />

            <div style={{ padding: "0 16px" }}>
              <Dropdown menu={{ items: userMenuItems }} placement="topRight">
                <Flex
                  align="center"
                  gap={12}
                  style={{
                    padding: "12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "background 0.3s",
                    background: token.colorBgTextHover,
                  }}
                >
                  <Avatar
                    size={40}
                    src={getImageUrl(currentUser?.avatar) || `https://ui-avatars.com/api/?name=${currentUser?.name || "User"}&background=random`}
                  />
                  {!collapsed && (
                    <Flex vertical style={{ overflow: "hidden" }}>
                      <Text strong style={{ fontSize: 14 }}>
                        {currentUser?.name || "Admin"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                        {currentUser?.role || "Manager"}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Dropdown>
            </div>
          </Flex>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 260,
            transition: "margin-left 0.2s",
            background: token.colorBgLayout,
          }}
        >
          <Header
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "saturate(180%) blur(20px)",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 999,
              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
              height: 64,
            }}
          >
            <Flex align="center" gap={16} style={{ flexGrow: 1 }}>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={showDrawer}
                className="lg-hidden"
                style={{ display: "none" }} // Show only on small screens via CSS or conditional rendering
              />
              <Title
                level={4}
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Xin chào {currentUser?.name || "Admin"} 👋
              </Title>
            </Flex>

            <Flex align="center" gap={16}>
              <Input
                placeholder="Tìm kiếm..."
                prefix={
                  <SearchOutlined
                    style={{ color: token.colorTextTertiary, marginRight: 4 }}
                  />
                }
                style={{
                  width: 280,
                  borderRadius: 12,
                  background: "rgba(0, 0, 0, 0.04)",
                  border: "none",
                  height: 40,
                  fontSize: 14,
                }}
              />
            </Flex>
          </Header>

          <Content
            style={{
              margin: "24px",
              minHeight: 280,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <AIAgent />

      <Drawer
        title={
          <Flex align="center" gap={8}>
            <img src={logoImage} alt="Logo" style={{ height: 24 }} />
            <Text strong>Cầmđồ Thảo Quyên</Text>
          </Flex>
        }
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={activeMenuKey}
          items={menuItems}
          onClick={(e) => {
            handleMenuClick(e);
            closeDrawer();
          }}
          style={{ borderInlineEnd: "none" }}
        />
        <div style={{ padding: 16 }}>
          <Button danger block icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default AdminLayout;
