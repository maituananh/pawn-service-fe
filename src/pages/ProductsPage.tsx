import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
import { Alert, Button, Checkbox, Input, Pagination } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  const { categories } = useCategories();

  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { productsPage, isLoading, isError, error } = useProducts({
    page: currentPage,
    size: pageSize,
    name: searchText,
    categoryIds: checkedCategories,
  });

  const handleCategoryChange = (checkedValues: number[]) => {
    setCheckedCategories(checkedValues);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleClearFilters = () => {
    setCheckedCategories([]);
    setSearchText("");
    setCurrentPage(1);
  };

  // if (isLoading) return <Spin tip="Loading products..." />;
  if (isError)
    return (
      <Alert
        message="Error"
        description={(error as Error).message}
        type="error"
      />
    );

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
          {categories.map((opt) => (
            <div key={opt.id} style={{ marginBottom: 8 }}>
              <Checkbox value={opt.id}>{opt.name}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>

        <Button className="clear-button" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>

      <div className="content">
        <div className="product-grid">
          {productsPage?.data?.map((product: Product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="product-card-link"
            >
              <div className="product-card">
                <img
                  src={product.image}
                  alt={product.image}
                  key={product.image}
                  loading="lazy"
                />
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
            total={productsPage?.totalElements}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
