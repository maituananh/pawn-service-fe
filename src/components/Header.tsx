// [UI ONLY] Redesigned AppHeader for a premium fintech feel
import useAuth from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { LoginOutlined, LogoutOutlined, MenuOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Dropdown, Flex, Layout, Menu, theme, Typography, type MenuProps } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/images/logo.png";
import { getImageUrl } from "@/lib/imageUtils";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ menuItems }: { menuItems: MenuProps["items"] }) => {
    const { isAuthenticated, logout, currentUser } = useAuth();
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
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                height: 64,
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "saturate(180%) blur(20px)",
                borderBottom: `1px solid rgba(0, 0, 0, 0.05)`,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
            }}
        >
            <Flex align="center" justify="space-between" style={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
                {/* [UI ONLY] Enhanced Logo Section */}
                <Flex align="center" gap={12} style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                    <img src={logoImage} alt="Logo" style={{ height: 80, width: 63 }} />
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: 900,
                            margin: 0,
                            letterSpacing: "-0.03em",
                            color: "#1a1a1a"
                        }}
                    >
                        Camdo
                        <span style={{ color: token.colorPrimary, fontWeight: 900 }}>Thảo Quyên</span>
                    </Text>
                </Flex>

                {/* [UI ONLY] Premium Desktop Navigation */}
                <Flex gap={8} align="center" className="desktop-menu" style={{ flex: 1, justifyContent: "center" }}>
                    {menuItems?.map((item: any) => {
                        const isActive = location.pathname === item.key;
                        const isDashboard = item.key === "/admin/dashboard";

                        return (
                            <div
                                key={item.key}
                                onClick={() => navigate(item.key)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    background: isActive
                                        ? isDashboard
                                            ? token.colorPrimary
                                            : "rgba(0, 0, 0, 0.04)"
                                        : "transparent",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                className="nav-item-hover"
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive
                                            ? isDashboard
                                                ? "#fff"
                                                : token.colorPrimary
                                            : "rgba(0, 0, 0, 0.65)",
                                        transition: "color 0.3s"
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
                                icon={<ShoppingCartOutlined style={{ fontSize: 20, color: "rgba(0,0,0,0.65)" }} />}
                                onClick={() => navigate("/mycart")}
                                style={{
                                    borderRadius: "50%",
                                    width: 40,
                                    height: 40,
                                    background: "rgba(0,0,0,0.04)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease"
                                }}
                                className="cart-button-hover"
                            />
                        </Badge>
                    )}

                    <div className="desktop-menu">
                        {isAuthenticated ? (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "profile",
                                            label: "Hồ sơ của tôi",
                                            icon: <UserOutlined />,
                                            onClick: () => navigate("/my-profile")
                                        },
                                        {
                                            key: "logout",
                                            label: "Đăng xuất",
                                            icon: <LogoutOutlined />,
                                            danger: true,
                                            onClick: handleLogout
                                        }
                                    ]
                                }}
                                placement="bottomRight"
                                arrow
                            >
                                <Flex
                                    align="center"
                                    gap={8}
                                    style={{
                                        cursor: "pointer",
                                        padding: "4px 12px",
                                        borderRadius: "12px",
                                        background: "rgba(0,0,0,0.03)",
                                        transition: "all 0.3s ease"
                                    }}
                                    className="user-profile-hover"
                                >
                                    <Avatar
                                        size="small"
                                        src={
                                            getImageUrl(currentUser?.avatar) ||
                                            `https://ui-avatars.com/api/?name=${currentUser?.name || "User"}&background=random`
                                        }
                                        icon={<UserOutlined />}
                                    />
                                    <Text strong style={{ fontSize: 13 }}>
                                        {currentUser?.name?.split(" ").pop() || "Tài khoản"}
                                    </Text>
                                </Flex>
                            </Dropdown>
                        ) : (
                            <Button
                                type="primary"
                                icon={<LoginOutlined />}
                                onClick={() => navigate("/login")}
                                style={{
                                    borderRadius: "10px",
                                    height: 40,
                                    padding: "0 24px",
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
                        style={{ display: "none" }}
                    />
                </Flex>
            </Flex>

            <Drawer
                title={
                    <Flex align="center" gap={12}>
                        <img src={logoImage} alt="Logo" style={{ height: 32, width: "auto", objectFit: "contain" }} />
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 800,
                                textTransform: "lowercase"
                            }}
                        >
                            Camdo<span style={{ color: token.colorPrimary }}>Thảo Quyên</span>
                        </Text>
                    </Flex>
                }
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
                width={280}
                styles={{ body: { padding: "12px 0" } }}
            >
                <Menu
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[location.pathname]}
                    onClick={handleMenuClick}
                    style={{ border: "none" }}
                />
                <div style={{ padding: "24px 16px" }}>
                    {isAuthenticated ? (
                        <Button
                            danger
                            onClick={handleLogout}
                            icon={<LogoutOutlined />}
                            style={{ width: "100%", height: 44, borderRadius: 10 }}
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
                            icon={<LoginOutlined />}
                            style={{
                                width: "100%",
                                height: 44,
                                borderRadius: 10,
                                fontWeight: 600
                            }}
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
