import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Result, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Text } = Typography;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const verifyPayment = async () => {
        try {
          setIsVerifying(true);
          // TODO: Gọi API backend của bạn để verify sessionId này
          // await api.post('/orders/verify', { sessionId });
          setTimeout(() => setIsVerifying(false), 2000);
        } catch (error) {
          console.error("Verification failed", error);
          setIsVerifying(false);
        }
      };
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 20 }}>
        <Spin size="large" />
        <Text strong style={{ fontSize: 18 }}>Đang xác nhận giao dịch từ Stripe...</Text>
        <Text type="secondary">Vui lòng không đóng trình duyệt</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: 12 }}>
        <Result
          status="success"
          title={<span style={{ fontSize: 28, fontWeight: 700 }}>Thanh toán thành công!</span>}
          subTitle={
            <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
              <Text style={{ fontSize: 16 }}>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được hệ thống xử lý.</Text>
              {sessionId && <Text type="secondary" copyable={{ text: sessionId }}>Mã giao dịch: {sessionId.substring(0, 20)}...</Text>}
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