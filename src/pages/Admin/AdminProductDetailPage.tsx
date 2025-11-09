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
  message,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import { useProduct } from '@/hooks/useProduct';
import { useNavigate, useParams } from 'react-router-dom';
import productsApi from '@/api/productsApi';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading, isError } = useProduct(productId);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
      });
    }
  }, [product, form]);

  const onFinish = async (values: any) => {
    try {
      await productsApi.update(productId, values);
      message.success('Cập nhật sản phẩm thành công!');
    } catch (error) {
      message.error('Cập nhật sản phẩm thất bại!');
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Đã xảy ra lỗi khi tải sản phẩm!</div>;

  return (
    <div className="product-detail-page">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title={<Title level={5}>Thông tin sản phẩm</Title>} className="form-card">
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={8}><Form.Item label="Tên sản phẩm" name="name"><Input /></Form.Item></Col>
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
          <Button size="large" onClick={() => navigate('/admin/products', { replace: true })}>Cancel</Button>
          <Button type="primary" size="large" className='bg-success' htmlType="submit">Save</Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminProductDetailPage;