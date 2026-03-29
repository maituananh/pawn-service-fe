import usersApi from "@/api/usersApi";
import { useProducts } from "@/hooks/useProducts";
import { useUsers } from "@/hooks/useUsers";
import { Product } from "@/type/product.type";
import {
  MailOutlined,
  MoreOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Flex,
  Form,
  Input,
  message,
  Row,
  Space,
  Table,
  Tag,
  theme,
  Typography,
  type TableProps,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

const productColumns: TableProps<Product>["columns"] = [
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status: string | undefined) => {
      let color = "default";
      let label = "N/A";

      switch (status) {
        case "ACTIVE":
          color = "green";
          label = "Mới cầm";
          break;

        case "EXTENDED":
        case "RENEWED":
          color = "blue";
          label = "Đã gia hạn";
          break;

        case "IN_PROGRESS":
          color = "gold";
          label = "Đang cầm";
          break;

        case "EXPIRED":
          color = "red";
          label = "Đã quá hạn";
          break;

        default:
          color = "default";
          label = status || "N/A";
      }

      return (
        <Tag
          color={color}
          style={{
            borderRadius: 20,
            padding: "4px 12px",
            fontWeight: 500,
          }}
        >
          {label}
        </Tag>
      );
    },
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: "Giá",
    dataIndex: "price",
    render: (price: number) => `${price?.toLocaleString("vi-VN")} đ`,
  },
  { title: "Loại", dataIndex: "type" },
  { title: "Ngày bắt đầu", dataIndex: "startDate" },

  {
    title: "Lợi nhuận/ngày",
    dataIndex: "dailyProfit",
    render: (v: number | undefined) =>
      v ? `${v.toLocaleString("vi-VN")} đ` : "N/A",
  },
];

const dropdownItems = [
  { key: "disable", label: "Vô hiệu hóa tài khoản", danger: true },
  { key: "admin", label: "Đặt làm quản trị viên" },
];

const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams();
  const { token } = theme.useToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { users } = useUsers();
  const { productsPage } = useProducts({
    customerId: Number(id),
  });

  const [customer, setCustomer] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tableRowsVisible, setTableRowsVisible] = useState(true);

  const fetchCustomer = () => {
    const user = users.find((u: any) => String(u.id) === String(id));
    if (!user) return;

    setCustomer(user);

    form.setFieldsValue({
      ...user,
      cardId: user.cardId || "",
    });
  };

  const fetchProducts = () => {
    setProducts(productsPage?.data || []);
  };

  useEffect(() => {
    if (users?.length) fetchCustomer();
    if (productsPage?.data) fetchProducts();
  }, [id, users, productsPage]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        cardId: values.cardId || customer?.cardId || "",
      };

      await usersApi.update(customer.id, payload);

      queryClient.invalidateQueries({ queryKey: ["users"] });

      message.success("Cập nhật thành công");
      navigate("/admin/customers");
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <Flex vertical gap={24}>
      <Flex align="center" justify="space-between">
        <Flex vertical gap={4}>
          <Title level={4}>Chi tiết khách hàng</Title>
          <Text type="secondary">Xem và chỉnh sửa thông tin</Text>
        </Flex>

        <Space>
          <Button icon={<MailOutlined />}>Liên hệ</Button>
          <Dropdown menu={{ items: dropdownItems }}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      </Flex>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Flex justify="space-between">
                <Text strong>Thông tin cá nhân</Text>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  Lưu Thay Đổi
                </Button>
              </Flex>
            }
          >
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="name" label="Họ và tên">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="phone" label="SĐT">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="address" label="Địa chỉ">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="cardId"
                    label="CCCD"
                    rules={[{ required: true, message: "Vui lòng nhập CCCD" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ textAlign: "center" }}>
            <Avatar
              size={100}
              src={customer?.avatarUrl}
              icon={<UserOutlined />}
              style={{ border: `4px solid ${token.colorPrimaryBg}` }}
            />
            <Title level={4}>{customer?.name}</Title>

            <Divider />

            <Flex justify="space-around">
              <div>
                <Text>Tổng SP</Text>
                <div>{products.length}</div>
              </div>
              <div>
                <Text>Tổng tiền</Text>
                <div>{totalValue.toLocaleString()}</div>
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách sản phẩm">
        <Table
          columns={productColumns}
          dataSource={tableRowsVisible ? products : []}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/products/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </Flex>
  );
};

export default AdminCustomerDetailPage;
