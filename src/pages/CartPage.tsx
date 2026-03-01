import { useCart } from '@/hooks/useCart';
import { usePayment } from '@/hooks/usePayment';
import { CartItem } from '@/type/cart.type';
import {
  Button,
  Checkbox,
  Empty,
  List,
  Space,
  Spin,
  Tag,
  Typography,
  message
} from 'antd';
import { useState } from 'react';

const { Text, Title } = Typography;

const CartPage = () => {
  const { cart, isLoading, removeItem, cartTotal } = useCart() as {
    cart: CartItem[];
    isLoading: boolean;
    removeItem: (id: number, options?: any) => void;
    cartTotal: number;
  };
  const { processPayment, isProcessing } = usePayment();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const formatCurrency = (value: number) => `${(value || 0).toLocaleString()} vnd`;

  const onSelectAll = (e: any) => {
    if (e.target.checked) {
      const allIds = cart.map((item: CartItem) => item.productId);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const onSelectItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const calculateSelectedTotal = () => {
    return cart
      .filter((item: CartItem) => selectedIds.includes(item.productId))
      .reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  };

  const handleRemove = (productId: number) => {
    removeItem(productId, {
      onSuccess: () => {
        message.success("Đã xóa sản phẩm");
        setSelectedIds(prev => prev.filter(id => id !== productId));
      }
    });
  };

  const handlePayment = () => {
    if (selectedIds.length === 0) return;

    processPayment(
      { productIds: selectedIds },
      {
        onSuccess: (res: any) => {
          const checkoutUrl = res?.sessionUrl || res?.data?.sessionUrl;

          if (checkoutUrl) {
            message.loading("Đang chuyển hướng đến cổng thanh toán Stripe...", 1.5);
            setTimeout(() => {
              window.location.href = checkoutUrl;
            }, 800);
          } else {
            message.error("Không tìm thấy liên kết thanh toán. Vui lòng thử lại.");
          }
        },
        onError: (error: any) => {
          message.error(error?.response?.data?.message || "Thanh toán thất bại, vui lòng thử lại.");
        },
      }
    );
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!cart || cart.length === 0) return <Empty description="Giỏ hàng trống" style={{ marginTop: 100 }} />;

  return (
    <div className="cart-container" style={{ padding: '20px', maxWidth: 1000, margin: '0 auto' }}>
      <Title level={3}>Giỏ hàng ({cart.length})</Title>

      <List
        dataSource={cart}
        renderItem={(item: CartItem) => (
          <div
            key={item.productId}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
              gap: '16px',
              background: '#fff'
            }}
          >
            <Checkbox
              checked={selectedIds.includes(item.productId)}
              onChange={() => onSelectItem(item.productId)}
            />

            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.productName}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
            />

            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '16px', display: 'block' }}>{item.productName}</Text>
              <Text type="danger">{formatCurrency(item.price)}</Text>
              <div><Tag color="orange" style={{ marginTop: 4 }}>{item.status}</Tag></div>
            </div>

            <div style={{ textAlign: 'right', minWidth: 120 }}>
              <div style={{ marginBottom: 8 }}>Số lượng: {item.quantity}</div>
              <Text strong>{formatCurrency(item.price * item.quantity)}</Text>
              <div style={{ marginTop: 8 }}>
                <Button type="link" danger onClick={() => handleRemove(item.productId)} size="small">
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      />

      <div style={{
        marginTop: 24,
        padding: '24px',
        background: '#fafafa',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Space size="large">
          <Checkbox
            onChange={onSelectAll}
            checked={selectedIds.length === cart.length && cart.length > 0}
          >
            Chọn tất cả
          </Checkbox>
          <Button type="link" onClick={() => setSelectedIds([])} disabled={selectedIds.length === 0}>
            Bỏ chọn
          </Button>
        </Space>

        <Space size="large">
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#8c8c8c' }}>Tổng cộng: {formatCurrency(cartTotal)}</div>
            <Text strong style={{ fontSize: 20 }}>
              Thanh toán: <span style={{ color: '#ff4d4f' }}>{formatCurrency(calculateSelectedTotal())}</span>
            </Text>
          </div>
          <Button
            type="primary"
            danger
            size="large"
            disabled={selectedIds.length === 0}
            style={{ height: 48, padding: '0 32px' }}
            onClick={handlePayment}
            loading={isProcessing}
          >
            Mua ngay ({selectedIds.length})
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default CartPage;