import React from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Typography,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AdminProductCreatePage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div className="create-product-page">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title={<Title level={5}>Tạo sản phẩm mới</Title>} className="form-card">
          <Row gutter={24}>
            <Col xs={24} md={12}><Form.Item label="Tên sản phẩm" name="productName"><Input placeholder="Điện thoại,..." /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Thể loại" name="category"><Select placeholder="Any"><Option value="phone">Điện thoại</Option></Select></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Mã sản phẩm" name="productCode"><Input placeholder="Seri điện thoại, số khung,..." /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Mô tả" name="description"><Input.TextArea rows={4} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Giá sản phẩm" name="price"><InputNumber placeholder="10.000.000 vnd" style={{ width: '100%' }} formatter={(value) => `${value}.replace(/\B(?=(\d{3})+(?!\d))/g, ',')`} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Hình ảnh của sản phẩm" name="images"><Upload.Dragger name="files"><p className="ant-upload-drag-icon"><InboxOutlined /></p></Upload.Dragger></Form.Item></Col>
            <Col xs={24} md={6}><Form.Item label="Tiền lời 1 ngày" name="dailyInterest"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} md={6}><Form.Item label="Số lượng" name="quantity"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} md={6}><Form.Item label="Ngày bắt đầu cầm" name="startDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} md={6}><Form.Item label="Ngày kết thúc cầm" name="endDate"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
        </Card>
        <Card title={<Title level={5}>Thông tin khách hàng</Title>} className="form-card">
          <Form.Item name="customerType">
            <Radio.Group defaultValue="existing">
              <Radio value="existing">Đã có tài khoản</Radio>
              <Radio value="new">Chưa có tài khoản</Radio>
            </Radio.Group>
          </Form.Item>
          <Row gutter={24}>
            <Col xs={24} md={12}><Form.Item label="Tên khách hàng" name="customerName"><Select placeholder="Chọn từ danh sách or nhập tên"><Option value="customer1">Nguyễn Văn A</Option></Select></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Địa chỉ" name="address"><Input placeholder="12345679" /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="CCCD" name="idCard"><Input placeholder="12345679" /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Số điện thoại" name="phone"><Input placeholder="12345679" /></Form.Item></Col>
          </Row>
        </Card>
        <div className="action-buttons">
          <Button size="large">Cancel</Button>
          <Button type="primary" className='bg-success' size="large" htmlType="submit">Save</Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminProductCreatePage;