import { useCategories } from "@/hooks/useCategories";
import { useUsers } from "@/hooks/useUsers";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form, Input, InputNumber,
  Radio,
  Row,
  Select,
  Typography, Upload,
  UploadFile
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";

const { Title } = Typography;

interface ProductFormProps {
  initialData?: any; // Dùng cho trang Detail/Edit
  loading?: boolean;
  onFinish: (values: any, fileList: UploadFile[]) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  loading,
  onFinish,
  onCancel,
  isEdit = false
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { categories } = useCategories();
  const { users } = useUsers();

  // Watcher để filter category theo type
  const selectedType = Form.useWatch("type", form);

  // Hàm bổ trợ để fill data vào các ô Địa chỉ, CCCD, SĐT
  const fillCustomerFields = (userId: any) => {
    if (!userId || !users) return;
    const user = users.find((u: any) => Number(u.id) === Number(userId));
    if (user) {
      form.setFieldsValue({
        address: user.address,
        phone: user.phone,
        idCard: user.cardId,
      });
    }
  };

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
        endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
        dailyProfit: initialData.dailyProfit,
        // GIỮ NGUYÊN ÉP CỨNG THEO YÊU CẦU
        customerId: 1,
        categoryId: 1,
      };

      form.setFieldsValue(formattedData);

      // Tự động fill thông tin chi tiết khách hàng dựa trên ID ép cứng (1)
      if (users?.length > 0) {
        fillCustomerFields(1);
      }

      // Xử lý hiển thị ảnh cũ
      if (initialData.images && Array.isArray(initialData.images)) {
        const formattedFiles: UploadFile[] = initialData.images.map((img: any) => ({
          uid: img.id.toString(),
          name: `Image-${img.id}`,
          status: 'done',
          url: img.url,
        }));
        setFileList(formattedFiles);
      }
    }
  }, [initialData, form, users]); // Thêm users vào đây để khi list user load xong sẽ fill được data ngay

  const filteredCategories = useMemo(() => {
    if (!categories || !selectedType) return [];
    return categories.filter((item: any) => item.type === selectedType);
  }, [categories, selectedType]);

  const handleBeforeUpload = () => false;
  const handleChange = ({ fileList }: any) => {
    setFileList(fileList.slice(0, 4));
  };

  const handleUserSelect = (value: any) => {
    fillCustomerFields(value);
  };

  return (
    <Form form={form} layout="vertical" onFinish={(values) => onFinish(values, fileList)}
      onFinishFailed={(errorInfo) => console.log("Lỗi Validate Form:", errorInfo)}>
      <Card title={<Title level={5}>{isEdit ? "Chi tiết sản phẩm" : "Tạo sản phẩm mới"}</Title>} className="form-card">
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input placeholder="Điện thoại,..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Loại sản phẩm" name="type" rules={[{ required: true }]}>
              <Select
                placeholder="Chọn loại"
                onChange={(value) => {
                  form.setFieldValue("categoryId", undefined);
                }}
              >
                <Select.Option value="PHONE">Phone</Select.Option>
                <Select.Option value="LAPTOP">Laptop</Select.Option>
                <Select.Option value="MOTORBIKE">Motorbike</Select.Option>
                <Select.Option value="GOLD">Gold</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Thể loại" name="categoryId" rules={[{ required: true }]}>
              <Select
                placeholder="Chọn thể loại"
                disabled={!selectedType}
                options={categories?.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Mã sản phẩm" name="code"><Input /></Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true }, { type: "number", min: 0 }]}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="10.000.000 vnd" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Hình ảnh sản phẩm">
              <Upload.Dragger
                multiple
                listType="picture"
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
                onChange={handleChange}
              >
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p>Kéo thả ảnh (Hãy chọn 4 ảnh)</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Tiền lời 1 ngày" name="dailyProfit" rules={[{ required: true }, { type: "number", min: 0 }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Ngày bắt đầu cầm" name="startDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Ngày kết thúc cầm" name="endDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Mô tả" name="description"><Input.TextArea rows={4} /></Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title={<Title level={5}>Thông tin khách hàng</Title>} style={{ marginTop: 20 }}>
        <Form.Item name="customerType" initialValue="existing">
          <Radio.Group>
            <Radio value="existing">Đã có tài khoản</Radio>
            <Radio value="new">Chưa có tài khoản</Radio>
          </Radio.Group>
        </Form.Item>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Tên khách hàng" name="customerId" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Chọn khách hàng"
                onChange={handleUserSelect}
                optionFilterProp="label"
                options={users?.map((u: any) => ({
                  label: u.name,
                  value: u.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}><Form.Item label="Địa chỉ" name="address"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="CCCD" name="idCard"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Số điện thoại" name="phone"><Input /></Form.Item></Col>
        </Row>
      </Card>

      <div className="action-buttons" style={{ marginTop: 24, textAlign: 'right' }}>
        <Button size="large" onClick={onCancel} style={{ marginRight: 12 }}>Cancel</Button>
        <Button type="primary" size="large" htmlType="submit" loading={loading} className="bg-success">Save</Button>
      </div>
    </Form>
  );
};

export default ProductForm;