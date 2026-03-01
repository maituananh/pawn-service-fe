import fileApi from "@/api/filesApi";
import productsApi from "@/api/productsApi";
import ProductForm from "@/components/admin/ProductForm";
import { message, UploadFile } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any, fileList: UploadFile[]) => {
    try {
      // 1. Validate số lượng ảnh (Logic cũ của bạn)
      if (fileList.length !== 4) {
        message.error("Phải upload đúng 4 hình ảnh");
        return;
      }

      setLoading(true);

      // 2. Upload ảnh lên server để lấy Image IDs
      const imageIds = await Promise.all(
        fileList.map(async (f) => {
          const res = await fileApi.upload(f.originFileObj as File);
          return res.id;
        })
      );

      // 3. Build Payload (Giữ nguyên cấu trúc logic cũ)
      const payload = {
        name: values.name,
        price: Number(values.price),
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),

        categoryId: Number(values.categoryId),
        code: values.code,
        // Lưu ý: customerId ở đây sẽ nhận value là email từ Select (do data ko có id)
        customerId: values.customerId, 

        type: values.type,
        dailyProfit: Number(values.dailyProfit),

        quantity: Number(values.quantity),
        description: values.description || "",
        imageIds,
      };

      // 4. Call API Create
      await productsApi.create(payload);
      
      message.success("Tạo sản phẩm thành công!");
      navigate("/admin/products", { replace: true });
    } catch (error: any) {
      console.error("ERROR RESPONSE:", error.response?.data);
      message.error("Tạo sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products", { replace: true });
  };

  return (
    <div className="create-product-page" style={{ padding: '24px' }}>
      <ProductForm 
        onFinish={handleFinish} 
        onCancel={handleCancel} 
        loading={loading}
        isEdit={false}
      />
    </div>
  );
};

export default AdminProductCreatePage;