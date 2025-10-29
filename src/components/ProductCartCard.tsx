import { Checkbox, Button, Typography } from 'antd';

const { Text } = Typography;

// Định nghĩa kiểu dữ liệu cho props của component
export interface ProductCartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  checked: boolean;
  onCheckChange: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
}

const ProductCartCard: React.FC<ProductCartItemProps> = ({
  id,
  name,
  price,
  quantity,
  image,
  checked,
  onCheckChange,
  onDelete,
}) => {
  const totalPrice = price * quantity;

  return (
    <div className={`product-cart-card ${checked ? 'selected' : ''}`}>
      <Checkbox
        className="product-checkbox"
        checked={checked}
        onChange={(e) => onCheckChange(id, e.target.checked)}
      />
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <Text strong>{name}</Text>
        <Text type="secondary">{price.toLocaleString()} vnd</Text>
      </div>
      <div className="product-details">
        <div>
          <Text>Số lượng: {quantity}</Text>
        </div>
        <div>
          <Text type="secondary">Tổng: {totalPrice.toLocaleString()} vnd</Text>
        </div>
      </div>
      <Button
        type="primary" danger size="large"
        onClick={() => onDelete(id)}
      >
        xoá
      </Button>
    </div>
  );
};

export default ProductCartCard;