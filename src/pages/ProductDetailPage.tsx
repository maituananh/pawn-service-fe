import { useCart } from "@/hooks/useCart";
import { useProduct, useRelatedProducts } from "@/hooks/useProduct";
import { 
  ShoppingCartOutlined, 
  ArrowLeftOutlined, 
  SafetyCertificateOutlined, 
  ThunderboltOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  InputNumber,
  message,
  Row,
  Spin,
  Typography,
  Tag,
  Breadcrumb,
  Descriptions,
  Flex,
  theme,
  Badge
} from "antd";
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();

  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { data: relatedPage, isLoading: isLoadingRelated } = useRelatedProducts(Number(id), 1, 5);
  const { addToCart, isAdding } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    const avail = product.availableQty ?? product.quantity;
    if (avail <= 0) {
      messageApi.warning('Sản phẩm này đã hết hàng.');
      return;
    }
    addToCart(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          messageApi.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
        },
        onError: () => {
          messageApi.error("Có lỗi xảy ra, vui lòng thử lại sau.");
        },
      }
    );
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const avail = product.availableQty ?? product.quantity;
    if (avail <= 0) {
      messageApi.warning('Sản phẩm này đã hết hàng.');
      return;
    }
    
    try {
      await addToCart({ productId: product.id, quantity });
      navigate('/checkout');
    } catch (error) {
      // Error is handled by axiosClient/errorEmitter already, but we can add specific handling here if needed
      messageApi.error("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;
  if (isError || !product) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <Title level={4}>Không tìm thấy sản phẩm</Title>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>Quay lại danh sách</Button>
    </div>
  );

  const isOutOfStock = (product.availableQty ?? product.quantity) <= 0;
  const mainImageUrl = selectedImage || product?.images?.[0]?.url || product?.image;

  return (
    <div className="product-detail-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {contextHolder}
      
      {/* Out of stock banner */}
      {isOutOfStock && (
        <div style={{
          background: '#1c1c1c',
          color: '#fff',
          borderRadius: 12,
          padding: '14px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}>
          <span style={{ fontSize: 22 }}>🚫</span>
          <span>Sản phẩm này <strong>đã hết hàng</strong> và không thể mua hay thêm vào giỏ.</span>
        </div>
      )}
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        style={{ marginBottom: 24 }}
        items={[
          { title: <a onClick={() => navigate('/')}>Trang chủ</a> },
          { title: <a onClick={() => navigate('/products')}>Sản phẩm</a> },
          { title: product.name },
        ]}
      />

      <Row gutter={[48, 48]}>
        {/* Left Column: Image Gallery */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <Flex vertical gap={12}>
                {(product?.images || []).map((img: any, index: number) => {
                  const isActive = (selectedImage === img.url) || (!selectedImage && index === 0);
                  return (
                    <div
                      key={img.id || index}
                      onClick={() => setSelectedImage(img.url)}
                      style={{
                        border: isActive ? `2px solid ${token.colorPrimary}` : "1px solid #f0f0f0",
                        borderRadius: 12,
                        cursor: "pointer",
                        overflow: "hidden",
                        padding: 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isActive ? `0 0 10px ${token.colorPrimary}40` : 'none',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`thumb-${index}`}
                        style={{ width: "100%", height: 75, objectFit: "cover", borderRadius: 10 }}
                      />
                    </div>
                  );
                })}
              </Flex>
            </Col>

            <Col span={20}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 20,
                  textAlign: "center",
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {product.status === 'LIQUIDATION' && (
                  <Tag color="red" style={{ position: 'absolute', top: 20, right: 20, padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
                    Thanh lý
                  </Tag>
                )}
                {isOutOfStock && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{
                      background: '#1c1c1c',
                      color: '#fff',
                      fontSize: 22,
                      fontWeight: 900,
                      padding: '10px 28px',
                      borderRadius: 14,
                      letterSpacing: '0.04em',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    }}>Hết hàng</span>
                  </div>
                )}
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 600,
                    borderRadius: 12,
                    transition: 'transform 0.5s',
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>

        {/* Right Column: Product Info */}
        <Col xs={24} lg={12}>
          <div className="product-header">
            <Tag color="blue" style={{ marginBottom: 12, borderRadius: 20 }}>{product.category?.name || product.category || 'Chưa phân loại'}</Tag>
            <Title level={1} style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>
              {product.name}
            </Title>
            
            <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 36, fontWeight: 900, color: token.colorPrimary }}>
                {product.price.toLocaleString()} <small>vnđ</small>
              </Text>
              {product.oldPrice && (
                <Text delete style={{ fontSize: 20, color: '#999' }}>
                  {product.oldPrice.toLocaleString()} vnđ
                </Text>
              )}
            </Flex>

            <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
              {product.description || "Sản phẩm chính hãng với mức giá cạnh tranh nhất trên thị trường. Bảo hành uy tín từ hệ thống Thảo Quyên."}
            </Paragraph>

            <Descriptions
              title="Thông tin chi tiết"
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 32 }}
              styles={{ label: { width: 140, fontWeight: 600, background: '#fafafa' } }}
            >
              <Descriptions.Item label="Mã sản phẩm">
                <Text strong code>{product.code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Loại sản phẩm">
                <Tag color="cyan">{product.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                <Badge
                  status={(product.availableQty ?? product.quantity) > 0 ? 'success' : 'error'}
                  text={(product.availableQty ?? product.quantity) > 0
                    ? `Còn hàng (${product.availableQty ?? product.quantity})`
                    : 'Hết hàng'}
                />
              </Descriptions.Item>
            </Descriptions>

            <Flex vertical gap={16} style={{ marginBottom: 32 }}>
              <Flex align="center" gap={12}>
                <Text strong style={{ minWidth: 100 }}>Số lượng:</Text>
                <InputNumber
                  min={1}
                  max={product.availableQty ?? product.quantity}
                  value={quantity}
                  onChange={(val) => setQuantity(val || 1)}
                  style={{ width: 80, borderRadius: 8 }}
                  disabled={isOutOfStock}
                />
              </Flex>
            </Flex>

            <Flex gap={16}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                style={{ 
                  height: 56, 
                  flex: 1, 
                  fontSize: 18, 
                  fontWeight: 700, 
                  borderRadius: 14,
                  boxShadow: isOutOfStock ? 'none' : `0 8px 20px ${token.colorPrimary}40`
                }}
                onClick={handleAddToCart}
                loading={isAdding}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Button>
              <Button 
                danger 
                size="large" 
                type="primary"
                style={{ 
                  height: 56, 
                  flex: 1, 
                  fontSize: 18, 
                  fontWeight: 700, 
                  borderRadius: 14,
                  background: isOutOfStock ? undefined : '#ff4d4f',
                  boxShadow: isOutOfStock ? 'none' : '0 8px 20px rgba(255, 77, 79, 0.4)'
                }}
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                loading={isAdding}
              >
                Mua ngay
              </Button>
            </Flex>

            {/* Trust Signals */}
            <div style={{ marginTop: 40, borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Flex vertical align="center" gap={8}>
                    <SafetyCertificateOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Cam kết chính hãng</Text>
                  </Flex>
                </Col>
                <Col span={8}>
                  <Flex vertical align="center" gap={8}>
                    <ThunderboltOutlined style={{ fontSize: 24, color: '#faad14' }} />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Giao hàng nhanh</Text>
                  </Flex>
                </Col>
                <Col span={8}>
                  <Flex vertical align="center" gap={8}>
                    <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Bảo hành uy tín</Text>
                  </Flex>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Related Products Section */}
      <div style={{ marginTop: 80 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Sản phẩm liên quan</Title>
          <Button type="link" onClick={() => navigate('/products')}>Xem tất cả</Button>
        </Flex>

        {isLoadingRelated ? (
          <Flex justify="center" style={{ padding: '40px 0' }}>
            <Spin />
          </Flex>
        ) : (
          <Row gutter={[24, 24]}>
            {relatedPage?.data?.map((item: any) => (
              <Col xs={12} sm={8} md={6} lg={4.8} key={item.id} style={{ display: 'flex' }}>
                <Link
                  to={`/products/${item.id}`}
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={() => {
                    setSelectedImage(null);
                    window.scrollTo(0, 0);
                  }}
                  className="product-card-hover"
                >
                  <div 
                    style={{ 
                      background: '#fff', 
                      borderRadius: 16, 
                      overflow: 'hidden', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <div style={{ 
                      padding: '12px', 
                      background: '#fcfcfc',
                      height: 160,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={(item.image && item.image !== "string") ? item.image : (item.images?.[0]?.url || "https://via.placeholder.com/400?text=No+Image")}
                        alt={item.name}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, textTransform: 'uppercase' }}>
                        {item.type}
                      </Text>
                      <Text strong style={{ fontSize: 14, marginBottom: 12, display: 'block', minHeight: 40 }}>
                        {item.name}
                      </Text>
                      <div style={{ marginTop: 'auto', color: token.colorPrimary, fontWeight: 700, fontSize: 16 }}>
                        {item.price.toLocaleString()} đ
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;