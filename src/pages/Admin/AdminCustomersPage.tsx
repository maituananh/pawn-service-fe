// [UI ONLY] Redesigned AdminCustomersPage with improved toolbar and table styling
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
  Flex,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
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
  const { users, isLoading, isError, error, refetch } = useUsers();
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
      align: "right" as const,
      render: (_: any, record: { id: string }) => (
        <Space size="small">
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/customers/${record.id}`);
            }}
          />
          <Button
            type="text"
            shape="circle"
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

  if (isLoading)
    return (
      <Flex align="center" justify="center" style={{ minHeight: "400px" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </Flex>
    );

  if (isError)
    return (
      <Flex align="center" justify="center" style={{ minHeight: "400px" }}>
        <Text type="danger">Đã xảy ra lỗi khi tải danh sách khách hàng!</Text>
      </Flex>
    );

  return (
    <Flex vertical gap={24}>
      <DashboardStatsFeature rowClassName="stats-cards-customers" />

      <Card
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        title={
          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={4} style={{ margin: 0 }}>
                Tất cả khách hàng
              </Title>
              <Space>
                <Tag color="success" bordered={false}>
                  Thành viên hoạt động
                </Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {users?.length || 0} khách hàng trong hệ thống
                </Text>
              </Space>
            </Flex>

            <Flex gap={12} wrap="wrap">
              <Input
                placeholder="Tìm khách hàng..."
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
                style={{ width: 170 }}
                variant="filled"
              >
                <Option value="newest">Sắp xếp: Mới nhất</Option>
                <Option value="oldest">Sắp xếp: Cũ nhất</Option>
              </Select>
            </Flex>
          </Flex>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          size="middle"
          rowClassName="row-hover-custom"
          onRow={(record) => ({
            onClick: () => {
              navigate(`/admin/customers/${record.id}`);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            position: ["bottomRight"],
            total: users.length,
            showTotal: (total, range) =>
              `đang hiển thị ${range[0]} - ${range[1]} trong số ${total} khách hàng`,
            showSizeChanger: false,
          }}
        />
      </Card>
    </Flex>
  );
};

export default AdminCustomersPage;
