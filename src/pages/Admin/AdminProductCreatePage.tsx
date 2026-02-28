import fileApi from "@/api/filesApi";
import productsApi from "@/api/productsApi";
import { useCategories } from "@/hooks/useCategories";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const AdminProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const { categories, isLoading, isError, error, refetch } = useCategories();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedType, setSelectedType] = useState<string | undefined>();

  const filteredCategories = useMemo(() => {
    if (!categories || !selectedType) return [];

    return categories.filter((item: any) => {
      return item.type === selectedType;
    });
  }, [categories, selectedType]);

  const handleBeforeUpload = () => false;
  const handleChange = ({ fileList }: any) => {
    setFileList(fileList.slice(0, 4));
  };

  const onFinish = async (values: any) => {
    const { name, price, startDate, endDate, type, quantity, description } =
      values;
    try {
      if (fileList.length !== 4) {
        message.error("Phải upload đúng 4 hình ảnh");
        return;
      }

      setLoading(true);

      const imageIds = await Promise.all(
        fileList.map(async (f) => {
          const res = await fileApi.upload(f.originFileObj as File);
          return res.id;
        }),
      );

      const payload = {
        name: values.name,
        price: Number(values.price),
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),

        categoryId: Number(values.categoryId),
        type: values.type,
        code: values.code,
        customerId: Number(values.customerId),
        dailyProfit: Number(values.dailyInterest),

        quantity: Number(values.quantity),
        description: values.description || "",
        imageIds,
      };
      await productsApi.create(payload);
      message.success("Tạo sản phẩm thành công!");
      navigate("/admin/products", { replace: true });
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      console.log("ERROR RESPONSE:", error.response?.data);
      message.error("Tạo sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card
          title={<Title level={5}>Tạo sản phẩm mới</Title>}
          className="form-card"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input placeholder="Điện thoại,..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Thể loại"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
              >
                <Select
                  placeholder="Chọn thể loại"
                  loading={isLoading}
                  options={categories.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Loại sản phẩm"
                name="type"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Chọn loại"
                  onChange={(value) => {
                    setSelectedType(value);
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
              <Form.Item label="Mã sản phẩm" name="code">
                <Input placeholder="Mã sản phẩm..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giá sản phẩm"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm" },
                  { type: "number", min: 0, message: "Giá phải ≥ 0" },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder="10.000.000 vnd"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Hình ảnh của sản phẩm" name="images">
                <Upload.Dragger
                  multiple
                  listType="picture"
                  fileList={fileList}
                  beforeUpload={handleBeforeUpload}
                  onChange={handleChange}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Tiền lời 1 ngày" name="dailyInterest">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm" },
                  { type: "number", min: 0, message: "Giá phải ≥ 0" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Ngày bắt đầu cầm"
                name="startDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                  {
                    validator(_, value) {
                      if (!value) return Promise.resolve();

                      if (value.isBefore(dayjs(), "day")) {
                        return Promise.reject(
                          new Error("Ngày bắt đầu phải >= hôm nay"),
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Ngày kết thúc cầm"
                name="endDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue("startDate");
                      if (!value || !startDate || value.isAfter(startDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Ngày kết thúc phải sau ngày bắt đầu"),
                      );
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          title={<Title level={5}>Thông tin khách hàng</Title>}
          className="form-card"
        >
          <Form.Item name="customerType" initialValue="existing">
            <Radio.Group>
              <Radio value="existing">Đã có tài khoản</Radio>
              <Radio value="new">Chưa có tài khoản</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên khách hàng"
                name="customerId"
                rules={[
                  { required: true, message: "Vui lòng chọn khách hàng" },
                ]}
              >
                <Select placeholder="Chọn khách hàng">
                  <Option value={1}>Nguyễn Văn A</Option>
                  <Option value={2}>Trần Văn B</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="12345679" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="CCCD" name="idCard">
                <Input placeholder="12345679" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="12345679" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <div className="action-buttons">
          <Button
            size="large"
            onClick={() => navigate("/admin/products", { replace: true })}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="bg-success"
            size="large"
            htmlType="submit"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminProductCreatePage;
