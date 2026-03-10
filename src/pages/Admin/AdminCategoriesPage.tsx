// [UI ONLY] Redesigned AdminCategoriesPage with improved toolbar and table styling
import categoriesApi from "@/api/categoriesApi";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/type/category.type";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, isError, refetch } = useCategories();
  const { token } = theme.useToken();

  const handleRowClick = (record: Category) => {
    navigate(`/admin/categories/${record.id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/categories/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await categoriesApi.delete(id);
      message.success("Đã xóa danh mục thành công!");
      refetch();
    } catch (err) {
      // Error is already handled globally in axiosClient interceptor
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Mô tả",
      dataIndex: "note",
      key: "note",
      render: (text: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {text || "Không có mô tả"}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? (
          <Text type="secondary">{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (status: boolean) => (
        <Tag bordered={false} color={status ? "success" : "red"}>
          {status ? "Hoạt động" : "Đã xoá"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right" as const,
      render: (_: any, record: Category) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          />

          <Popconfirm
            title="Xóa danh mục"
            description="Tất cả sản phẩm thuộc danh mục này sẽ bị ảnh hưởng. Bạn có chắc muốn xóa không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading)
    return (
      <Flex align="center" justify="center" style={{ minHeight: "400px" }}>
        <Spin size="large" tip="Đang tải danh mục..." />
      </Flex>
    );

  if (isError)
    return (
      <Flex align="center" justify="center" style={{ minHeight: "400px" }}>
        <Text type="danger">Đã xảy ra lỗi khi tải danh sách danh mục!</Text>
      </Flex>
    );

  return (
    <Flex vertical gap={24}>
      <Card
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        title={
          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={4} style={{ margin: 0 }}>
                Quản lý danh mục
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Phân loại các loại tài sản cầm đồ
              </Text>
            </Flex>

            <Flex gap={12} wrap="wrap">
              <Input
                placeholder="Tìm danh mục..."
                prefix={
                  <SearchOutlined
                    style={{ color: token.colorTextDescription }}
                  />
                }
                style={{ width: 240, borderRadius: 8 }}
                allowClear
              />

              <Select
                defaultValue="newest"
                style={{ width: 160 }}
                variant="filled"
              >
                <Option value="newest">Mới nhất trước</Option>
                <Option value="oldest">Cũ nhất trước</Option>
              </Select>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/categories/new")}
                style={{ borderRadius: 8 }}
              >
                Thêm danh mục
              </Button>
            </Flex>
          </Flex>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={categories}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          size="middle"
          rowClassName="row-hover-custom"
          pagination={{
            position: ["bottomRight"],
            pageSize: 10,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} của ${total} danh mục`,
          }}
        />
      </Card>
    </Flex>
  );
};

export default AdminCategoriesPage;
