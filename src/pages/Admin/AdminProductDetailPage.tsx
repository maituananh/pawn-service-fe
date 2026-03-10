import fileApi from '@/api/filesApi';
import productsApi from '@/api/productsApi';
import ProductForm from '@/components/admin/ProductForm';
import { useProduct } from '@/hooks/useProduct';
import { message, Spin, UploadFile } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const AdminProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const [loading, setLoading] = useState(false);

  // 1. Fetch dữ liệu sản phẩm từ API
  const { data: product, isLoading, isError, refetch } = useProduct(productId);

  // 2. Hàm xử lý Update (giữ nguyên logic upload ảnh nếu có thay đổi)
  const handleUpdate = async (values: any, fileList: UploadFile[]) => {
    console.log("handleUpdate")
    try {
      setLoading(true);

      // Phân loại: Ảnh nào đã có ID (cũ), ảnh nào là File Object (mới)
      const oldImageIds = fileList
        .filter((f) => !f.originFileObj && f.uid)
        .map((f) => Number(f.uid));

      const newFiles = fileList.filter((f) => f.originFileObj);

      const newImageIds = await Promise.all(
        newFiles.map(async (f) => {
          const res = await fileApi.upload(f.originFileObj as File);
          return res.id;
        })
      );

      const payload = {
        ...values,
        price: Number(values.price),
        categoryId: Number(values.categoryId),
        dailyProfit: Number(values.dailyProfit || 0),
        quantity: Number(values.quantity || 0),
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
        imageIds: [...oldImageIds, ...newImageIds],
      };

      await productsApi.update(productId, payload);
      message.success('Cập nhật sản phẩm thành công!');
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      refetch(); 
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" tip="Đang tải dữ liệu..." />
    </div>
  );

  if (isError) return <div>Đã xảy ra lỗi khi tải sản phẩm!</div>;

  return (
    <div className="product-detail-page" style={{ padding: '24px' }}>
      <ProductForm
        isEdit={true}
        initialData={product} // Truyền toàn bộ object product vào
        onFinish={handleUpdate}
        onCancel={() => navigate('/admin/products')}
        loading={loading}
      />
    </div>
  );
};

export default AdminProductDetailPage;