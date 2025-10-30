import React from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Button,
  Table,
  Input,
  Select,
  Space,
  Tag,
  type TableProps,
} from 'antd';
import {
  UsergroupAddOutlined,
  ShoppingOutlined,
  DesktopOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
interface CustomerDataType {
  key: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
}

const customersData: CustomerDataType[] = [
  { key: '1', name: 'Jane Cooper', company: 'Microsoft', phone: '(225) 555-0118', email: 'jane@microsoft.com', country: 'United States' },
  { key: '2', name: 'Floyd Miles', company: 'Yahoo', phone: '(205) 555-0100', email: 'floyd@yahoo.com', country: 'Kiribati' },
  { key: '3', name: 'Ronald Richards', company: 'Adobe', phone: '(302) 555-0107', email: 'ronald@adobe.com', country: 'Israel' },
  { key: '4', name: 'Marvin McKinney', company: 'Tesla', phone: '(252) 555-0126', email: 'marvin@tesla.com', country: 'Iran' },
  { key: '5', name: 'Jerome Bell', company: 'Google', phone: '(629) 555-0129', email: 'jerome@google.com', country: 'Réunion' },
  { key: '6', name: 'Kathryn Murphy', company: 'Microsoft', phone: '(406) 555-0120', email: 'kathryn@microsoft.com', country: 'Curaçao' },
  { key: '7', name: 'Jacob Jones', company: 'Yahoo', phone: '(208) 555-0112', email: 'jacob@yahoo.com', country: 'Brazil' },
  { key: '8', name: 'Kristin Watson', company: 'Facebook', phone: '(704) 555-0127', email: 'kristin@facebook.com', country: 'Åland Islands' },
];

const AdminCustomersPage: React.FC = () => {
  const navigate = useNavigate();

  const columns: TableProps<CustomerDataType>['columns'] = [
    { title: 'Tên khách hàng', dataIndex: 'name', key: 'name' },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Địa chỉ', dataIndex: 'country', key: 'country' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { key: string }) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/customers / ${record.key}`);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete user:', record.key);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="customers-page">
      <Row gutter={[24, 24]} className="stats-cards-customers">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Tổng khách" value={5423} prefix={<UsergroupAddOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Tổng sản phẩm" value={1893} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <Card>
            <Statistic title="Tài khoản hoạt động" value={189} prefix={<DesktopOutlined />} />
          </Card>
        </Col>
      </Row>
      <Card className="customers-table-card">
        <div className="table-toolbar">
          <div>
            <Title level={5}>Tất cả khách hàng</Title>
            <Tag color="green">Active Members</Tag>
          </div>
          <Space>
            <Input placeholder="Tìm khách hàng" prefix={<SearchOutlined />} />
            <Select defaultValue="newest">
              <Option value="newest">Short by: Newest</Option>
              <Option value="oldest">Short by: Oldest</Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={customersData}
          pagination={{
            position: ['bottomCenter'],
            total: customersData.length,
            showTotal: (total, range) => `Showing data ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: false
          }}
        />
      </Card>
    </div>
  );
};

export default AdminCustomersPage;