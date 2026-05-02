import { useMyProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
import { CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { Alert, Badge, Button, Card, Col, Empty, Row, Space, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const MyProductsPage = () => {
    const { products, isLoading, isError, error } = useMyProducts();
    const navigate = useNavigate();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    };

    const getStatusTag = (status?: string) => {
        switch (status) {
            case "ACTIVE":
                return <Tag color="processing">Đang cầm cố</Tag>;
            case "EXPIRED":
                return <Tag color="error">Đã quá hạn</Tag>;
            case "LIQUIDATION":
                return <Tag color="warning">Đang thanh lý</Tag>;
            case "SOLD_OUT":
                return <Tag color="default">Đã thanh lý</Tag>;
            case "REDEEMED":
                return <Tag color="success">Đã chuộc</Tag>;
            default:
                return <Tag color="blue">{status}</Tag>;
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <Spin size="large" tip="Đang tải danh sách sản phẩm..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ padding: "24px" }}>
                <Alert message="Lỗi" description={(error as Error).message} type="error" showIcon />
            </div>
        );
    }

    return (
        <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
                        Sản phẩm của tôi
                    </Title>
                    <Text type="secondary">Danh sách các tài sản bạn đã cầm cố tại hệ thống</Text>
                </div>
                <Badge count={products.length} overflowCount={999} color="#1890ff">
                    <div
                        style={{
                            padding: "8px 16px",
                            background: "#fff",
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                        }}
                    >
                        Tổng số tài sản
                    </div>
                </Badge>
            </div>

            {products.length === 0 ? (
                <Card style={{ textAlign: "center", padding: "60px 0", borderRadius: 16 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Space direction="vertical">
                                <Text strong style={{ fontSize: 18 }}>
                                    Bạn chưa có sản phẩm nào
                                </Text>
                                <Text type="secondary">Các sản phẩm bạn cầm cố sẽ xuất hiện tại đây</Text>
                            </Space>
                        }
                    >
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate("/")}
                            style={{ marginTop: 16, borderRadius: 8 }}
                        >
                            Khám phá ngay
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <Row gutter={[24, 24]}>
                    {products.map((product: Product) => (
                        <Col xs={24} sm={12} lg={8} key={product.id}>
                            <Card
                                hoverable
                                className="my-product-card"
                                style={{
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    border: "1px solid #f0f0f0",
                                    transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
                                }}
                                bodyStyle={{ padding: 20 }}
                                cover={
                                    <div
                                        style={{
                                            height: 200,
                                            overflow: "hidden",
                                            position: "relative",
                                            background: "#f5f5f5"
                                        }}
                                    >
                                        <img
                                            alt={product.name}
                                            src={
                                                product.image ||
                                                "https://placehold.co/400x300/f5f5f7/b0b0b0?text=No+Image"
                                            }
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <div style={{ position: "absolute", top: 12, right: 12 }}>
                                            {getStatusTag(product.status)}
                                        </div>
                                    </div>
                                }
                            >
                                <div style={{ marginBottom: 16 }}>
                                    <Tag color="blue" style={{ marginBottom: 8, borderRadius: 4 }}>
                                        {product.category?.name || "Khác"}
                                    </Tag>
                                    <Title
                                        level={4}
                                        style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 700 }}
                                        ellipsis={{ rows: 1 }}
                                    >
                                        {product.name}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Mã sản phẩm: <Text code>{product.code}</Text>
                                    </Text>
                                </div>

                                <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }} size={12}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Space size={8}>
                                            <CalendarOutlined style={{ color: "#1890ff" }} />
                                            <Text type="secondary">Ngày bắt đầu</Text>
                                        </Space>
                                        <Text strong>{dayjs(product.startDate).format("DD/MM/YYYY")}</Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Space size={8}>
                                            <CalendarOutlined style={{ color: "#ff4d4f" }} />
                                            <Text type="secondary">Ngày kết thúc</Text>
                                        </Space>
                                        <Text strong>{dayjs(product.endDate).format("DD/MM/YYYY")}</Text>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "#f9f9f9",
                                            padding: "8px 12px",
                                            borderRadius: 8
                                        }}
                                    >
                                        <Space size={8}>
                                            <DollarOutlined style={{ color: "#52c41a" }} />
                                            <Text type="secondary">Định giá</Text>
                                        </Space>
                                        <Text strong style={{ fontSize: 16, color: "#52c41a" }}>
                                            {formatCurrency(product.price)}
                                        </Text>
                                    </div>
                                </Space>

                                <div
                                    style={{
                                        paddingTop: 16,
                                        borderTop: "1px solid #f0f0f0",
                                        display: "flex",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button
                                        type="link"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                        style={{ padding: 0, fontWeight: 600 }}
                                    >
                                        Xem chi tiết →
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <style>{`
                .my-product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
                }
                .my-product-card .ant-card-cover img {
                    transition: transform 0.5s ease;
                }
                .my-product-card:hover .ant-card-cover img {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default MyProductsPage;
