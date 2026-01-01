import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { useUsers } from "@/hooks/useUsers";
import { UserProfile } from "@/type/user.type";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
interface CustomerDataType {
  key: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
}

const AdminCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, isError, error, refetch } = useUsers();

  const columns: TableProps<UserProfile>["columns"] = [
    { title: "Tên khách hàng", dataIndex: "name", key: "name" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "country", key: "country" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: { id: string }) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/customers / ${record.id}`);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Delete user:", record.id);
            }}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Đã xảy ra lỗi khi tải sản phẩm!</div>;

  return (
    <div className="customers-page">
      <DashboardStatsFeature rowClassName="stats-cards-customers" />
      <Card className="customers-table-card">
        <div className="table-toolbar">
          <div>
            <Title level={5}>Tất cả khách hàng</Title>
            <Tag color="green">Active Members</Tag>
          </div>
          <Space>
            <Input placeholder="Tìm khách hàng" prefix={<SearchOutlined />} />
            <Select defaultValue="newest">
              <Option value="newest">Short by: Newest</Option>
              <Option value="oldest">Short by: Oldest</Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={users}
          pagination={{
            position: ["bottomCenter"],
            total: users.length,
            showTotal: (total, range) =>
              `Showing data ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: false,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminCustomersPage;
