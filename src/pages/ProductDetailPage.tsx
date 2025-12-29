import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import productsApi from '@/api/productsApi';
import { useParams } from 'react-router-dom';
import { Product } from '@/type/product.type';
import { useQuery } from '@tanstack/react-query';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const relatedProductsData = [
  { id: 10, name: 'Winner X 2021', price: '20.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike' },
  { id: 11, name: 'Máy ảnh', price: '10.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera' },
  { id: 12, name: 'Winner X 2021', price: '20.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike' },
  { id: 13, name: 'Máy ảnh', price: '10.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera' },
  { id: 14, name: 'Máy ảnh', price: '10.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera' },
  { id: 15, name: 'Winner X 2021', price: '20.000.000 vnd', image: 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike' },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(Number(id)),
    enabled: !!id,
  });

  return (
    <div className="product-detail-page">
      <Row gutter={[32, 32]} className="main-product-section">
        <Col xs={24} md={12} className="image-gallery">
          <div className="thumbnail-list">
            {/* {product.images.map((img, index) => (
              <div
                key={img.id}
                className={`thumbnail-item ${selectedImage === img.url ? 'thumbnail-item--active' : ''}`}
                onClick={() => setSelectedImage(img.url)}
              >
                <img src={img.url} alt={`thumbnail ${index + 1}`} />
              </div>
            ))} */}
          </div>
          <div className="main-image-container">
            <img src={product?.images[0].url} alt="Main product" className="main-image" />
          </div>
        </Col>
        <Col xs={24} md={12} className="product-info">
          <Title level={2}>{product?.name}</Title>
          <div className="price-section">
            <Text className="current-price">
              {product?.price.toLocaleString()} vnd
            </Text>
            <Text delete className="original-price">
              {product?.price.toLocaleString()} vnd
            </Text>
          </div>
          <div className="quantity-section">
            <Text strong>Số lượng: </Text>
            <InputNumber min={1} max={product?.quantity} defaultValue={1} onChange={(value) => setQuantity(value || 1)} />
          </div>
          <div className="description-section">
            <Text strong>Mô tả:</Text>
            <ul>
              {product?.description}
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