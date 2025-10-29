import React from 'react';
import {
  Card,
  Typography,
  Button,
  Table,
  Input,
  Select,
  Space,
  Tag,
  type TableProps,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface OrderDataType {
  key: string;
  customerName: string;
  orderDate: string;
  phone: string;
  orderId: string;
  address: string;
  status: 'Đã giao' | 'Đã hủy' | 'Đang giao';
}

const orderData: OrderDataType[] = [
  { key: '1', customerName: 'Jane Cooper', orderDate: '2025-12-12 20:30:30', phone: '(225) 555-0118', orderId: '123456678', address: 'United States', status: 'Đã giao' },
  { key: '2', customerName: 'Floyd Miles', orderDate: '2025-12-12 20:30:30', phone: '(205) 555-0100', orderId: '123456678', address: 'Kiribati', status: 'Đã giao' },
  { key: '3', customerName: 'Ronald Richards', orderDate: '2025-12-12 20:30:30', phone: '(302) 555-0107', orderId: '123456678', address: 'Israel', status: 'Đã hủy' },
  { key: '4', customerName: 'Marvin McKinney', orderDate: '2025-12-12 20:30:30', phone: '(252) 555-0126', orderId: '123456678', address: 'Iran', status: 'Đang giao' },
  { key: '5', customerName: 'Jerome Bell', orderDate: '2025-12-12 20:30:30', phone: '(629) 555-0129', orderId: '123456678', address: 'Réunion', status: 'Đã giao' },
  { key: '6', customerName: 'Kathryn Murphy', orderDate: '2025-12-12 20:30:30', phone: '(406) 555-0120', orderId: '123456678', address: 'Curaçao', status: 'Đã hủy' },
  { key: '7', customerName: 'Jacob Jones', orderDate: '2025-12-12 20:30:30', phone: '(208) 555-0112', orderId: '123456678', address: 'Brazil', status: 'Đang giao' },
  { key: '8', customerName: 'Kristin Watson', orderDate: '2025-12-12 20:30:30', phone: '(704) 555-0127', orderId: '123456678', address: 'Åland Islands', status: 'Đã giao' },
  { key: '9', customerName: 'Kristin Watson', orderDate: '2025-12-12 20:30:30', phone: '(704) 555-0127', orderId: '123456678', address: 'Åland Islands', status: 'Đã hủy' },
  { key: '10', customerName: 'Kristin Watson', orderDate: '2025-12-12 20:30:30', phone: '(704) 555-0127', orderId: '123456678', address: 'Åland Islands', status: 'Đang giao' },
  { key: '11', customerName: 'Kristin Watson', orderDate: '2025-12-12 20:30:30', phone: '(704) 555-0127', orderId: '123456678', address: 'Åland Islands', status: 'Đã giao' },
  { key: '12', customerName: 'Kristin Watson', orderDate: '2025-12-12 20:30:30', phone: '(704) 555-0127', orderId: '123456678', address: 'Åland Islands', status: 'Đã hủy' },
];

const getStatusColor = (status: OrderDataType['status']): string => {
  switch (status) {
    case 'Đã giao': return 'success';
    case 'Đã hủy': return 'error';
    case 'Đang giao': return 'warning';
    default: return 'default';
  }
};

const columns: TableProps<OrderDataType>['columns'] = [
  { title: 'Tên khách hàng', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Ngày đặt', dataIndex: 'orderDate', key: 'orderDate' },
  { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
  { title: 'Mã đơn hàng', dataIndex: 'orderId', key: 'orderId' },
  { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: OrderDataType['status']) => (
      <Tag color={getStatusColor(status)}>{status}</Tag>
    ),
  },
];

const AdminOrderReportPage: React.FC = () => {
  return (
    <div className="orders-report-page">
      <Card className="orders-table-card">
        <div className="table-toolbar mb-6">
          <Title level={5}>Tất cả đơn hàng</Title>
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
          dataSource={orderData}
          pagination={{
            position: ['bottomCenter'],
            total: orderData.length,
            showTotal: (total, range) => `Showing data ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: false,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminOrderReportPage;