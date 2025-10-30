import React, { useState, useMemo } from 'react';
import { Button, Checkbox, Typography } from 'antd';
import ProductCartCard from '@/components/ProductCartCard';

const { Text } = Typography;

const initialCartItems = [
  { id: 1, name: 'Iphone 17 pro', price: 17000000, quantity: 2, image: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=Phone', checked: true },
  { id: 2, name: 'Winner X V2', price: 17000000, quantity: 1, image: 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=Bike', checked: true },
  { id: 3, name: 'Iphone 17 pro', price: 17000000, quantity: 1, image: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=Phone', checked: false },
  { id: 4, name: 'Iphone 17 pro', price: 17000000, quantity: 1, image: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=Phone', checked: true },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleCheckChange = (id: number, checked: boolean) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  const handleDelete = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleDeleteSelected = () => {
    setCartItems(cartItems.filter(item => !item.checked));
  }

  const handleSelectAll = (checked: boolean) => {
    setCartItems(cartItems.map(item => ({ ...item, checked })));
  }

  const { totalPrice, allSelected, isIndeterminate } = useMemo(() => {
    const selectedItems = cartItems.filter(item => item.checked);
    const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;
    const isIndeterminate = selectedItems.length > 0 && !allSelected;
    return { totalPrice, allSelected, isIndeterminate };
  }, [cartItems]);

  return (
    <div className="container cart-page-container bg-white">
      <div className="cart-items-list">
        {cartItems.map((item) => (
          <React.Fragment key={item.id}>
            <ProductCartCard
              {...item}
              onCheckChange={handleCheckChange}
              onDelete={handleDelete}
            />
          </React.Fragment>
        ))}
      </div>
      <div className="cart-footer">
        <div className="footer-select-all">
          <Checkbox
            checked={allSelected}
            indeterminate={isIndeterminate}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            chọn tất cả
          </Checkbox>
          <Button type="link" onClick={handleDeleteSelected}>xoá</Button>
        </div>
        <div className="footer-checkout">
          <Text>Tổng các tổng giá lại:
            <Text className='text-bold ml-2'>
              {totalPrice.toLocaleString()}
            </Text> vnd</Text>
          <Button type="primary" size="large" className="bg-red-dark">Mua</Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;