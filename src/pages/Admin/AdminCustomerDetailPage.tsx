// [UI ONLY] Redesigned AdminCustomerDetailPage with improved layout and styling
import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Avatar,
  Table,
  Dropdown,
  MenuProps,
  Flex,
  Tag,
  Space,
  theme,
  Divider,
  type TableProps,
} from 'antd';
import { 
  EditOutlined, 
  MoreOutlined, 
  DownOutlined, 
  UpOutlined,
  MailOutlined,
  SaveOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface ProductDataType {
  key: string;
  status: string;
  name: string;
  price: string;
  task: string;
  startDate: string;
  capacity: number;
}

const userData = {
  name: 'Dominique Charpentier',
  email: 'abc@gmail.com',
  city: 'Paris',
  district: 'Finance',
  address: 'Moonlight - Paris',
  phone: '123456789',
  avatarUrl: 'https://i.pravatar.cc/150?u=dominique',
};

const userProducts = [
  { key: '1', status: 'active', name: 'Điện thoại samsung', price: '10.000.000', task: 'Management', startDate: '11.06.2019', capacity: 35 },
  { key: '2', status: 'active', name: 'Xe oto honda', price: '10.000.000', task: 'Support', startDate: '12.02.2019', capacity: 65 },
];

const productColumns: TableProps<ProductDataType>['columns'] = [
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status', 
    width: 120,
    render: (status) => (
      <Tag bordered={false} color={status === 'active' ? 'success' : 'default'}>
        {status === 'active' ? 'Đang cầm' : 'Đã chuộc'}
      </Tag>
    ) 
  },
  { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
  { title: 'Giá định giá', dataIndex: 'price', key: 'price', render: (text) => <Text>{text}đ</Text> },
  { title: 'Phân loại', dataIndex: 'task', key: 'task', render: (text) => <Tag bordered={false}>{text}</Tag> },
  { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', render: (text) => <Text type="secondary">{text}</Text> },
  { title: 'Tỉ suất', dataIndex: 'capacity', key: 'capacity', align: 'right', render: (percent: number) => <Text strong style={{ color: '#1677ff' }}>{percent}%</Text> },
];

const dropdownItems: MenuProps['items'] = [
  { key: 'disable', label: 'Vô hiệu hóa tài khoản', danger: true },
  { key: 'admin', label: 'Đặt làm quản trị viên' },
];

const AdminCustomerDetailPage: React.FC = () => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [isDisableForm, setIsDisableForm] = useState(true);
  const [tableRowsVisible, setTableRowsVisible] = useState(true);

  const toggleProductTableRows = () => {
    setTableRowsVisible(!tableRowsVisible);
  };

  return (
    <Flex vertical gap={24}>
      {/* [UI ONLY] Header Section */}
      <Flex align="center" justify="space-between">
        <Flex vertical gap={4}>
          <Title level={4} style={{ margin: 0 }}>Chi tiết khách hàng</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Xem và chỉnh sửa thông tin hồ sơ khách hàng</Text>
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
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 12 }}
            title={
              <Flex justify="space-between" align="center">
                <Text strong>Thông tin cá nhân</Text>
                <Button 
                  type={isDisableForm ? "default" : "primary"} 
                  ghost={isDisableForm}
                  icon={isDisableForm ? <EditOutlined /> : <SaveOutlined />} 
                  onClick={() => setIsDisableForm(!isDisableForm)}
                >
                  {isDisableForm ? "Chỉnh sửa" : "Lưu thay đổi"}
                </Button>
              </Flex>
            }
          >
            <Form form={form} layout="vertical" disabled={isDisableForm} initialValues={userData}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Địa chỉ Email" name="email" rules={[{ type: 'email' }]}>
                    <Input placeholder="example@gmail.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Thành phố/Tỉnh" name="city">
                    <Select placeholder="Chọn thành phố">
                      <Option value="Paris">Paris</Option>
                      <Option value="HN">Hà Nội</Option>
                      <Option value="HCM">TP. Hồ Chí Minh</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Quận/Phường" name="district">
                    <Input placeholder="Nhập quận/phường" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Địa chỉ chi tiết" name="address">
                    <Input placeholder="Số nhà, tên đường..." />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input placeholder="09xxxxxxxx" />
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
              borderRadius: 12,
              textAlign: 'center' 
            }}
          >
            <Flex vertical align="center" gap={16} style={{ padding: '16px 0' }}>
              <Avatar 
                size={100} 
                src={userData.avatarUrl} 
                icon={<UserOutlined />}
                style={{ border: `4px solid ${token.colorPrimaryBg}` }}
              />
              <Flex vertical gap={4}>
                <Title level={4} style={{ margin: 0 }}>{userData.name}</Title>
                <Tag color="blue" bordered={false} style={{ margin: '0 auto' }}>Thành viên thân thiết</Tag>
              </Flex>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Flex justify="space-around" style={{ width: '100%' }}>
                <Flex vertical>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tổng sản phẩm</Text>
                  <Text strong style={{ fontSize: 18 }}>24</Text>
                </Flex>
                <Flex vertical>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tổng giá trị</Text>
                  <Text strong style={{ fontSize: 18, color: token.colorSuccess }}>120M</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* [UI ONLY] Products Table */}
      <Card 
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 12 }}
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
          dataSource={tableRowsVisible ? userProducts : []}
          pagination={false}
          size="middle"
        />
      </Card>
    </Flex>
  );
};

export default AdminCustomerDetailPage;