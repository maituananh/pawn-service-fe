import React, { useEffect, useState } from 'react';
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
  message,
  UploadFile,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import fileApi from '@/api/filesApi';
import productsApi from '@/api/productsApi';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';

const { Title } = Typography;
const { Option } = Select;

const AdminProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { categories, isLoading, isError, error, refetch } = useCategories();
  const [categoryOptions, setCategoryOptions] = useState([]);
  useEffect(() => {
    if (!categories) return;
    setCategoryOptions(categories.map(item => ({ label: item.name, value: item.id })))
  }, [
    categories
  ])
  const handleBeforeUpload = () => false;
  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const onFinish = async (values: any) => {
    const { name, price, startDate, endDate, type } = values;
    try {
      setLoading(true);

      const imageIds: number[] = [];
      if (fileList.length > 0) {
        const uploadResults = await Promise.all(
          fileList.map(async (f) => {
            const res = await fileApi.upload(f.originFileObj as File);
            return res.id;
          }),
        );
        imageIds.push(...uploadResults);
      }
      const payload = {
        id: Math.floor(Math.random() * 1000000),
        name,
        price,
        startDay: dayjs(startDate).toISOString(),
        endDate: dayjs(endDate).toISOString(),
        type,
        imageIds,
      };
      await productsApi.create(payload);
      message.success('Tạo sản phẩm thành công!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error(error);
      message.error('Tạo sản phẩm thất bại!');
    } finally {
      setLoading(false);
      navigate('/admin/products', { replace: true })
    }
  };

  return (
    <div className="create-product-page">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title={<Title level={5}>Tạo sản phẩm mới</Title>} className="form-card">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input placeholder="Điện thoại,..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Thể loại"
                name="type"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
              >
                <Select placeholder="Category" options={categoryOptions}>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Mã sản phẩm" name="code">
                <Input placeholder="Seri điện thoại, số khung,..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giá sản phẩm"
                name="price"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá sản phẩm' },
                  { type: 'number', min: 0, message: 'Giá phải ≥ 0' },
                ]}
              >
                <InputNumber min={0} placeholder="10.000.000 vnd" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}><Form.Item label="Hình ảnh của sản phẩm" name="images">
              <Upload.Dragger
                multiple
                listType="picture"
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
                onChange={handleChange}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
              </Upload.Dragger>
            </Form.Item></Col>
            <Col xs={24} md={6}>
              <Form.Item label="Tiền lời 1 ngày" name="dailyInterest"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} md={6}>
              <Form.Item label="Số lượng" name="quantity"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá sản phẩm' },
                  { type: 'number', min: 0, message: 'Giá phải ≥ 0' },
                ]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Ngày bắt đầu cầm"
                name="startDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Ngày kết thúc cầm"
                name="endDate"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue('startDate');
                      if (!value || !startDate || value.isAfter(startDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
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
          <Button size="large" onClick={() => navigate('/admin/products', { replace: true })}>Cancel</Button>
          <Button type="primary" className='bg-success' size="large" htmlType="submit">Save</Button>
        </div>
      </Form >
    </div >
  );
};

export default AdminProductCreatePage;