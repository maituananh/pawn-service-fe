// [UI ONLY] Redesigned AdminProductCreatePage for better visual consistency
import fileApi from "@/api/filesApi";
import productsApi from "@/api/productsApi";
import ProductForm from "@/components/admin/ProductForm";
import { message, UploadFile, Flex } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any, fileList: UploadFile[]) => {
    try {
      if (fileList.length !== 4) {
        message.error("Vui lòng cung cấp đầy đủ 4 hình ảnh chi tiết");
        return;
      }

      setLoading(true);

      const imageIds = await Promise.all(
        fileList.map(async (f) => {
          const res = await fileApi.upload(f.originFileObj as File);
          return res.id;
        })
      );

      const payload = {
        name: values.name,
        price: Number(values.price),
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
        categoryId: Number(values.categoryId),
        code: values.code,
        customerId: values.customerId, 
        type: values.type,
        dailyProfit: Number(values.dailyProfit),
        quantity: Number(values.quantity),
        description: values.description || "",
        imageIds,
      };

      await productsApi.create(payload);
      
      message.success("Tạo hợp đồng cầm cố mới thành công!");
      navigate("/admin/products", { replace: true });
    } catch (error: any) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products", { replace: true });
  };

  return (
    <Flex vertical gap={24}>
      <ProductForm 
        onFinish={handleFinish} 
        onCancel={handleCancel} 
        loading={loading}
        isEdit={false}
      />
    </Flex>
  );
};

export default AdminProductCreatePage;