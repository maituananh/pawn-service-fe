import { useState } from 'react';
import { Input, Checkbox, Button, Pagination, Flex } from 'antd';
import { Link } from 'react-router-dom';
import { PRODUCT_TYPE_1_OPTIONS } from '@/constants';

const allProducts = [
  {
    id: 1,
    name: 'Winner X 2021',
    image: '/images/winnerx.jpg',
    price: '20.000.000 VND',
    category: 'Xe Máy',
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 2,
    name: 'Máy ảnh',
    image: '/images/mayanh.jpg',
    price: '10.000.000 VND',
    category: 'Máy Ảnh',
  })),
];

const ProductPage = () => {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [checked, setChecked] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleCategoryChange = (checkedValues: any) => {
    setChecked(checkedValues);
    const filtered = allProducts.filter(
      (product) =>
        checkedValues.length === 0 || checkedValues.includes(product.category)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const totalItems = filteredProducts.length;

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="product-page-container bg-white">
      <div className="sidebar bg-gray-light p-5">
        <div className="mb-5">
          <p className="text-bold mb-2 mt-0">Giá, VND</p>
          <Flex>
            <Input placeholder="Min" className="price-input" />
            <Input placeholder="Max" className="price-input ml-3" />
          </Flex>
        </div>
        <Checkbox.Group
          className="flex-column mb-5"
          onChange={handleCategoryChange}
          value={checked}
        >
          <label className="text-bold mb-2">Loại sản phẩm</label>
          {PRODUCT_TYPE_1_OPTIONS.map((opt) => (
            <div key={opt.value} style={{ marginBottom: 8 }}>
              <Checkbox value={opt.value}>{opt.label}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
        <Checkbox.Group
          className="flex-column mb-5"
          onChange={handleCategoryChange}
          value={checked}
        >
          <label className="text-bold mb-2">Loại sản phẩm</label>
          {PRODUCT_TYPE_1_OPTIONS.map((opt) => (
            <div key={opt.value} style={{ marginBottom: 8 }}>
              <Checkbox value={opt.value}>{opt.label}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
        <Checkbox.Group
          className="flex-column mb-5"
          onChange={handleCategoryChange}
          value={checked}
        >
          <label className="text-bold mb-2">Loại sản phẩm</label>
          {PRODUCT_TYPE_1_OPTIONS.map((opt) => (
            <div key={opt.value} style={{ marginBottom: 8 }}>
              <Checkbox value={opt.value}>{opt.label}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
        <Button className="clear-button" onClick={() => {
          setChecked([]);
          setFilteredProducts(allProducts);
          setCurrentPage(1);
        }}>
          Clear
        </Button>
      </div>
      <div className="content">
        <div className="top-bar">
          <Input.Search placeholder="Search" style={{ width: 250 }} />
        </div>
        <div className="product-grid">
          {paginatedProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="product-card-link"
            >
              <div className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="name ellipsis-1">{product.name}</div>
                <div className="price">{product.price}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
