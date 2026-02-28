import productsApi from "@/api/productsApi";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Divider,
  InputNumber,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
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
  {
    id: 14,
    name: "Máy ảnh",
    price: "10.000.000 vnd",
    image: "https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Camera",
  },
  {
    id: 15,
    name: "Winner X 2021",
    price: "20.000.000 vnd",
    image: "https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Bike",
  },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(Number(id)),
    enabled: !!id,
  });

  return (
    <div className="product-detail-page">
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
            <Text delete className="original-price">
              {product?.price.toLocaleString()} vnd
            </Text>
          </div>
          <div className="quantity-section">
            <Text strong>Số lượng: </Text>
            <InputNumber
              min={1}
              max={product?.quantity}
              defaultValue={1}
              onChange={(value) => setQuantity(value || 1)}
            />
          </div>
          <div className="description-section">
            <Text strong>Mô tả:</Text>
            <ul>{product?.description}</ul>
          </div>
          <Space className="action-buttons" size="middle">
            <Button
              size="large"
              icon={<ShoppingCartOutlined />}
              className="btn-add-to-cart"
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
