import { useOrder } from "@/hooks/useOrder";
import { OrderStatus } from "@/type/order.type";
import {
    CalendarOutlined,
    CreditCardOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    PrinterOutlined
} from "@ant-design/icons";
import {
    Badge,
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Flex,
    message,
    Popconfirm,
    Row,
    Skeleton,
    Space,
    Table,
    Tag,
    theme,
    Typography
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const { useGetOrderDetail, cancelOrder, isCancelling } = useOrder();
    const { data: order, isLoading } = useGetOrderDetail(Number(id));

    const handleCancelOrder = () => {
        if (!order) return;
        cancelOrder(order.orderId || order.id, {
            onSuccess: () => {
                messageApi.success("Đã hủy đơn hàng thành công");
                navigate("/admin/orders");
            },
            onError: () => {
                messageApi.error("Có lỗi xảy ra khi hủy đơn hàng");
            }
        });
    };

    // Determine if we came from admin or customer side
    const isAdmin = location.pathname.startsWith("/admin");

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PAID:
            case OrderStatus.COMPLETED:
                return "#52c41a";
            case OrderStatus.PENDING:
                return "#1890ff";
            case OrderStatus.CANCELLED:
            case OrderStatus.FAILED:
                return "#ff4d4f";
            case OrderStatus.SHIPPING:
                return "#faad14";
            default:
                return "#d9d9d9";
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PAID:
                return "Đã thanh toán";
            case OrderStatus.COMPLETED:
                return "Hoàn thành";
            case OrderStatus.PENDING:
                return "Chờ thanh toán";
            case OrderStatus.CANCELLED:
                return "Đã hủy";
            case OrderStatus.FAILED:
                return "Thanh toán thất bại";
            case OrderStatus.SHIPPING:
                return "Đang giao hàng";
            default:
                return status;
        }
    };

    const formatCurrency = (value: any) => {
        const num = Number(value);
        return isNaN(num) ? "0" : num.toLocaleString();
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return "---";
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? "---" : date.toLocaleString("vi-VN");
    };

    const itemColumns = [
        {
            title: "Sản phẩm",
            key: "product",
            render: (_: any, record: any) => (
                <Flex gap={16} align="center">
                    <img
                        src={record.productImage || "https://via.placeholder.com/80"}
                        alt={record.productName}
                        style={{
                            width: 70,
                            height: 70,
                            objectFit: "cover",
                            borderRadius: 12,
                            border: "1px solid #f0f0f0"
                        }}
                    />
                    <Flex vertical>
                        <Text strong style={{ fontSize: 15 }}>
                            {record.productName}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            ID sản phẩm: {record.productId}
                        </Text>
                    </Flex>
                </Flex>
            )
        },
        {
            title: "Đơn giá",
            key: "price",
            align: "right" as const,
            render: (_: any, record: any) => <Text>{formatCurrency(record.price)} VND</Text>
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: "center" as const,
            render: (q: any) => <Text strong>x{Number(q) || 0}</Text>
        },
        {
            title: "Thành tiền",
            key: "total",
            align: "right" as const,
            render: (_: any, record: any) => {
                const price = Number(record.price) || 0;
                const quantity = Number(record.quantity) || 0;
                return (
                    <Text strong style={{ color: token.colorPrimary }}>
                        {formatCurrency(price * quantity)} VND
                    </Text>
                );
            }
        }
    ];

    if (isLoading) {
        return (
            <div style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>
                <Skeleton active avatar paragraph={{ rows: 10 }} />
            </div>
        );
    }

    if (!order)
        return (
            <div style={{ padding: "100px 0", textAlign: "center" }}>
                <Text type="secondary">Không tìm thấy thông tin đơn hàng</Text>
            </div>
        );

    const currentStatus = order.orderStatus || order.status;

    return (
        <div style={{ padding: "24px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
            {contextHolder}
            {/* Redesigned Back Button / Breadcrumb */}
            <Breadcrumb
                style={{ marginBottom: 24 }}
                items={[
                    {
                        title: <Link to={isAdmin ? "/admin/dashboard" : "/"}>Trang chủ</Link>
                    },
                    {
                        title: <Link to={isAdmin ? "/admin/orders" : "/orders"}>Đơn hàng</Link>
                    },
                    {
                        title: `Chi tiết #${order.orderId || order.id}`
                    }
                ]}
            />

            {/* Header Section */}
            <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
                <Flex vertical gap={4}>
                    <Flex align="center" gap={12}>
                        <Title level={3} style={{ margin: 0 }}>
                            Mã đơn hàng: #{order.orderId || order.orderCode || order.id}
                        </Title>
                        <Tag
                            color={getStatusColor(currentStatus)}
                            bordered={false}
                            style={{ borderRadius: 6, padding: "4px 12px", fontWeight: 600 }}
                        >
                            {getStatusLabel(currentStatus)}
                        </Tag>
                    </Flex>
                    <Text type="secondary">
                        <CalendarOutlined /> Đặt lúc: {formatDate(order.createdAt)}
                    </Text>
                </Flex>
                <Space>
                    {currentStatus === OrderStatus.PENDING && (
                        <Popconfirm
                            title="Hủy đơn hàng"
                            description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                            onConfirm={handleCancelOrder}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: isCancelling }}
                        >
                            <Button danger>Hủy đơn hàng</Button>
                        </Popconfirm>
                    )}
                    <Button icon={<PrinterOutlined />}>In hóa đơn</Button>
                    {isAdmin && <Button type="primary">Cập nhật trạng thái</Button>}
                </Space>
            </Flex>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Space direction="vertical" style={{ width: "100%" }} size={24}>
                        {/* Items Table */}
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 20,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                            }}
                            bodyStyle={{ padding: "24px 0" }}
                        >
                            <Title level={5} style={{ padding: "0 24px", marginBottom: 20 }}>
                                Danh sách sản phẩm
                            </Title>
                            <Table columns={itemColumns} dataSource={order.items} rowKey="id" pagination={false} />

                            <Divider dashed style={{ margin: "24px 0" }} />

                            <div style={{ padding: "0 24px" }}>
                                <Flex vertical align="flex-end" gap={12} style={{ width: "100%" }}>
                                    <Flex justify="space-between" style={{ width: 280 }}>
                                        <Text type="secondary">Tạm tính:</Text>
                                        <Text strong>{formatCurrency(order.totalAmount)} VND</Text>
                                    </Flex>
                                    <Flex justify="space-between" style={{ width: 280 }}>
                                        <Text type="secondary">Phí vận chuyển:</Text>
                                        <Text strong>0 VND</Text>
                                    </Flex>
                                    <Flex justify="space-between" style={{ width: 280, marginTop: 8 }}>
                                        <Title level={4} style={{ margin: 0 }}>
                                            Tổng thanh toán:
                                        </Title>
                                        <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                                            {formatCurrency(order.totalAmount)} VND
                                        </Title>
                                    </Flex>
                                </Flex>
                            </div>
                        </Card>

                        {/* Note Card */}
                        {order.note && (
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: 20,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                    background: "#fafafa"
                                }}
                            >
                                <Space align="start">
                                    <FileTextOutlined style={{ marginTop: 4, color: token.colorPrimary }} />
                                    <Flex vertical>
                                        <Text strong>Ghi chú khách hàng</Text>
                                        <Paragraph style={{ margin: "8px 0 0", color: "#595959" }}>
                                            {order.note}
                                        </Paragraph>
                                    </Flex>
                                </Space>
                            </Card>
                        )}
                    </Space>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" style={{ width: "100%" }} size={24}>
                        {/* Shipping Info */}
                        <Card
                            title={
                                <Space>
                                    <EnvironmentOutlined /> Thông tin giao hàng
                                </Space>
                            }
                            bordered={false}
                            style={{
                                borderRadius: 20,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                            }}
                        >
                            <Descriptions column={1} labelStyle={{ color: "#8c8c8c" }}>
                                <Descriptions.Item label="Người nhận">
                                    <Text strong>{order.shippingName}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">
                                    <Text>{order.shippingPhone}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">
                                    <Text>{order.shippingAddress}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Payment Info */}
                        <Card
                            title={
                                <Space>
                                    <CreditCardOutlined /> Thanh toán
                                </Space>
                            }
                            bordered={false}
                            style={{
                                borderRadius: 20,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                            }}
                        >
                            <Flex vertical gap={12}>
                                <Flex justify="space-between">
                                    <Text type="secondary">Phương thức:</Text>
                                    <Text strong>{order.paymentMethod}</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text type="secondary">Ngày thanh toán:</Text>
                                    <Text>
                                        {currentStatus === OrderStatus.PAID || currentStatus === OrderStatus.COMPLETED
                                            ? formatDate(order.createdAt)
                                            : "---"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text type="secondary">Trạng thái:</Text>
                                    <Badge color={getStatusColor(currentStatus)} text={getStatusLabel(currentStatus)} />
                                </Flex>
                            </Flex>
                        </Card>

                        {/* Admin Actions Card (Placeholder) */}
                        {isAdmin && (
                            <Card
                                title="Hành động quản trị"
                                bordered={false}
                                style={{
                                    borderRadius: 20,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    border: `1px solid ${token.colorPrimary}22`
                                }}
                            >
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <Button block>Gửi Email cập nhật</Button>
                                </Space>
                            </Card>
                        )}
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetailPage;
