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
} from 'antd';
import {
  UsergroupAddOutlined,
  ShoppingOutlined,
  DesktopOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const productsData = [
  { key: '1', productName: 'Jane Cooper', price: '10.000.000', ownerPhone: '(225) 555-0118', ownerName: 'Nguyễn Văn Hùng', type: 'Điện thoại', status: 'Active' },
  { key: '2', productName: 'Floyd Miles', price: '10.000.000', ownerPhone: '(205) 555-0100', ownerName: 'floyd@yahoo.com', type: 'Laptop', status: 'Inactive' },
  { key: '3', productName: 'Ronald Richards', price: '10.000.000', ownerPhone: '(302) 555-0107', ownerName: 'ronald@adobe.com', type: 'Xe Máy', status: 'Inactive' },
  { key: '4', productName: 'Marvin McKinney', price: '10.000.000', ownerPhone: '(252) 555-0126', ownerName: 'marvin@tesla.com', type: 'Laptop', status: 'Active' },
  { key: '5', productName: 'Jerome Bell', price: '10.000.000', ownerPhone: '(629) 555-0129', ownerName: 'jerome@google.com', type: 'Laptop', status: 'Active' },
  { key: '6', productName: 'Kathryn Murphy', price: '10.000.000', ownerPhone: '(406) 555-0120', ownerName: 'kathryn@microsoft.com', type: 'Laptop', status: 'Active' },
  { key: '7', productName: 'Jacob Jones', price: '10.000.000', ownerPhone: '(208) 555-0112', ownerName: 'jacob@yahoo.com', type: 'Laptop', status: 'Active' },
  { key: '8', productName: 'Kristin Watson', price: '10.000.000', ownerPhone: '(704) 555-0127', ownerName: 'kristin@facebook.com', type: 'Laptop', status: 'Inactive' },
  ...Array.from({ length: 15 }, (_, i) => ({
    key: 8 + i, productName: 'Jane Cooper', price: '10.000.000', ownerPhone: '(225) 555-0118', ownerName: 'Nguyễn Văn Hùng', type: 'Điện thoại', status: 'Active'
  })),
];

const columns = [
  { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
  { title: 'Giá', dataIndex: 'price', key: 'price' },
  { title: 'SĐT Người sở hữu', dataIndex: 'ownerPhone', key: 'ownerPhone' },
  { title: 'Người sở hữu', dataIndex: 'ownerName', key: 'ownerName' },
  { title: 'Loại', dataIndex: 'type', key: 'type' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'Active' ? 'success' : 'error'}>{status}</Tag>
    ),
  },
];

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const handleRowClick = (record: { key: string | number }) => {
    navigate(`/admin/products/${record.key}`);
  };
  return (
    <div className="admin-products-page">
      <Row gutter={[24, 24]} className="stats-cards-products">
        <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng khách" value={5423} prefix={<UsergroupAddOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng sản phẩm" value={1893} prefix={<ShoppingOutlined />} /></Card></Col>
        <Col xs={24} sm={24} lg={8}><Card><Statistic title="Tài khoản hoạt động" value={189} prefix={<DesktopOutlined />} /></Card></Col>
      </Row>
      <Card className="products-table-card">
        <div className="table-toolbar mb-6">
          <Title level={5} className="mt-0">Tất cả sản phẩm</Title>
          <Space className="toolbar-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/products/create')}
            >
              Mới
            </Button>
            <Input placeholder="Tìm khách hàng" prefix={<SearchOutlined />} />
            <Select defaultValue="newest">
              <Option value="newest">Short by: Newest</Option>
              <Option value="oldest">Short by: Oldest</Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={productsData}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          pagination={{
            position: ['bottomCenter'],
            total: productsData.length,
            showTotal: (total, range) => `Showing data ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: false
          }}
        />
      </Card>
    </div>
  );
};

export default AdminProductsPage;