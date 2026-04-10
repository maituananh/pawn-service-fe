import { useOrder } from "@/hooks/useOrder";
import { OrderDetailResponse, OrderStatus } from "@/type/order.type";
import { CalendarOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Space, Table, Tabs, Tag, Typography, theme } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AdminOrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [activeTab, setActiveTab] = useState<string>("ALL");

    const orderHook = useOrder();

    const orderParams = {
        page: currentPage,
        size: pageSize,
        status: activeTab === "ALL" ? undefined : (activeTab as OrderStatus)
    };

    const { data, isLoading } = orderHook.useGetOrdersAdminPaginated(orderParams);
    const ordersPage = data;

    const handleRowClick = (record: OrderDetailResponse) => {
        const pathId = record.id || record.orderId;
        if (pathId) {
            navigate(`/admin/orders/${pathId}`);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.CONFIRMED:
                return "blue";
            case OrderStatus.PENDING:
                return "orange";
            case OrderStatus.CANCELLED:
            case OrderStatus.FAILED:
                return "red";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return "Chờ xử lý";
            case OrderStatus.CONFIRMED:
                return "Đã xác nhận";
            case OrderStatus.CANCELLED:
                return "Đã huỷ";
            case OrderStatus.FAILED:
                return "Thất bại";
            default:
                return status;
        }
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return "---";
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? "---" : date.toLocaleDateString("vi-VN");
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
                    {formatDate(date)}
                </Space>
            )
        },
        {
            title: "Khách hàng",
            dataIndex: "shippingName",
            key: "customer",
            render: (text: string, record: OrderDetailResponse) => (
                <Flex vertical gap={0}>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>{text || "N/A"}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.shippingPhone || "N/A"}
                    </Text>
                </Flex>
            )
        },
        {
            title: "Tổng cộng",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amount: number) => (
                <Text strong style={{ color: token.colorError }}>
                    {amount?.toLocaleString() || 0} VND
                </Text>
            )
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: any, record: OrderDetailResponse) => {
                const currentStatus = record.orderStatus || record.status;
                return (
                    <Tag
                        color={getStatusColor(currentStatus)}
                        bordered={false}
                        style={{ borderRadius: 6, fontWeight: 500 }}
                    >
                        {getStatusLabel(currentStatus)}
                    </Tag>
                );
            }
        },
        {
            title: "Thao tác",
            key: "actions",
            align: "right" as const,
            render: (_: any, record: OrderDetailResponse) => (
                <Button
                    type="text"
                    shape="circle"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(record);
                    }}
                />
            )
        }
    ];

    const tabItems = [
        { key: "ALL", label: "Tất cả đơn hàng" },
        { key: OrderStatus.PENDING, label: "Chờ xử lý" },
        { key: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
        { key: OrderStatus.CANCELLED, label: "Đã huỷ" },
        { key: OrderStatus.FAILED, label: "Thất bại" }
    ];

    return (
        <Flex vertical gap={24}>
            <Card
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: 16 }}
                title={
                    <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
                        <Flex vertical gap={4}>
                            <Title level={4} style={{ margin: 0 }}>
                                Quản lý đơn hàng
                            </Title>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Theo dõi và cập nhật trạng thái đơn đặt hàng
                            </Text>
                        </Flex>
                        <Flex gap={12} wrap="wrap">
                            <Input
                                placeholder="Tìm mã đơn hàng..."
                                prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                                style={{ width: 240, borderRadius: 10 }}
                                allowClear
                            />
                            <Button icon={<FilterOutlined />} style={{ borderRadius: 10 }}>
                                Bộ lọc
                            </Button>
                        </Flex>
                    </Flex>
                }
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setCurrentPage(0);
                    }}
                    items={tabItems}
                    style={{ marginBottom: 16 }}
                />

                <Table
                    rowKey="orderId"
                    columns={columns}
                    dataSource={ordersPage?.data || []}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record)
                    })}
                    loading={isLoading}
                    size="middle"
                    rowClassName="row-hover-custom"
                    pagination={{
                        position: ["bottomRight"],
                        current: currentPage + 1,
                        pageSize: pageSize,
                        total: ordersPage?.totalElements || 0,
                        onChange: (page) => setCurrentPage(page - 1),
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`,
                        showSizeChanger: false
                    }}
                    style={{ cursor: "pointer" }}
                />
            </Card>
        </Flex>
    );
};

export default AdminOrdersPage;
