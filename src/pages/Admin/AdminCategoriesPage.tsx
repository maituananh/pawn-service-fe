import categoriesApi from "@/api/categoriesApi";
import DashboardStatsFeature from "@/features/DashboardStatsFeature";
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
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, isError, refetch } = useCategories();

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
      message.error("Xóa danh mục thất bại!");
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "note",
      key: "note",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
    },

    {
      title: "Ngày cập nhật",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (status: boolean) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Hoạt động" : "Đã khóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record.id);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Đã xảy ra lỗi khi tải danh mục!</div>;

  return (
    <div className="admin-categories-page">
      <DashboardStatsFeature rowClassName="stats-cards-categories" />

      <Card className="categories-table-card">
        <div className="table-toolbar mb-6">
          <Title level={5} className="mt-0">
            Tất cả danh mục
          </Title>

          <Space className="toolbar-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/categories/create")}
            >
              Mới
            </Button>

            <Input placeholder="Tìm danh mục" prefix={<SearchOutlined />} />

            <Select defaultValue="newest">
              <Option value="newest">Sort by: Newest</Option>
              <Option value="oldest">Sort by: Oldest</Option>
            </Select>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={categories}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 5,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminCategoriesPage;
