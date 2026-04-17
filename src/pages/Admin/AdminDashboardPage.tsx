// [UI ONLY] Redesigned AdminDashboardPage with modern layout and consistent typography
import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { ExportOutlined, MoreOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Space, Table, Tabs, Tag, Typography, theme } from "antd";
import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const { Title, Text } = Typography;

const chartData = [
    { name: "Feb", value: 30000 },
    { name: "Mar", value: 45000 },
    { name: "Apr", value: 40000 },
    { name: "May", value: 60000 },
    { name: "Jun", value: 45591 },
    { name: "Jul", value: 50000 },
    { name: "Aug", value: 65000 },
    { name: "Sep", value: 70000 },
    { name: "Oct", value: 68000 },
    { name: "Nov", value: 72000 },
    { name: "Dec", value: 80000 }
];

const tableData = [
    {
        key: "1",
        name: "001092001234",
        user: "Nguyễn Văn A",
        price: "20.000.000 vnd",
        date: "Jan 17, 2022",
        product: "Xe máy Honda Vision",
        status: "Mới cầm"
    },
    {
        key: "2",
        name: "001092005678",
        user: "Trần Thị B",
        price: "10.000.000 vnd",
        date: "Jan 17, 2022",
        product: "Iphone 17 Pro",
        status: "Đã gia hạn"
    },
    {
        key: "3",
        name: "001092009012",
        user: "Lê Văn C",
        price: "3.000.000 vnd",
        date: "Jan 17, 2022",
        product: "Xe Winner",
        status: "Đang cầm"
    },
    {
        key: "4",
        name: "001092003456",
        user: "Phạm Văn D",
        price: "1.000.000 vnd",
        date: "Jan 17, 2022",
        product: "Vàng 9999",
        status: "Đã quá hạn"
    }
];

const statusColors: { [key: string]: string } = {
    "Mới cầm": "success",
    "Đã gia hạn": "processing",
    "Đang cầm": "warning",
    "Đã quá hạn": "error"
};

const columns = [
    {
        title: "Khách hàng",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: any) => (
            <Flex vertical gap={2}>
                <Text strong style={{ fontSize: 13 }}>
                    {record.user}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {text}
                </Text>
            </Flex>
        )
    },
    {
        title: "Giá trị",
        dataIndex: "price",
        key: "price",
        render: (val: string) => (
            <Text strong color="primary">
                {val}
            </Text>
        )
    },
    { title: "Ngày cầm", dataIndex: "date", key: "date" },
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
            <Tag bordered={false} color={statusColors[status]}>
                {status}
            </Tag>
        )
    },
    {
        title: "",
        key: "action",
        align: "right" as const,
        render: () => <Button type="text" shape="circle" icon={<MoreOutlined />} />
    }
];

const AdminDashboardPage: React.FC = () => {
    const { token } = theme.useToken();

    return (
        <Flex vertical gap={24}>
            <DashboardStatsFeature />

            <Flex gap={24} vertical={false} wrap="wrap">
                <Card
                    style={{ flex: "1 1 60%", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    title={
                        <Flex vertical gap={4}>
                            <Title level={5} style={{ margin: 0 }}>
                                Số lượng giao dịch
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                                Thống kê theo thời gian
                            </Text>
                        </Flex>
                    }
                    extra={
                        <Flex gap={16} align="center">
                            <Tabs
                                defaultActiveKey="12"
                                size="small"
                                tabBarStyle={{ marginBottom: 0 }}
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
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: token.colorTextDescription, fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: token.colorTextDescription, fontSize: 12 }}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    }}
                                    formatter={(value: number) => [`${value.toLocaleString()} VND`, "Giá trị"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={token.colorPrimary}
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: token.colorPrimary, strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
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
                        <Button type="link" size="small">
                            Xem tất cả <RightOutlined />
                        </Button>
                    }
                >
                    <Table
                        columns={columns.filter((c) => ["name", "status", "price"].includes(c.key as string))}
                        dataSource={tableData.slice(0, 4)}
                        pagination={false}
                        size="middle"
                    />
                </Card>
            </Flex>

            <Card
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                title={
                    <Flex vertical gap={4}>
                        <Title level={5} style={{ margin: 0 }}>
                            Danh sách cầm đồ đang hoạt động
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                            Quản lý các hợp đồng cầm đồ hiện tại
                        </Text>
                    </Flex>
                }
            >
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{ pageSize: 5 }}
                    size="middle"
                    rowClassName="row-hover-custom"
                />
            </Card>
        </Flex>
    );
};

export default AdminDashboardPage;
