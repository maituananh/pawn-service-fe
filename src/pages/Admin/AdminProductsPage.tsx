// [UI ONLY] Redesigned AdminProductsPage with improved toolbar and table styling
import productsApi from "@/api/productsApi";
import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Flex,
    Input,
    message,
    Popconfirm,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
    theme
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { productsPage, isLoading, isError, error, refetch } = useProducts();
    const { token } = theme.useToken();

    const handleRowClick = (record: Product) => {
        navigate(`/admin/products/${record.id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/products/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await productsApi.delete(id);
            message.success("Đã xóa sản phẩm thành công!");
            refetch();
        } catch (err) {
            // Error is already handled globally in axiosClient interceptor
        }
    };

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "productName",
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => (
                <Text style={{ color: token.colorPrimary, fontWeight: 600 }}>{price?.toLocaleString()} VND</Text>
            )
        },
        {
            title: "Người sở hữu",
            dataIndex: "ownerName",
            key: "ownerName",
            render: (text: string, record: Product) => (
                <Flex vertical gap={0}>
                    <Text style={{ fontSize: 13 }}>{text}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {(record as any).ownerPhone}
                    </Text>
                </Flex>
            )
        },
        { title: "Loại", dataIndex: "type", key: "type" },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: any, record: Product) => (
                <Flex gap={4} wrap="wrap">
                    <Tag bordered={false} color={record.isActived !== false ? "success" : "error"}>
                        {record.isActived !== false ? "Hoạt động" : "Đã xoá"}
                    </Tag>
                    {record.isActived !== false && record.status && (
                        <Tag color="#108ee9" bordered={false} style={{ fontSize: 10, borderRadius: 4 }}>
                            {record.status}
                        </Tag>
                    )}
                </Flex>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            align: "right" as const,
            render: (_: any, record: Product) => {
                const isDeleted = record.isActived === false;
                const isSoldOut = record.status === "SOLD_OUT";
                const isDisabled = isDeleted || isSoldOut;

                const titleText = isDeleted ? "Sản phẩm đã bị xoá" : isSoldOut ? "Sản phẩm đã bán" : undefined;

                return (
                    <Space onClick={(e) => e.stopPropagation()}>
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                            disabled={isDisabled}
                            title={titleText || "Chỉnh sửa"}
                        />
                        <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có chắc muốn xóa sản phẩm này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(record.id)}
                            disabled={isDisabled}
                        >
                            <Button
                                type="text"
                                shape="circle"
                                danger
                                icon={<DeleteOutlined />}
                                disabled={isDisabled}
                                title={titleText || "Xoá"}
                            />
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ];

    if (isLoading)
        return (
            <Flex align="center" justify="center" style={{ minHeight: "440px" }}>
                <Spin size="large" tip="Đang tải danh sách sản phẩm..." />
            </Flex>
        );

    if (isError)
        return (
            <Flex align="center" justify="center" style={{ minHeight: "440px" }}>
                <Text type="danger">Đã xảy ra lỗi khi tải danh sách sản phẩm!</Text>
            </Flex>
        );

    return (
        <Flex vertical gap={24}>
            <DashboardStatsFeature rowClassName="stats-cards-products" />

            <Card
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                title={
                    <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
                        <Flex vertical gap={4}>
                            <Title level={4} style={{ margin: 0 }}>
                                Kho sản phẩm cầm đồ
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Quản lý và theo dõi thông tin tài sản
                            </Text>
                        </Flex>

                        <Flex gap={12} wrap="wrap">
                            <Input
                                placeholder="Tìm sản phẩm..."
                                prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                                style={{ width: 240, borderRadius: 8 }}
                                allowClear
                            />
                            <Select defaultValue="newest" style={{ width: 160 }} variant="filled">
                                <Option value="newest">Mới nhất trước</Option>
                                <Option value="oldest">Cũ nhất trước</Option>
                            </Select>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate("/admin/products/create")}
                                style={{ borderRadius: 8 }}
                            >
                                Thêm mới
                            </Button>
                        </Flex>
                    </Flex>
                }
            >
                <Table
                    columns={columns}
                    dataSource={productsPage?.data}
                    onRow={(record) => ({
                        onClick: () => {
                            if (record.status !== "SOLD_OUT") {
                                handleRowClick(record);
                            }
                        },
                        style:
                            record.status === "SOLD_OUT" ? { opacity: 0.5, pointerEvents: "none" as const } : undefined
                    })}
                    size="middle"
                    rowClassName={(record) => (record.status === "SOLD_OUT" ? "" : "row-hover-custom")}
                    pagination={{
                        position: ["bottomRight"],
                        total: productsPage?.totalElements,
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} sản phẩm`,
                        showSizeChanger: false
                    }}
                />
            </Card>
        </Flex>
    );
};

export default AdminProductsPage;
