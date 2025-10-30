import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Button,
  InputNumber,
  Divider,
  List,
  Card,
  Space,
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const mainProductData = {
  id: 1,
  name: 'Điện thoại iPhone 17 Pro',
  currentPrice: 10000000,
  originalPrice: 20000000,
  quantity: 2,
  description: ['Màu đỏ', 'Như mới 99%', 'Không có sạc đi kèm'],
  images: [
    'https://via.placeholder.com/600x600/FF6347/FFFFFF?text=Product+1',
    'https://via.placeholder.com/600x600/4682B4/FFFFFF?text=Product+2',
    'https://via.placeholder.com/600x600/32CD32/FFFFFF?text=Product+3',
    'https://via.placeholder.com/600x600/FFD700/FFFFFF?text=Product+4',
  ],
};

const relatedProductsData = [
  { id: 10, name: 'Winner X 2021', price: '20.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike' },
  { id: 11, name: 'Máy ảnh', price: '10.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera' },
  { id: 12, name: 'Winner X 2021', price: '20.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike' },
  { id: 13, name: 'Máy ảnh', price: '10.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera' },
  { id: 14, name: 'Máy ảnh', price: '10.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera' },
  { id: 15, name: 'Winner X 2021', price: '20.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike' },
];

const ProductDetailPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(mainProductData.images[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-detail-page">
      <Row gutter={[32, 32]} className="main-product-section">
        <Col xs={24} md={12} className="image-gallery">
          <div className="thumbnail-list">
            {mainProductData.images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail-item ${selectedImage === img ? 'thumbnail-item--active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image-container">
            <img src={selectedImage} alt="Main product" className="main-image" />
          </div>
        </Col>
        <Col xs={24} md={12} className="product-info">
          <Title level={2}>{mainProductData.name}</Title>
          <div className="price-section">
            <Text className="current-price">
              {mainProductData.currentPrice.toLocaleString()} vnd
            </Text>
            <Text delete className="original-price">
              {mainProductData.originalPrice.toLocaleString()} vnd
            </Text>
          </div>
          <div className="quantity-section">
            <Text strong>Số lượng: </Text>
            <InputNumber min={1} max={mainProductData.quantity} defaultValue={1} onChange={(value) => setQuantity(value || 1)} />
          </div>
          <div className="description-section">
            <Text strong>Mô tả:</Text>
            <ul>
              {mainProductData.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <Space className="action-buttons" size="middle">
            <Button size="large" icon={<ShoppingCartOutlined />} className="btn-add-to-cart">
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
              <Card
                hoverable
                cover={<img alt={item.name} src={item.image} />}
              >
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