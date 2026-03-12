import { useOrder } from '@/hooks/useOrder';
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Result, Space, Spin, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Text } = Typography;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  const { useGetOrderStatus } = useOrder();
  const { data: statusData, isLoading: isPolling } = useGetOrderStatus(
    Number(orderId)
  );

  const isVerifying = isPolling || (statusData && statusData.status === 'PENDING');

  if (isVerifying) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <Spin size="large" />
        <Text strong style={{ fontSize: 18 }}>
          Đang xác nhận giao dịch từ hệ thống...
        </Text>
        <Text type="secondary">Vui lòng không đóng trình duyệt</Text>
        {orderId && <Text type="secondary">Mã đơn hàng: #{orderId}</Text>}
      </div>
    );
  }

  const isSuccess = statusData?.status === 'PAID' || !orderId; // Default to success if no orderId (legacy/manual check)

  return (
    <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
      <Card
        bordered={false}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: 12 }}
      >
        <Result
          status={isSuccess ? 'success' : 'error'}
          title={
            <span style={{ fontSize: 28, fontWeight: 700 }}>
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </span>
          }
          subTitle={
            <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
              <Text style={{ fontSize: 16 }}>
                {isSuccess
                  ? 'Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được hệ thống xử lý.'
                  : 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra lại.'}
              </Text>
              {orderId && (
                <Text type="secondary">Mã đơn hàng: #{orderId}</Text>
              )}
              {sessionId && (
                <Text type="secondary" copyable={{ text: sessionId }}>
                  Mã giao dịch Stripe: {sessionId.substring(0, 20)}...
                </Text>
              )}
            </Space>
          }
          extra={[
            <Button
              type="primary"
              key="home"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              style={{ borderRadius: 6, height: 45 }}
            >
              Về trang chủ
            </Button>,
            <Button
              key="orders"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate('/orders')}
              style={{ borderRadius: 6, height: 45 }}
            >
              Xem đơn hàng
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentSuccess;