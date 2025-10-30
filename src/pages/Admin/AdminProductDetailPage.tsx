import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Avatar,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// --- Dữ liệu giả để điền vào form (mô phỏng trạng thái "edit") ---
const initialProductData = {
  productName: 'Macbook Pro 14 inch',
  pawnPrice: '15.000.000',
  sellPrice: '20.000.000',
  category: 'laptop',
  brand: 'Apple',
  quantity: 1,
  status: 'in_stock',
  customerName: 'Nguyễn Văn A',
  customerPhone: '0987654321',
  customerAddress: '123 Đường ABC, Quận 1, TP. HCM',
};

const AdminProductDetailPage: React.FC = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(initialProductData);
  }, [initialProductData])
  const onFinish = (values: any) => {
    console.log('Form values submitted:', values);
  };

  return (
    <div className="product-detail-page">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title={<Title level={5}>Thông tin sản phẩm</Title>} className="form-card">
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={8}><Form.Item label="Tên sản phẩm" name="productName"><Input /></Form.Item></Col>
            <Col xs={24} lg={8}><Form.Item label="Giá cầm" name="pawnPrice"><Input /></Form.Item></Col>
            <Col xs={24} lg={8}><Form.Item label="Giá bán" name="sellPrice"><Input /></Form.Item></Col>
            <Col xs={24} lg={8}><Form.Item label="Danh mục" name="category"><Select><Option value="laptop">Laptop</Option></Select></Form.Item></Col>
            <Col xs={24} lg={8}><Form.Item label="Ngày bắt đầu cầm:" name="startDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} lg={8}><Form.Item label="Ngày kết thúc cầm:" name="endDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} lg={8}>
              <Row gutter={[24, 0]}>
                <Col span={24}><Form.Item label="Thương hiệu" name="brand"><Input /></Form.Item></Col>
                <Col span={24}><Form.Item label="Số lượng" name="quantity"><Input /></Form.Item></Col>
                <Col span={24}><Form.Item label="Trạng thái" name="status"><Select><Option value="in_stock">Còn hàng</Option></Select></Form.Item></Col>
              </Row>
            </Col>
            <Col xs={24} lg={16}>
              <Form.Item label="Mô tả" name="description"><Input.TextArea rows={8} /></Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title={<Title level={5}>Hình ảnh</Title>} className="form-card">
          <div className="image-gallery">
            <div className="main-image">
              <img src="https://via.placeholder.com/400x250/E8E8E8/AAAAAA?text=Main+Image" alt="Main product" />
            </div>
            <div className="thumbnail-images">
              <div className="thumbnail-placeholder" />
              <div className="thumbnail-placeholder" />
              <div className="thumbnail-placeholder" />
              <div className="thumbnail-placeholder" />
            </div>
          </div>
        </Card>
        <Card title={<Title level={5}>Thông tin khách hàng</Title>} className="form-card">
          <div className="customer-info-container">
            <div className="customer-details-form">
              <Row gutter={24}>
                <Col xs={24} md={12}><Form.Item label="Tên" name="customerName"><Input /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="Điện thoại" name="customerPhone"><Input /></Form.Item></Col>
                <Col xs={24}><Form.Item label="Địa chỉ" name="customerAddress"><Input /></Form.Item></Col>
              </Row>
            </div>
          </div>
        </Card>
        <div className="action-buttons">
          <Button size="large">Cancel</Button>
          <Button type="primary" size="large" className='bg-success' htmlType="submit">Save</Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminProductDetailPage;