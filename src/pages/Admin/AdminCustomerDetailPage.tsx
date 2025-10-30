import React, { useEffect, useState } from 'react';
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
  type TableProps,
} from 'antd';
import { EditOutlined, MoreOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

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
  { title: 'Status', dataIndex: 'status', key: 'status', width: '5%', align: 'center', render: () => <div style={{ width: 15, height: 15, backgroundColor: 'green', borderRadius: '50%', margin: 'auto' }} /> },
  { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
  { title: 'Giá', dataIndex: 'price', key: 'price' },
  { title: 'Task', dataIndex: 'task', key: 'task' },
  { title: 'Start date', dataIndex: 'startDate', key: 'startDate' },
  { title: 'Capacity', dataIndex: 'capacity', key: 'capacity', render: (percent: number) => <>{percent}%</> },
];

const dropdownItems: MenuProps['items'] = [
  { key: '1', label: 'Vô hiệu hóa' },
  { key: '2', label: 'Admin' },
];

const AdminCustomerDetailPage: React.FC = () => {
  const [form] = Form.useForm();
  form.setFieldsValue(userData);
  const [isDisableForm, setIsDisableForm] = useState(true);
  const [tableRowsVisible, setTableRowsVisible] = useState(true);

  const toggleProductTableRows = () => {
    setTableRowsVisible(!tableRowsVisible);
  };

  return (
    <div className="user-detail-page">
      <Row className='bg-white p-4 radius-16'>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={18} lg={18}>
            <div className="card-header">
              <Title level={5}>Chi tiết</Title>
              <Button type="text" icon={<EditOutlined />} onClick={() => setIsDisableForm(!isDisableForm)} />
            </div>
            <Form form={form} layout="vertical" disabled={isDisableForm}>
              <Row gutter={24}>
                <Col xs={24} md={12}><Form.Item label="Tên" name="name"><Input /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="Email" name="email"><Input /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="Thành phố" name="city"><Select><Option value="Paris">Paris</Option></Select></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="Phường" name="district"><Input /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="Địa chỉ" name="address"><Input /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="SĐT" name="phone"><Input /></Form.Item></Col>
              </Row>
              <Form.Item>
                <Button type="primary" className='bg-success'>Save</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={6} lg={6} className='flex-column align-center'>
            <Avatar size={80} src={userData.avatarUrl} />
            <Title level={4} className='mt-4 text-center'>{userData.name}</Title>
            <Text type="secondary">Khách hàng</Text>
            <Flex className='mt-2'>
              <div className="profile-actions">
                <Button icon={<img
                  // src={mailIcon}
                  alt="Google"
                  style={{
                    width: '1em',
                    height: '1em',
                    verticalAlign: 'middle',
                  }}
                />} />
              </div>
              <div className="profile-actions ml-2">
                <Dropdown menu={{ items: dropdownItems }}>
                  <Button icon={<MoreOutlined className='text-blue' />} />
                </Dropdown>
              </div>
            </Flex>
          </Col>
        </Row>
      </Row>
      <Row className='bg-white mt-8 p-4 radius-16'>
        <Card className="products-table-card w-100">
          <div className="card-header">
            <Title level={5}>Sản phẩm đã cầm</Title>
            <Button
              type="text"
              icon={tableRowsVisible ? <UpOutlined className='text-blue' /> : <DownOutlined className='text-blue' />}
              onClick={toggleProductTableRows}
            />
          </div>
          <Table
            columns={productColumns}
            dataSource={tableRowsVisible ? userProducts : []}
            locale={{ emptyText: tableRowsVisible ? undefined : ' ' }}
            pagination={false}
            className="product-table-content"
          />
        </Card>
      </Row>
    </div>
  );
};

export default AdminCustomerDetailPage;