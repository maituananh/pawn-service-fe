import { useCategories } from "@/hooks/useCategories";
import { useUsers } from "@/hooks/useUsers";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

interface ProductFormProps {
  initialData?: any;
  loading?: boolean;
  onFinish: (values: any, fileList: UploadFile[]) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const SaveButton = ({ form, loading, fileList }: { form: any; loading: boolean; fileList: any[] }) => {
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(
        () => setSubmittable(true),
        () => setSubmittable(false)
      );
  }, [values, form, fileList]);

  return (
    <Button
      type="primary"
      size="large"
      htmlType="submit"
      loading={loading}
      disabled={!submittable}
      style={submittable ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
    >
      Save
    </Button>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  loading,
  onFinish,
  onCancel,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { categories } = useCategories();
  const { users } = useUsers();

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
        customerId: initialData.customerId || 1,
        categoryId: initialData.categoryId || 1,
      };

      form.setFieldsValue(formattedData);

      if (initialData.images) {
        const formattedFiles = initialData.images.map((img: any) => ({
          uid: img.id.toString(),
          name: img.name || `Image-${img.id}`,
          status: "done",
          url: img.url,
        }));
        setFileList(formattedFiles);
        form.setFieldsValue({ images: formattedFiles });
      }
    }
  }, [initialData, form]);

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    form.setFieldsValue({ images: newFileList });
    form.validateFields(['images']);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => onFinish(values, fileList)}
      validateTrigger={["onChange", "onBlur"]}
    >
      <Card title={<Title level={5}>{isEdit ? "Chi tiết sản phẩm" : "Tạo sản phẩm mới"}</Title>}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input placeholder="Điện thoại,..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Loại sản phẩm" name="type" rules={[{ required: true, message: "Chọn loại" }]}>
              <Select
                placeholder="Chọn loại"
                onChange={() => form.setFieldValue("categoryId", undefined)}
              >
                <Select.Option value="PHONE">Phone</Select.Option>
                <Select.Option value="LAPTOP">Laptop</Select.Option>
                <Select.Option value="MOTORBIKE">Motorbike</Select.Option>
                <Select.Option value="GOLD">Gold</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Thể loại" name="categoryId" rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}>
              <Select
                placeholder="Chọn thể loại"
                options={categories?.map((u: any) => ({ label: u.name, value: u.id }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Mã sản phẩm" name="code" rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}><Input /></Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true, message: "Nhập giá" }]}>
              <InputNumber min={0} style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Hình ảnh sản phẩm (Phải có đủ 4 ảnh)"
              name="images"
              rules={[
                {
                  validator: (_, value) => {
                    const currentFiles = form.getFieldValue('images') || [];
                    if (currentFiles.length === 4) return Promise.resolve();
                    return Promise.reject(new Error("Bạn phải chọn đúng chính xác 4 hình ảnh!"));
                  },
                },
              ]}
            >
              <Upload.Dragger
                multiple
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUploadChange}
              >
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Kéo thả hoặc nhấn để chọn 4 ảnh</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Tiền lời 1 ngày" name="dailyProfit" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Mô tả" name="description"><Input.TextArea rows={3} /></Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title={<Title level={5}>Thông tin khách hàng</Title>} style={{ marginTop: 20 }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Tên khách hàng" name="customerId" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Chọn khách hàng"
                onChange={fillCustomerFields}
                optionFilterProp="label"
                options={users?.map((u: any) => ({ label: u.name, value: u.id }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}><Form.Item label="Địa chỉ" name="address"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="CCCD" name="idCard"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Số điện thoại" name="phone"><Input /></Form.Item></Col>
        </Row>
      </Card>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button size="large" onClick={onCancel} style={{ marginRight: 12 }}>Cancel</Button>
        <SaveButton form={form} loading={!!loading} fileList={fileList} />
      </div>
    </Form>
  );
};

export default ProductForm;