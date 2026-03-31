import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/type/product.type";
import {
  Alert,
  Button,
  Checkbox,
  Flex,
  Input,
  Pagination,
  Typography,
} from "antd";
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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div
      className="product-page-container"
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      <div
        className="sidebar"
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          height: "fit-content",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            Tìm kiếm
          </Typography.Title>
          <Input.Search
            placeholder="Tên sản phẩm..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            Loại sản phẩm
          </Typography.Title>
          <Checkbox.Group
            style={{ width: "100%" }}
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
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 24 }}
        >
          <Typography.Title level={3} style={{ margin: 0 }}>
            Sản phẩm đang thanh lý
          </Typography.Title>
          <Typography.Text type="secondary">
            {productsPage?.totalElements || 0} sản phẩm
          </Typography.Text>
        </Flex>

        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {productsPage?.data?.map((product: Product) => {
            const isOutOfStock =
              (product.availableQty ?? product.stockQty) <= 0 ||
              product.status === "SOLD_OUT";

            return (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className={isOutOfStock ? undefined : "product-card-hover"}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    filter: isOutOfStock ? "grayscale(0.6)" : "none",
                    opacity: isOutOfStock ? 0.78 : 1,
                  }}
                >
                  {/* ── Image block with full-bleed + gradient overlay ── */}
                  <div
                    style={{
                      position: "relative",
                      height: 220,
                      background: "#f5f5f7",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        product.image && product.image !== "string"
                          ? product.image
                          : "https://placehold.co/400x300/f5f5f7/b0b0b0?text=No+Image"
                      }
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.55s ease",
                        display: "block",
                      }}
                      className="product-card-img"
                    />

                    {/* soft bottom gradient so text overlaid later would pop */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Status chip – top-left */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                      }}
                    >
                      {isOutOfStock ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "rgba(30,30,30,0.82)",
                            backdropFilter: "blur(8px)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 999,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          <span style={{ fontSize: 9, lineHeight: 1 }}>⬛</span>
                          Hết hàng
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "rgba(220,38,38,0.88)",
                            backdropFilter: "blur(8px)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 999,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          🔥 Thanh lý
                        </span>
                      )}
                    </div>

                    {/* Category chip – top-right */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 999,
                        padding: "3px 10px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#555",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {product.type || "Tài sản"}
                    </div>
                  </div>

                  {/* ── Info block ── */}
                  <div
                    style={{
                      padding: "18px 20px 20px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {/* Product name */}
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111",
                        lineHeight: 1.4,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background: "rgba(0,0,0,0.05)",
                        borderRadius: 1,
                      }}
                    />

                    {/* Price row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {isOutOfStock ? (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#bbb",
                            letterSpacing: "0.02em",
                          }}
                        >
                          Không còn hàng
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#dc2626",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {formatCurrency(product.price)}
                        </span>
                      )}

                      {/* Arrow CTA */}
                      {!isOutOfStock && (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#111",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 14,
                            flexShrink: 0,
                            transition: "transform 0.2s ease",
                          }}
                          className="card-arrow"
                        >
                          →
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {productsPage?.data?.length === 0 && !isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              background: "#fff",
              borderRadius: 16,
            }}
          >
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
              alt="Empty"
              style={{ width: 200, marginBottom: 20 }}
            />
            <Typography.Title level={4}>
              Không tìm thấy sản phẩm nào
            </Typography.Title>
            <Typography.Text type="secondary">
              Vui lòng thử điều chỉnh bộ lọc của bạn
            </Typography.Text>
          </div>
        )}

        <div
          className="pagination-container"
          style={{ marginTop: 48, display: "flex", justifyContent: "center" }}
        >
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
