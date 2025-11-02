import { useState, useMemo } from 'react';
import { Input, Checkbox, Button, Pagination, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { PRODUCT_TYPE_1_OPTIONS } from '@/constants';
import { Product } from '@/type/product.type';

const ProductsPage = () => {
  const { products, isLoading, isError, error } = useProducts();

  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        checkedCategories.length === 0 || checkedCategories.includes(product.category);
      const matchesSearch =
        searchText === '' || product.name.toLowerCase().includes(searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, checkedCategories, searchText]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, pageSize]);

  const handleCategoryChange = (checkedValues: string[]) => {
    setCheckedCategories(checkedValues);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleClearFilters = () => {
    setCheckedCategories([]);
    setSearchText('');
    setCurrentPage(1);
  };

  if (isLoading) return <Spin tip="Loading products..." />;
  if (isError) return <Alert message="Error" description={(error as Error).message} type="error" />;

  return (
    <div className="product-page-container bg-white">
      <div className="sidebar bg-gray-light p-5">
        <div className="mb-5">
          <p className="text-bold mb-2 mt-0">Search</p>
          <Input
            placeholder="Search product"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Checkbox.Group
          className="flex-column mb-5"
          value={checkedCategories}
          onChange={handleCategoryChange}
        >
          <label className="text-bold mb-2">Loại sản phẩm</label>
          {PRODUCT_TYPE_1_OPTIONS.map((opt) => (
            <div key={opt.value} style={{ marginBottom: 8 }}>
              <Checkbox value={opt.value}>{opt.label}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>

        <Button className="clear-button" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>

      <div className="content">
        <div className="product-grid">
          {paginatedProducts.map((product: Product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="product-card-link"
            >
              <div className="product-card">
                {
                  product.images.map((image, index) => (
                    <img src={image.url} alt={image.url} key={image.url + index + image.id} loading="lazy" />
                  ))
                }

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
            total={filteredProducts.length}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
