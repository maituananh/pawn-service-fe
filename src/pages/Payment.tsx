import React, { useMemo } from 'react';
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const cartItemsData = [
  { id: 1, name: 'Iphone 17 pro', price: 17000000, quantity: 2, image: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=Phone', checked: true },
  { id: 2, name: 'Winner X V2', price: 17000000, quantity: 1, image: 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=Bike', checked: true },
  { id: 3, name: 'Iphone 17 pro', price: 17000000, quantity: 1, image: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=Phone', checked: false },
  { id: 4, name: 'Iphone 17 pro', price: 17000000, quantity: 1, image: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=Phone', checked: true },
];

const PaymentPage: React.FC = () => {
  const itemsToPay = useMemo(() => cartItemsData.filter(item => item.checked), []);

  const totalPrice = useMemo(() => {
    return itemsToPay.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [itemsToPay]);

  const onFinish = (values: any) => {
    console.log('Payment details submitted:', values);
  };

  return (
    <div className="container payment-page-container bg-white">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={14} className="order-summary">
          <Title level={4}>Tóm tắt đơn hàng</Title>
          {itemsToPay.map(item => (
            <div key={item.id} className="payment-product-item">
              <img src={item.image} alt={item.name} className="product-image" />
              <div className="product-info">
                <Text strong>{item.name}</Text>
                <Text type="secondary">{item.price.toLocaleString()} vnd</Text>
              </div>
              <div className="product-details">
                <Text>Số lượng: {item.quantity}</Text>
                <Text type="secondary">Tổng: {(item.price * item.quantity).toLocaleString()} vnd</Text>
              </div>
            </div>
          ))}
          <div className="order-total">
            <Text strong>Tổng cộng</Text>
            <Text strong className="total-price">{totalPrice.toLocaleString()} vnd</Text>
          </div>
        </Col>
        <Col xs={24} md={10}>
          <Card title="Credit Card Details" className="payment-form-card">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Payment Method">
                <Text>MasterCard / Visa / ...</Text>
              </Form.Item>
              <Form.Item label="Name on card" name="cardName" rules={[{ required: true }]}>
                <Input placeholder="Meet Patel" />
              </Form.Item>
              <Form.Item label="Card number" name="cardNumber" rules={[{ required: true }]}>
                <Input placeholder="0000 0000 0000 0000" />
              </Form.Item>
              <Form.Item label="Card expiration">
                <Space>
                  <Form.Item name="expMonth" noStyle rules={[{ required: true }]}>
                    <Select placeholder="Month" style={{ width: 120 }}>
                      {Array.from({ length: 12 }, (_, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item name="expYear" noStyle rules={[{ required: true }]}>
                    <Select placeholder="Year" style={{ width: 120 }}>
                      {Array.from({ length: 10 }, (_, i) => <Option key={i + 2024} value={i + 2024}>{i + 2024}</Option>)}
                    </Select>
                  </Form.Item>
                </Space>
              </Form.Item>
              <Form.Item label="Card Security Code" name="cvc" rules={[{ required: true }]}>
                <Input placeholder="Code" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: 'black', color: 'white' }}>
                  Thanh toán
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;