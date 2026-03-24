import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/type/cart.type";
import { Button, Checkbox, Empty, Flex, Space, Spin, Tag, Typography, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const CartPage = () => {
    const { cart, isLoading, removeItem, cartTotal } = useCart() as {
        cart: CartItem[];
        isLoading: boolean;
        removeItem: (ids: number[], options?: any) => void;
        cartTotal: number;
    };
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const formatCurrency = (value: number) => `${(value || 0).toLocaleString()} vnd`;

    const activeItems = cart.filter((item) => item.isActived !== false);
    const inactiveItems = cart.filter((item) => item.isActived === false);

    const onSelectAll = (e: any) => {
        if (e.target.checked) {
            const activeIds = activeItems.map((item: CartItem) => item.cartItemId);
            setSelectedIds(activeIds);
        } else {
            setSelectedIds([]);
        }
    };

    const onSelectItem = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
    };

    const calculateSelectedTotal = () => {
        return activeItems
            .filter((item: CartItem) => selectedIds.includes(item.cartItemId))
            .reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    };

    const handleRemove = (productId: number) => {
        removeItem([productId], {
            onSuccess: () => {
                message.success("Đã xóa sản phẩm");
                setSelectedIds((prev) => prev.filter((id) => id !== productId));
            }
        } as any);
    };

    const handleRemoveSelected = () => {
        if (selectedIds.length === 0) return;

        const productIdsToDelete = cart
            .filter((item) => selectedIds.includes(item.cartItemId))
            .map((item) => item.productId);

        removeItem(productIdsToDelete, {
            onSuccess: () => {
                message.success(`Đã xóa ${selectedIds.length} sản phẩm`);
                setSelectedIds([]);
            }
        } as any);
    };

    const navigate = useNavigate();

    const handlePayment = () => {
        if (selectedIds.length === 0) return;

        navigate("/checkout", { state: { cartItemIds: selectedIds } });
    };

    if (isLoading)
        return (
            <div style={{ textAlign: "center", padding: "100px" }}>
                <Spin size="large" tip="Đang tải giỏ hàng..." />
            </div>
        );
    if (!cart || cart.length === 0) return <Empty description="Giỏ hàng trống" style={{ marginTop: 100 }} />;

    const renderCartItem = (item: CartItem, isInactive = false) => (
        <div
            key={item.cartItemId}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #f5f5f5",
                gap: "20px",
                background: isInactive ? "#fafafa" : "#fff",
                opacity: isInactive ? 0.7 : 1,
                borderRadius: 12,
                marginBottom: 12,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
            }}
        >
            <Checkbox
                checked={selectedIds.includes(item.cartItemId)}
                onChange={() => onSelectItem(item.cartItemId)}
                disabled={isInactive}
            />

            <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.productName}
                style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #eee"
                }}
            />

            <div style={{ flex: 1 }}>
                <Text
                    strong
                    style={{
                        fontSize: "16px",
                        display: "block",
                        color: isInactive ? "#8c8c8c" : "#262626"
                    }}
                >
                    {item.productName}
                </Text>
                <Text type={isInactive ? "secondary" : "danger"} style={{ fontSize: 15, fontWeight: 600 }}>
                    {formatCurrency(item.price)}
                </Text>
                <div>
                    <Tag bordered={false} color={isInactive ? "default" : "blue"} style={{ marginTop: 8 }}>
                        {isInactive ? "Sản phẩm đã xoá/ngừng" : item.status}
                    </Tag>
                </div>
            </div>

            <div style={{ textAlign: "right", minWidth: 140 }}>
                <div style={{ marginBottom: 4, color: "#8c8c8c" }}>Số lượng: {item.quantity}</div>
                <Text strong style={{ fontSize: 16 }}>
                    {formatCurrency(item.price * item.quantity)}
                </Text>
                <div style={{ marginTop: 12 }}>
                    <Button
                        type="text"
                        danger
                        onClick={() => handleRemove(item.productId)}
                        size="small"
                        style={{ fontWeight: 500 }}
                    >
                        Xóa khỏi giỏ
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div
            className="cart-page-wrapper"
            style={{
                padding: "40px 24px",
                maxWidth: 1200,
                margin: "0 auto",
                minHeight: "80vh"
            }}
        >
            <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0 }}>
                    Giỏ hàng của bạn
                </Title>
                <Text type="secondary">{cart.length} sản phẩm trong giỏ</Text>
            </Flex>

            {/* Section 1: Active Items */}
            <div style={{ marginBottom: 48 }}>
                <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
                    <div
                        style={{
                            width: 4,
                            height: 20,
                            background: "#1677ff",
                            borderRadius: 2
                        }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                        Sản phẩm sẵn có ({activeItems.length})
                    </Title>
                </Flex>
                {activeItems.length > 0 ? (
                    <div className="active-items-list">{activeItems.map((item) => renderCartItem(item))}</div>
                ) : (
                    <Text type="secondary" italic>
                        Không có sản phẩm khả dụng
                    </Text>
                )}
            </div>

            {/* Section 2: Inactive Items */}
            {inactiveItems.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                    <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
                        <div
                            style={{
                                width: 4,
                                height: 20,
                                background: "#8c8c8c",
                                borderRadius: 2
                            }}
                        />
                        <Title level={4} style={{ margin: 0, color: "#8c8c8c" }}>
                            Sản phẩm không khả dụng ({inactiveItems.length})
                        </Title>
                    </Flex>
                    <div className="inactive-items-list" style={{ filter: "grayscale(0.5)" }}>
                        {inactiveItems.map((item) => renderCartItem(item, true))}
                    </div>
                    <Text
                        type="secondary"
                        style={{
                            fontSize: 13,
                            background: "#fff2f0",
                            color: "#ff4d4f",
                            padding: "8px 16px",
                            borderRadius: 6,
                            display: "inline-block",
                            marginTop: 8
                        }}
                    >
                        ⚠️ Các sản phẩm này đã bị xoá hoặc ngừng kinh doanh. Vui lòng xoá chúng khỏi giỏ hàng.
                    </Text>
                </div>
            )}

            {/* Footer Summary */}
            <div
                style={{
                    marginTop: 40,
                    padding: "32px",
                    background: "#fff",
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
                    position: "sticky",
                    bottom: 24,
                    zIndex: 10,
                    border: "1px solid #f0f0f0"
                }}
            >
                <Space size="large">
                    <Checkbox
                        onChange={onSelectAll}
                        checked={selectedIds.length === activeItems.length && activeItems.length > 0}
                        disabled={activeItems.length === 0}
                    >
                        <Text strong>Chọn tất cả sản phẩm sẵn có</Text>
                    </Checkbox>
                    <Button type="text" onClick={() => setSelectedIds([])} disabled={selectedIds.length === 0}>
                        Bỏ chọn
                    </Button>
                    {selectedIds.length > 0 && (
                        <Button type="text" danger onClick={handleRemoveSelected} style={{ fontWeight: 500 }}>
                            Xóa các mục đã chọn
                        </Button>
                    )}
                </Space>

                <Space size={32}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#8c8c8c", marginBottom: 4 }}>Tạm tính: {formatCurrency(cartTotal)}</div>
                        <Text style={{ fontSize: 16 }}>
                            Tổng thanh toán:{" "}
                            <Text strong style={{ fontSize: 24, color: "#ff4d4f" }}>
                                {formatCurrency(calculateSelectedTotal())}
                            </Text>
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        danger
                        size="large"
                        disabled={selectedIds.length === 0}
                        style={{
                            height: 56,
                            padding: "0 48px",
                            fontSize: 18,
                            fontWeight: 700,
                            borderRadius: 12,
                            boxShadow: selectedIds.length > 0 ? "0 8px 20px rgba(255, 77, 79, 0.3)" : "none"
                        }}
                        onClick={handlePayment}
                    >
                        Mua ngay ({selectedIds.length})
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default CartPage;
