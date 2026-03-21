// [UI ONLY] Redesigned AdminCustomerDetailPage with improved layout and styling
import usersApi from "@/api/usersApi";
import { useProducts } from "@/hooks/useProducts";
import { useUsers } from "@/hooks/useUsers";
import { Product } from "@/type/product.type";
import {
  DownOutlined,
  MailOutlined,
  MoreOutlined,
  SaveOutlined,
  UpOutlined,
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
  Select,
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
const { Option } = Select;

const productColumns: TableProps<Product>["columns"] = [
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status: string | undefined) => (
      <Tag color={status ? "green" : "default"}>{status || "N/A"}</Tag>
    ),
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: "Giá",
    dataIndex: "price",
    render: (price: number) => `${price?.toLocaleString()} đ`,
  },
  {
    title: "Loại",
    dataIndex: "type",
  },
  {
    title: "Ngày bắt đầu",
    dataIndex: "startDate",
  },
  {
    title: "Lợi nhuận/ngày",
    dataIndex: "dailyProfit",
    render: (v: number) => `${v}%`,
  },
];

const dropdownItems = [
  {
    key: "disable",
    label: "Vô hiệu hóa tài khoản",
    danger: true,
  },
  {
    key: "admin",
    label: "Đặt làm quản trị viên",
  },
];

const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams();
  const { token } = theme.useToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { users } = useUsers();
  const { productsPage } = useProducts();

  const [customer, setCustomer] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDisableForm, setIsDisableForm] = useState(false);
  const [tableRowsVisible, setTableRowsVisible] = useState(true);

  const toggleProductTableRows = () => {
    setTableRowsVisible(!tableRowsVisible);
  };

  const fetchCustomer = () => {
    const user = users.find((u: any) => String(u.id) === String(id));

    if (!user) {
      message.error("Không tìm thấy khách hàng");
      return;
    }

    setCustomer(user);
    form.setFieldsValue(user);
  };

  const fetchProducts = () => {
    const userProducts: Product[] =
      productsPage?.data?.filter((p) => String(p.user?.id) === String(id)) ||
      [];

    setProducts(userProducts);
  };

  useEffect(() => {
    if (users?.length) {
      fetchCustomer();
    }

    if (productsPage?.data) {
      fetchProducts();
    }
  }, [id, users, productsPage]);

  const handleSave = async () => {
    try {
      if (!customer) {
        message.error("Không có dữ liệu khách hàng");
        return;
      }

      const values = await form.validateFields();

      await usersApi.update(customer.id, values);

      queryClient.invalidateQueries({ queryKey: ["users"] });

      message.success("Cập nhật thành công");

      navigate("/admin/customers");

      setIsDisableForm(true);
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <Flex vertical gap={24}>
      {/* [UI ONLY] Header Section */}
      <Flex align="center" justify="space-between">
        <Flex vertical gap={4}>
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết khách hàng
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Xem và chỉnh sửa thông tin hồ sơ khách hàng
          </Text>
        </Flex>
        <Space>
          <Button icon={<MailOutlined />}>Liên hệ</Button>
          <Dropdown menu={{ items: dropdownItems }}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      </Flex>

      <Row gutter={[24, 24]}>
        {/* [UI ONLY] Left Section: Edit Form */}
        <Col xs={24} lg={16}>
          <Card
            onClick={() => {
              if (isDisableForm) setIsDisableForm(false);
            }}
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              borderRadius: 12,
              cursor: "pointer",
            }}
            title={
              <Flex justify="space-between" align="center">
                <Text strong>Thông tin cá nhân</Text>
                {!isDisableForm && (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                  >
                    Lưu thay đổi
                  </Button>
                )}
              </Flex>
            }
          >
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input readOnly={isDisableForm} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Địa chỉ Email" name="email">
                    <Input disabled={isDisableForm} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="CCCD" name="cardId">
                    <Input disabled={isDisableForm} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input disabled={isDisableForm} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input disabled={isDisableForm} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* [UI ONLY] Right Section: Quick Summary */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              textAlign: "center",
            }}
          >
            <Flex
              vertical
              align="center"
              gap={16}
              style={{ padding: "16px 0" }}
            >
              <Avatar
                size={100}
                src={customer?.avatarUrl}
                icon={<UserOutlined />}
                style={{ border: `4px solid ${token.colorPrimaryBg}` }}
              />
              <Flex vertical gap={4}>
                <Title level={4} style={{ margin: 0 }}>
                  {customer?.name}
                </Title>
                <Tag color="blue" bordered={false} style={{ margin: "0 auto" }}>
                  Thành viên thân thiết
                </Tag>
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              <Flex justify="space-around" style={{ width: "100%" }}>
                <Flex vertical>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổng sản phẩm
                  </Text>
                  <Text strong style={{ fontSize: 18 }}>
                    {products.length}
                  </Text>
                </Flex>
                <Flex vertical>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổng giá trị
                  </Text>
                  <Text
                    strong
                    style={{ fontSize: 18, color: token.colorSuccess }}
                  >
                    {totalValue.toLocaleString()}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* [UI ONLY] Products Table */}
      <Card
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: 12 }}
        title={
          <Flex justify="space-between" align="center">
            <Text strong>Danh sách sản phẩm đã cầm</Text>
            <Button
              type="text"
              icon={tableRowsVisible ? <UpOutlined /> : <DownOutlined />}
              onClick={toggleProductTableRows}
            />
          </Flex>
        }
      >
        <Table
          columns={productColumns}
          dataSource={tableRowsVisible ? products : []}
          pagination={false}
          size="middle"
          rowKey="id"
        />
      </Card>
    </Flex>
  );
};

export default AdminCustomerDetailPage;
