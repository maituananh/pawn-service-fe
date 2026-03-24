import { useOrder } from "@/hooks/useOrder";
import { OrderDetailResponse, OrderStatus } from "@/type/order.type";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Space, Table, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OrdersPage = () => {
    const { useGetOrders } = useOrder();
    const { data: orders, isLoading } = useGetOrders();
    const navigate = useNavigate();

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PAID:
            case OrderStatus.COMPLETED:
                return "success";
            case OrderStatus.PENDING:
                return "processing";
            case OrderStatus.CANCELLED:
            case OrderStatus.FAILED:
                return "error";
            case OrderStatus.SHIPPING:
                return "warning";
            default:
                return "default";
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

    const columns = [
        {
            title: "Mã đơn hàng",
            key: "orderCode",
            render: (_: any, record: OrderDetailResponse) => (
                <Text strong>#{record.orderId || record.orderCode || record.id}</Text>
            )
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => (
                <Space>
                    <CalendarOutlined style={{ color: "#8c8c8c" }} />
                    {new Date(date).toLocaleDateString("vi-VN")}
                </Space>
            )
        },
        {
            title: "Số lượng sản phẩm",
            dataIndex: "items",
            key: "itemsCount",
            render: (items: any[]) => items?.length || 0
        },
        {
            title: "Tổng cộng",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amount: number) => (
                <Text strong style={{ color: "#ff4d4f" }}>
                    {amount?.toLocaleString()} vnd
                </Text>
            )
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: any, record: OrderDetailResponse) => {
                const currentStatus = record.orderStatus || record.status;
                return (
                    <Tag color={getStatusColor(currentStatus)} style={{ borderRadius: 4 }}>
                        {getStatusLabel(currentStatus)}
                    </Tag>
                );
            }
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_: any, record: OrderDetailResponse) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/orders/${record.id || record.orderId}`)}
                >
                    Chi tiết
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
            <Title level={2} style={{ marginBottom: 32 }}>
                Đơn hàng của bạn
            </Title>

            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table
                    columns={columns}
                    dataSource={Array.isArray(orders) ? orders : (orders as any)?.data || []}
                    loading={isLoading}
                    rowKey={(record) => record.id || record.orderId || Math.random()}
                    locale={{
                        emptyText: (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa có đơn hàng nào">
                                <Button type="primary" onClick={() => navigate("/products")}>
                                    Mua sắm ngay
                                </Button>
                            </Empty>
                        )
                    }}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default OrdersPage;
