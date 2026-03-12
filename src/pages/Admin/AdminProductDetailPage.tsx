import { Button, Flex, message, Popconfirm, Spin, Typography, UploadFile } from 'antd';
import { ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import fileApi from '@/api/filesApi';
import productsApi from '@/api/productsApi';
import ProductForm from '@/components/admin/ProductForm';
import { useProduct } from '@/hooks/useProduct';
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
      navigate('/admin/products'); 
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  const handleLiquidation = async () => {
    try {
      setLoading(true);
      await productsApi.liquidation(productId);
      message.success('Thanh lý sản phẩm thành công!');
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate('/admin/products');
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
    <Flex vertical gap={24} style={{ padding: '24px' }}>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={16}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/products')}
            type="text"
          />
          <Typography.Title level={4} style={{ margin: 0 }}>Chi tiết sản phẩm</Typography.Title>
        </Flex>
        
        <Popconfirm
          title="Thanh lý sản phẩm"
          description="Bạn có chắc chắn muốn thanh lý sản phẩm này không? Hành động này không thể hoàn tác."
          onConfirm={handleLiquidation}
          okText="Thanh lý"
          cancelText="Hủy"
          okButtonProps={{ danger: true, loading: loading }}
        >
          <Button 
            danger 
            icon={<ShoppingOutlined />}
            size="large"
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Thanh lý sản phẩm
          </Button>
        </Popconfirm>
      </Flex>

      <ProductForm
        isEdit={true}
        initialData={product}
        onFinish={handleUpdate}
        onCancel={() => navigate('/admin/products')}
        loading={loading}
      />
    </Flex>
  );
};

export default AdminProductDetailPage;