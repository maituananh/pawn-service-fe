import productsApi from "@/api/productsApi";
import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
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
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { productsPage, isLoading, isError, error, refetch } = useProducts();

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
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "productName" },
    { title: "Giá", dataIndex: "price", key: "price" },
    { title: "SĐT Người sở hữu", dataIndex: "ownerPhone", key: "ownerPhone" },
    { title: "Người sở hữu", dataIndex: "ownerName", key: "ownerName" },
    { title: "Loại", dataIndex: "type", key: "type" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "success" : "error"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Product) => (
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
            title="Bạn có chắc muốn xóa sản phẩm này không?"
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
  if (isError) return <div>Đã xảy ra lỗi khi tải sản phẩm!</div>;

  return (
    <div className="admin-products-page">
      <DashboardStatsFeature rowClassName="stats-cards-products" />
      <Card className="products-table-card">
        <div className="table-toolbar mb-6">
          <Title level={5} className="mt-0">
            Tất cả sản phẩm
          </Title>
          <Space className="toolbar-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/products/create")}
            >
              Mới
            </Button>
            <Input placeholder="Tìm khách hàng" prefix={<SearchOutlined />} />
            <Select defaultValue="newest">
              <Option value="newest">Short by: Newest</Option>
              <Option value="oldest">Short by: Oldest</Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={productsPage?.data}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          pagination={{
            position: ["bottomCenter"],
            total: productsPage?.totalElements,
            showTotal: (total, range) =>
              `Showing data ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: false,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminProductsPage;
