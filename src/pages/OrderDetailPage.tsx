import { useOrder } from '@/hooks/useOrder';
import { OrderStatus } from '@/type/order.type';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetOrderDetail } = useOrder();
  const { data: order, isLoading } = useGetOrderDetail(Number(id));

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
      case OrderStatus.COMPLETED:
        return 'success';
      case OrderStatus.PENDING:
        return 'processing';
      case OrderStatus.CANCELLED:
      case OrderStatus.FAILED:
        return 'error';
      case OrderStatus.SHIPPING:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
        return 'Đã thanh toán';
      case OrderStatus.COMPLETED:
        return 'Hoàn thành';
      case OrderStatus.PENDING:
        return 'Chờ thanh toán';
      case OrderStatus.CANCELLED:
        return 'Đã hủy';
      case OrderStatus.FAILED:
        return 'Thanh toán thất bại';
      case OrderStatus.SHIPPING:
        return 'Đang giao hàng';
      default:
        return status;
    }
  };

  const itemColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_: any, record: any) => (
        <Space>
          <img
            src={record.productImage || 'https://via.placeholder.com/60'}
            alt={record.productName}
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
          />
          <Text strong>{record.productName}</Text>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} vnd`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: any) => (
        <Text strong>{(record.price * record.quantity).toLocaleString()} vnd</Text>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Skeleton active />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/orders')}
        style={{ marginBottom: 24, borderRadius: 8 }}
      >
        Quay lại đơn hàng
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết sản phẩm</Title>}
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <Table
              columns={itemColumns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
            />
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space direction="vertical" align="end">
                <Text type="secondary">Tạm tính: {order.totalAmount.toLocaleString()} vnd</Text>
                <Text type="secondary">Phí vận chuyển: 0 vnd</Text>
                <Title level={4} style={{ margin: 0 }}>
                  Tổng cộng: <Text style={{ color: '#ff4d4f' }}>{order.totalAmount.toLocaleString()} vnd</Text>
                </Title>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size={24}>
            <Card
              title="Trạng thái đơn hàng"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <Tag
                  color={getStatusColor(order.status)}
                  style={{
                    fontSize: 16,
                    padding: '8px 16px',
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  {getStatusLabel(order.status)}
                </Tag>
                <br />
                <Text type="secondary">Mã đơn hàng: #{order.orderCode}</Text>
                <br />
                <Text type="secondary">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                </Text>
              </div>
            </Card>

            <Card
              title="Thông tin giao hàng"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <Descriptions column={1}>
                <Descriptions.Item label={<UserOutlined />}>
                  <Text strong>{order.shippingName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<PhoneOutlined />}>
                  {order.shippingPhone}
                </Descriptions.Item>
                <Descriptions.Item label={<EnvironmentOutlined />}>
                  {order.shippingAddress}
                </Descriptions.Item>
              </Descriptions>
              {order.note && (
                <>
                  <Divider style={{ margin: '12px 0' }} />
                  <Text type="secondary">Ghi chú: {order.note}</Text>
                </>
              )}
            </Card>

            <Card
              title="Phương thức thanh toán"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <Text strong>{order.paymentMethod}</Text>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
