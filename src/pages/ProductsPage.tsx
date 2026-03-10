import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
import { Alert, Button, Checkbox, Input, Pagination, Typography, Flex, Tag } from "antd";
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
    status: "LIQUIDATION",
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="product-page-container" style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="sidebar" style={{ background: '#fff', padding: '24px', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height: 'fit-content' }}>
        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>Tìm kiếm</Typography.Title>
          <Input.Search
            placeholder="Tên sản phẩm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>Loại sản phẩm</Typography.Title>
          <Checkbox.Group
            style={{ width: '100%' }}
            value={checkedCategories}
            onChange={handleCategoryChange}
          >
            <Flex vertical gap={12}>
              {categories.map((opt) => (
                <Checkbox key={opt.id} value={opt.id} style={{ fontSize: 14 }}>
                  {opt.name}
                </Checkbox>
              ))}
            </Flex>
          </Checkbox.Group>
        </div>

        <Button 
          block 
          onClick={handleClearFilters}
          style={{ height: 40, borderRadius: 8, fontWeight: 500 }}
        >
          Xóa bộ lọc
        </Button>
      </div>

      <div className="content" style={{ paddingLeft: 24 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>Sản phẩm đang thanh lý</Typography.Title>
          <Typography.Text type="secondary">{productsPage?.totalElements || 0} sản phẩm</Typography.Text>
        </Flex>

        <div className="product-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '24px' 
        }}>
          {productsPage?.data?.map((product: Product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              style={{ textDecoration: 'none' }}
              className="product-card-hover"
            >
              <div 
                style={{ 
                  background: '#fff', 
                  borderRadius: 16, 
                  overflow: 'hidden', 
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #f0f0f0'
                }}
              >
                {/* Image Area */}
                <div style={{ 
                  position: 'relative', 
                  padding: '16px', 
                  background: '#fcfcfc',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={(product.image && product.image !== "string") ? product.image : "https://via.placeholder.com/400?text=No+Image"}
                    alt={product.name}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Tag color="red" bordered={false} style={{ margin: 0, fontWeight: 600 }}>Thanh lý</Tag>
                  </div>
                </div>

                {/* Info Area */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography.Text type="secondary" style={{ fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {product.type || "Tài sản"}
                  </Typography.Text>
                  <Typography.Title level={5} style={{ margin: '0 0 12px 0', fontSize: 16, flex: 1 }}>
                    {product.name}
                  </Typography.Title>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 700 }}>
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {productsPage?.data?.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 16 }}>
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty" style={{ width: 200, marginBottom: 20 }} />
            <Typography.Title level={4}>Không tìm thấy sản phẩm nào</Typography.Title>
            <Typography.Text type="secondary">Vui lòng thử điều chỉnh bộ lọc của bạn</Typography.Text>
          </div>
        )}

        <div className="pagination-container" style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
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
