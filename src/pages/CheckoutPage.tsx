import { useCart } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";
import { CartItem } from "@/type/cart.type";
import { PaymentMethod } from "@/type/order.type";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart() as { cart: CartItem[] };
  const { checkout, isCheckingOut } = useOrder();
  const [form] = Form.useForm();

  const cartItemIds = location.state?.cartItemIds as number[];

  useEffect(() => {
    if (!cartItemIds || cartItemIds.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để thanh toán");
      navigate("/mycart");
    }
  }, [cartItemIds, navigate]);

  const selectedItems = cart.filter((item) =>
    cartItemIds?.includes(item.cartItemId),
  );
  const subTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 0; // Free shipping for now
  const total = subTotal + shippingFee;

  const onFinish = (values: any) => {
    const request = {
      ...values,
      cartItemIds,
    };

    checkout(request, {
      onSuccess: (res) => {
        if (res.paymentUrl) {
          message.loading("Đang chuyển hướng đến cổng thanh toán...", 1.5);
          window.location.href = res.paymentUrl;
        } else {
          message.success("Đặt hàng thành công!");
          navigate("/orders/" + res.orderId);
        }
      },
      onError: (err: any) => {
        message.error(
          err?.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng",
        );
      },
    });
  };

  const formatCurrency = (value: number) =>
    `${(value || 0).toLocaleString()} vnd`;

  return (
    <div
      style={{
        padding: "40px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/mycart")}
        style={{ marginBottom: 24, borderRadius: 8 }}
      >
        Quay lại giỏ hàng
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={15}>
          <Title level={2} style={{ marginBottom: 32 }}>
            Thanh toán
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ paymentMethod: PaymentMethod.STRIPE }}
          >
            <Card
              title={
                <Space>
                  <EnvironmentOutlined /> Thông tin giao hàng
                </Space>
              }
              bordered={false}
              style={{
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                marginBottom: 24,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="shippingName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nguyễn Văn A"
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="shippingPhone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="0123456789"
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Địa chỉ giao hàng"
                name="shippingAddress"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input.TextArea
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={3}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
              <Form.Item label="Ghi chú (tùy chọn)" name="note">
                <Input.TextArea
                  placeholder="Ghi chú về đơn hàng, ví dụ: Giao giờ hành chính"
                  rows={2}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Card>

            <Card
              title={
                <Space>
                  <CreditCardOutlined /> Phương thức thanh toán
                </Space>
              }
              bordered={false}
              style={{
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Form.Item name="paymentMethod">
                <Radio.Group style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio.Button
                      value={PaymentMethod.STRIPE}
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "16px",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Space>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                          alt="Stripe"
                          height={20}
                        />
                        <Text strong>
                          Thanh toán qua Stripe (Visa/Mastercard)
                        </Text>
                      </Space>
                    </Radio.Button>
                    <Radio.Button
                      value={PaymentMethod.COD}
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "16px",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Space>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f0f0f0",
                            borderRadius: "50%",
                          }}
                        >
                          💵
                        </div>
                        <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                      </Space>
                    </Radio.Button>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Card>
          </Form>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 24,
            }}
          >
            <Title level={4} style={{ marginBottom: 24 }}>
              Đơn hàng của bạn
            </Title>
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                marginBottom: 24,
                paddingRight: 8,
              }}
            >
              {selectedItems.map((item) => (
                <div
                  key={item.cartItemId}
                  style={{
                    display: "flex",
                    gap: 16,
                    marginBottom: 16,
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.image || "https://via.placeholder.com/60"}
                    alt={item.productName}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #f0f0f0",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: "block" }}>
                      {item.productName || item.name}
                    </Text>
                    <Text type="secondary">Số lượng: {item.quantity}</Text>
                  </div>
                  <Text strong>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">Tạm tính</Text>
                <Text>{formatCurrency(subTotal)}</Text>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">Phí vận chuyển</Text>
                <Text>{formatCurrency(shippingFee)}</Text>
              </div>
              <Divider dashed />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Tổng cộng
                </Title>
                <Title level={3} style={{ margin: 0, color: "#ff4d4f" }}>
                  {formatCurrency(total)}
                </Title>
              </div>
            </div>

            <Button
              type="primary"
              danger
              size="large"
              block
              style={{
                height: 56,
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(255, 77, 79, 0.3)",
              }}
              onClick={() => form.submit()}
              loading={isCheckingOut}
            >
              Đặt hàng ngay
            </Button>

            <Paragraph
              type="secondary"
              style={{
                textAlign: "center",
                marginTop: 16,
                fontSize: 12,
                marginBottom: 0,
              }}
            >
              Bằng cách đặt hàng, bạn đồng ý với các Điều khoản & Chính sách của
              chúng tôi.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
