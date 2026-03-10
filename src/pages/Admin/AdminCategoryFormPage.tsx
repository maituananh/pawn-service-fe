// [UI ONLY] Redesigned AdminCategoryFormPage with improved layout and styling
import categoriesApi from "@/api/categoriesApi";
import { CategoryCreateRequest } from "@/type/category.type";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Spin,
  Typography,
  Flex,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminCategoryFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;
  const queryClient = useQueryClient();
  const { token } = theme.useToken();

  useEffect(() => {
    if (!isEdit) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);

        const data = await categoriesApi.getById(Number(id));

        form.setFieldsValue({
          name: data.name,
          note: data.note,
        });
      } catch (err) {
        // Handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, form, isEdit]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload: CategoryCreateRequest = {
        name: values.name,
        note: values.note,
        isActive: values.isActive ?? true,
      };

      if (isEdit) {
        await categoriesApi.update(Number(id), payload);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        message.success("Cập nhật danh mục thành công!");
      } else {
        await categoriesApi.create(payload);
        message.success("Tạo danh mục thành công!");
      }

      navigate("/admin/categories");
    } catch (err) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return (
    <Flex justify="center" align="center" style={{ minHeight: 400 }}>
      <Spin size="large" tip="Đang tải dữ liệu..." />
    </Flex>
  );

  return (
    <Flex vertical gap={24}>
      {/* [UI ONLY] Header Section */}
      <Flex align="center" justify="space-between">
        <Flex vertical gap={4}>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? "Cập nhật danh mục" : "Tạo danh mục mới"}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isEdit ? "Chỉnh sửa thông tin danh mục tài sản" : "Thêm danh mục tài sản mới vào hệ thống"}
          </Text>
        </Flex>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/categories")}
          style={{ borderRadius: 8 }}
        >
          Quay lại
        </Button>
      </Flex>

      <Card 
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 12, maxWidth: 800 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
          }}
          requiredMark="optional"
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input size="large" placeholder="Ví dụ: Trang sức, Đồ điện tử..." style={{ borderRadius: 8 }} />
          </Form.Item>
          
          <Form.Item
            label="Ghi chú mô tả"
            name="note"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
          >
            <TextArea rows={4} placeholder="Mô tả ngắn gọn về danh mục này..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <Flex gap={12} justify="flex-end" style={{ marginTop: 12 }}>
            <Button size="large" onClick={() => navigate("/admin/categories")} style={{ borderRadius: 8, minWidth: 100 }}>
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ borderRadius: 8, minWidth: 120 }}
            >
              {isEdit ? "Cập nhật" : "Tạo danh mục"}
            </Button>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
};

export default AdminCategoryFormPage;
