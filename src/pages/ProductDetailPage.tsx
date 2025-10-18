import { useParams } from 'react-router-dom';
import { Button } from 'antd';

const relatedProducts = [
  { id: 1, name: 'Winner X 2021', image: '/images/winnerx.jpg', price: '20.000.000 vnd' },
  { id: 2, name: 'Máy ảnh', image: '/images/mayanh.jpg', price: '10.000.000 vnd' },
  { id: 3, name: 'Winner X 2021', image: '/images/winnerx.jpg', price: '20.000.000 vnd' },
  { id: 4, name: 'Máy ảnh', image: '/images/mayanh.jpg', price: '10.000.000 vnd' },
];

const ProductDetailPage = () => {
  const { id } = useParams(); // future use
  // Fake data — in thực tế sẽ fetch từ API theo `id`

  const product = {
    name: 'Điện thoại IPhone 17 Pro',
    image: '/images/iphone.jpg',
    images: [
      '/images/iphone.jpg',
      '/images/iphone.jpg',
      '/images/iphone.jpg',
      '/images/iphone.jpg',
    ],
    price: '10.000.000 vnd',
    oldPrice: '20.000.000 vnd',
    description: ['Màu đỏ', 'Như mới 99%', 'Không có sạc đi kèm'],
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="image-section">
          <div className="thumbnails">
            {product.images.map((img, idx) => (
              <img key={idx} src={img} alt="thumb" />
            ))}
          </div>
          <div className="main-image">
            <img src={product.image} alt={product.name} />
          </div>
        </div>
        <div className="info-section">
          <h2>{product.name}</h2>
          <div className="price">
            <span className="current">{product.price}</span>
            <span className="old">{product.oldPrice}</span>
          </div>
          <div className="description">
            <p><b>Mô tả:</b></p>
            <ul>
              {product.description.map((desc, idx) => (
                <li key={idx}>{desc}</li>
              ))}
            </ul>
          </div>
          <div className="actions">
            <Button type="primary" className="add-to-cart">Thêm vào giỏ hàng</Button>
            <Button danger className="buy-now">Mua ngay</Button>
          </div>
        </div>
      </div>
      <div className="related-section">
        <h3>Những sản phẩm liên quan</h3>
        <div className="related-grid">
          {relatedProducts.map((item) => (
            <div key={item.id} className="related-card">
              <img src={item.image} alt={item.name} />
              <div className="name">{item.name}</div>
              <div className="price">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
