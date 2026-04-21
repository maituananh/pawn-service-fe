// [UI ONLY] Redesigned AdminDashboardPage with modern layout and consistent typography
import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { useOrder } from "@/hooks/useOrder";
import { useGetActiveProducts } from "@/hooks/useProduct";
import { ExportOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Table, Tabs, Tag, Typography, theme } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const { Title, Text } = Typography;

const statusColors: { [key: string]: string } = {
    PENDING: "orange",
    CONFIRMED: "blue",
    CANCELLED: "red",
    FAILED: "red"
};

const productStatusColors: { [key: string]: string } = {
    IN_PROGRESS: "processing",
    LIQUIDATION: "warning",
    SOLD_OUT: "error",
    COMPLETED: "success"
};

const AdminDashboardPage: React.FC = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();

    const [range, setRange] = useState("12");

    const orderHook = useOrder();
    const { data, isLoading } = orderHook.useGetOrdersAdminPaginated({
        page: 0,
        size: 1000
    });

    const orders = data?.data || [];
    const totalOrders = data?.totalElements || 0;

    const chartData = useMemo(() => {
        const now = new Date();
        if (range === "30") {
            const result: any[] = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                let count = 0;
                for (const o of orders) {
                    const od = new Date(o.createdAt);
                    if (
                        od.getDate() === d.getDate() &&
                        od.getMonth() === d.getMonth() &&
                        od.getFullYear() === d.getFullYear()
                    ) {
                        count++;
                    }
                }
                result.push({
                    name: `${d.getDate()}/${d.getMonth() + 1}`,
                    value: count
                });
            }
            return result;
        }

        const months = range === "6" ? 6 : 12;
        const result: any[] = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = d.getMonth();
            const year = d.getFullYear();
            let count = 0;
            for (const o of orders) {
                const od = new Date(o.createdAt);
                if (od.getMonth() === month && od.getFullYear() === year) {
                    count++;
                }
            }
            result.push({
                name: `T${month + 1}`,
                value: count
            });
        }
        return result;
    }, [orders, range]);

    const sortedOrders = [...orders].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const recentOrders = sortedOrders.slice(0, 5).map((item: any) => ({
        key: item.id ?? item.orderId,
        name: item.orderId ?? "---",

        user: item.shippingName || "N/A",
        cccd: item.shippingPhone || "---",

        price: `${(item.totalAmount ?? 0).toLocaleString()} VND`,
        date: item.createdAt,
        status: item.orderStatus ?? item.status ?? "PENDING"
    }));

    const { data: productData, isLoading: productLoading } = useGetActiveProducts(0, 5);
    const products = productData?.data || [];

    const recentColumns = [
        {
            title: "Khách hàng",
            render: (_: any, record: any) => (
                <Flex vertical>
                    <Text strong>{record.user}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {record.cccd}
                    </Text>
                </Flex>
            )
        },
        {
            title: "Giá",
            dataIndex: "price"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>
        }
    ];

    const productColumns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            render: (text: string) => <Text strong>{text}</Text>
        },

        {
            title: "Giá",
            dataIndex: "price",
            render: (val: number) => (
                <Text style={{ color: token.colorError, fontWeight: 500 }}>{(val ?? 0).toLocaleString()} VND</Text>
            )
        },
        {
            title: "Số lượng",
            dataIndex: "availableQty"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => <Tag color={productStatusColors[status] || "default"}>{status}</Tag>
        }
    ];

    return (
        <Flex vertical gap={24}>
            <DashboardStatsFeature />

            <Flex gap={24} wrap="wrap">
                <Card
                    style={{ flex: "1 1 60%", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    title={
                        <Flex vertical gap={4}>
                            <Title level={5} style={{ margin: 0 }}>
                                Số lượng giao dịch ({totalOrders})
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Thống kê theo thời gian
                            </Text>
                        </Flex>
                    }
                    extra={
                        <Flex gap={16} align="center">
                            <Tabs
                                activeKey={range}
                                onChange={(key) => setRange(key)}
                                size="small"
                                items={[
                                    { label: "12 Months", key: "12" },
                                    { label: "6 Months", key: "6" },
                                    { label: "30 Days", key: "30" }
                                ]}
                            />
                            <Button size="small" icon={<ExportOutlined />} type="dashed">
                                Export
                            </Button>
                        </Flex>
                    }
                >
                    <div style={{ padding: "16px 0" }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip formatter={(value: number) => [value, "Số giao dịch"]} />
                                <Line type="monotone" dataKey="value" stroke={token.colorPrimary} strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card
                    style={{ flex: "1 1 35%", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    title={
                        <Title level={5} style={{ margin: 0 }}>
                            Giao dịch gần đây
                        </Title>
                    }
                    extra={
                        <Button type="link" onClick={() => navigate("/admin/orders")}>
                            Xem tất cả →
                        </Button>
                    }
                >
                    <Table
                        columns={recentColumns}
                        dataSource={recentOrders}
                        loading={isLoading}
                        pagination={false}
                        size="small"
                    />
                </Card>
            </Flex>
            <Card
                title="Danh sách cầm đồ đang hoạt động"
                extra={
                    <Button type="link" onClick={() => navigate("/admin/products")}>
                        Xem tất cả →
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={productColumns}
                    dataSource={products}
                    loading={productLoading}
                    size="middle"
                    pagination={false}
                    onRow={(record: any) => ({
                        onClick: () => navigate(`/admin/products/${record.id}`)
                    })}
                />
            </Card>
        </Flex>
    );
};

export default AdminDashboardPage;
