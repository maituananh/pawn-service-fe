// [UI ONLY] Redesigned AdminCustomersPage with improved toolbar and table styling
import DashboardStatsFeature from "@/features/DashboardStatsFeature";
import { useUsers } from "@/hooks/useUsers";
import { UserProfile } from "@/type/user.type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Select,
  Space,
  Spin,
  Table,
  theme,
  Typography,
  type TableProps,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, isError } = useUsers();
  const { token } = theme.useToken();

  const columns: TableProps<UserProfile>["columns"] = [
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Text strong style={{ color: token.colorPrimary }}>
          {text}
        </Text>
      ),
    },
    { title: "Công ty", dataIndex: "company", key: "company" },

    {
      title: "CCCD",
      dataIndex: "card_id",
      key: "card_id",
    },

    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "country", key: "country" },

    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: { id: string }) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/customers/${record.id}`);
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin />;
  if (isError) return <Text type="danger">Lỗi tải dữ liệu</Text>;

  return (
    <Flex vertical gap={24}>
      <DashboardStatsFeature />

      <Card>
        <Table
          columns={columns}
          dataSource={users || []}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => {
              if (!record?.id) return;
              navigate(`/admin/customers/${record.id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </Flex>
  );
};

export default AdminCustomersPage;
