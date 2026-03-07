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
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const AdminCategoryFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;
  const queryClient = useQueryClient();
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
        message.error("Không tải được dữ liệu danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, form]);

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
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <Spin size="large" />;

  return (
    <div className="admin-category-form-page">
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/categories")}
          >
            Quay lại
          </Button>
        </Space>

        <Title level={4}>
          {isEdit ? "Cập nhật danh mục" : "Tạo danh mục mới"}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
          >
            <TextArea rows={4} placeholder="Nhập ghi chú" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminCategoryFormPage;
