import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct"; // Sử dụng hook bạn đã viết
import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  InputNumber,
  List,
  message,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Meta } = Card;

const relatedProductsData = [
  {
    id: 10,
    name: "Winner X 2021",
    price: "20.000.000 vnd",
    image: "https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike",
  },
  {
    id: 11,
    name: "Máy ảnh",
    price: "10.000.000 vnd",
    image: "https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera",
  },
  {
    id: 12,
    name: "Winner X 2021",
    price: "20.000.000 vnd",
    image: "https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike",
  },
  {
    id: 13,
    name: "Máy ảnh",
    price: "10.000.000 vnd",
    image: "https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera",
  },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { addToCart, isAdding } = useCart();

  const handleAddToCart = () => {
    if (!product) return;

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

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (isError || !product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail-page">
      {contextHolder}
      <Button
        type="link"
        onClick={() => navigate('/products')} // Quay lại trang trước đó trong lịch sử trình duyệt
        style={{ marginBottom: 16, padding: 0 }}
      >
        Quay lại danh sách
      </Button>
      <Row gutter={[32, 32]} className="main-product-section">
        <Col xs={24} md={12}>
          <Row gutter={16}>
            <Col span={4}>
              <Space direction="vertical" size={12}>
                {product?.images?.map((img: any, index: number) => {
                  const isActive =
                    (selectedImage || product?.images?.[0]?.url) === img.url;

                  return (
                    <div
                      key={img.id || index}
                      onClick={() => setSelectedImage(img.url)}
                      style={{
                        border: isActive
                          ? "2px solid #ff4d4f"
                          : "1px solid #ddd",
                        borderRadius: 8,
                        cursor: "pointer",
                        overflow: "hidden",
                        padding: 4,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`thumb-${index}`}
                        style={{
                          width: "100%",
                          height: 70,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                })}
              </Space>
            </Col>

            <Col span={20}>
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 12,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <img
                  src={selectedImage || product?.images?.[0]?.url}
                  alt="Main product"
                  style={{
                    width: "85%",
                    borderRadius: 12,
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={12} className="product-info">
          <Title level={2}>{product?.name}</Title>
          <div className="price-section">
            <Text className="current-price">
              {product?.price.toLocaleString()} vnd
            </Text>
            {/* Nếu API không trả về oldPrice, tạm thời hiển thị giá hiện tại như giao diện cũ */}
            <Text delete className="original-price" style={{ marginLeft: 10 }}>
              {product?.price.toLocaleString()} vnd
            </Text>
          </div>
          <div className="quantity-section" style={{ margin: '16px 0' }}>
            <Text strong>Số lượng muốn đặt: </Text>
            <InputNumber
              min={1}
              max={product?.quantity}
              defaultValue={1}
              onChange={(value) => setQuantity(value || 1)}
            />
            <Text strong>Số lượng hiện có: {product?.quantity}</Text>
          </div>
          <div className="description-section">
            <Text strong>Mô tả:</Text>
            <ul>
              <li>Loại: {product?.type}</li>
              <li>Danh mục: {product?.category?.name}</li>
              <li>Mã sản phẩm: {product?.code}</li>
            </ul>
          </div>
          <Space className="action-buttons" size="middle" style={{ marginTop: 20 }}>
            <Button
              size="large"
              icon={<ShoppingCartOutlined />}
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              loading={isAdding}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button type="primary" size="large" danger className="btn-buy-now">
              Mua ngay
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div className="related-products-section">
        <Title level={3}>Những sản phẩm liên quan</Title>
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 3,
            md: 4,
            lg: 6,
            xl: 6,
            xxl: 6,
          }}
          dataSource={relatedProductsData}
          renderItem={(item) => (
            <List.Item>
              <Card hoverable cover={<img alt={item.name} src={item.image} />}>
                <Meta title={item.name} description={item.price} />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;