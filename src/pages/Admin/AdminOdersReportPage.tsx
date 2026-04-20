// [UI ONLY] Redesigned AdminOrderReportPage with improved layout and styling
import { ExportOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Select, Space, Table, Tag, theme, Typography, type TableProps } from "antd";
import React from "react";

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderDataType {
    key: string;
    customerName: string;
    orderDate: string;
    phone: string;
    orderId: string;
    address: string;
    status: "Đã giao" | "Đã hủy" | "Đang giao";
}

const orderData: OrderDataType[] = [
    {
        key: "1",
        customerName: "Jane Cooper",
        orderDate: "2025-12-12 20:30:30",
        phone: "(225) 555-0118",
        orderId: "123456678",
        address: "United States",
        status: "Đã giao"
    },
    {
        key: "2",
        customerName: "Floyd Miles",
        orderDate: "2025-12-12 20:30:30",
        phone: "(205) 555-0100",
        orderId: "123456678",
        address: "Kiribati",
        status: "Đã giao"
    },
    {
        key: "3",
        customerName: "Ronald Richards",
        orderDate: "2025-12-12 20:30:30",
        phone: "(302) 555-0107",
        orderId: "123456678",
        address: "Israel",
        status: "Đã hủy"
    },
    {
        key: "4",
        customerName: "Marvin McKinney",
        orderDate: "2025-12-12 20:30:30",
        phone: "(252) 555-0126",
        orderId: "123456678",
        address: "Iran",
        status: "Đang giao"
    }
];

const getStatusColor = (status: OrderDataType["status"]): string => {
    switch (status) {
        case "Đã giao":
            return "success";
        case "Đã hủy":
            return "error";
        case "Đang giao":
            return "warning";
        default:
            return "default";
    }
};

const columns: TableProps<OrderDataType>["columns"] = [
    {
        title: "Mã đơn hàng",
        dataIndex: "orderId",
        key: "orderId",
        render: (text) => <Text code>{text}</Text>
    },
    {
        title: "Khách hàng",
        dataIndex: "customerName",
        key: "customerName",
        render: (text) => <Text strong>{text}</Text>
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
        title: "Ngày đặt",
        dataIndex: "orderDate",
        key: "orderDate",
        render: (text) => (
            <Text type="secondary" style={{ fontSize: 13 }}>
                {text}
            </Text>
        )
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ellipsis: true },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: OrderDataType["status"]) => (
            <Tag bordered={false} color={getStatusColor(status)}>
                {status}
            </Tag>
        )
    },
    {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: () => (
            <Button type="text" icon={<InfoCircleOutlined />} size="small">
                Chi tiết
            </Button>
        )
    }
];

const AdminOrderReportPage: React.FC = () => {
    const { token } = theme.useToken();

    return (
        <Flex vertical gap={24}>
            {/* [UI ONLY] Header Section */}
            <Flex align="center" justify="space-between">
                <Flex vertical gap={4}>
                    <Title level={4} style={{ margin: 0 }}>
                        Báo cáo đơn hàng
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Theo dõi và quản lý lịch sử giao dịch toàn hệ thống
                    </Text>
                </Flex>
                <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>
                    Xuất báo cáo
                </Button>
            </Flex>

            <Card
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: 12 }}
                styles={{ body: { padding: "0 0 24px 0" } }}
            >
                <Flex gap={16} align="center" justify="space-between" style={{ padding: "24px" }}>
                    <Title level={5} style={{ margin: 0 }}>
                        Danh sách giao dịch
                    </Title>
                    <Space>
                        <Input
                            placeholder="Tìm theo khách hàng, SĐT..."
                            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                            style={{ width: 280, borderRadius: 8 }}
                        />
                        <Select defaultValue="newest" style={{ width: 180 }}>
                            <Option value="newest">Sắp xếp: Mới nhất</Option>
                            <Option value="oldest">Sắp xếp: Cũ nhất</Option>
                        </Select>
                    </Space>
                </Flex>

                <Table
                    columns={columns}
                    dataSource={orderData}
                    pagination={{
                        position: ["bottomCenter"],
                        pageSize: 10,
                        showTotal: (total, range) => (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Đang hiển thị {range[0]} - {range[1]} trong tổng số {total} đơn hàng
                            </Text>
                        )
                    }}
                    size="middle"
                />
            </Card>
        </Flex>
    );
};

export default AdminOrderReportPage;
