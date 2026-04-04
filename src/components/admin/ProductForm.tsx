// [UI ONLY] Redesigned ProductForm with premium fintech aesthetic
import { useCategories } from "@/hooks/useCategories";
import { useUsers } from "@/hooks/useUsers";
import { CloseOutlined, InboxOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    theme,
    Typography,
    Upload,
    UploadFile
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

const { Title, Text } = Typography;

interface ProductFormProps {
    initialData?: any;
    loading?: boolean;
    onFinish: (values: any, fileList: UploadFile[]) => Promise<void>;
    onCancel: () => void;
    isEdit?: boolean;
    readOnly?: boolean;
}

const SaveButton = ({ form, loading, fileList }: { form: any; loading: boolean; fileList: any[] }) => {
    const [submittable, setSubmittable] = useState(false);
    const values = Form.useWatch([], form);
    const { token } = theme.useToken();

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
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
            disabled={!submittable || (form as any)._readOnly}
            icon={<SaveOutlined />}
            style={{
                minWidth: 120,
                borderRadius: 8,
                background: submittable && !(form as any)._readOnly ? token.colorSuccess : undefined,
                borderColor: submittable && !(form as any)._readOnly ? token.colorSuccess : undefined
            }}
        >
            Lưu tài sản
        </Button>
    );
};

const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    loading,
    onFinish,
    onCancel,
    isEdit = false,
    readOnly = false
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { categories } = useCategories();
    const { users } = useUsers();
    const { token } = theme.useToken();
    const initialStartDate = useRef<dayjs.Dayjs | null>(null);

    const fillCustomerFields = (userId: any) => {
        if (!userId || !users) return;
        const user = users.find((u: any) => Number(u.id) === Number(userId));
        if (user) {
            form.setFieldsValue({
                address: user.address,
                phone: user.phone,
                idCard: user.cardId
            });
        }
    };

    useEffect(() => {
        if (initialData) {
            (form as any)._readOnly = readOnly;
            const formattedData = {
                ...initialData,
                startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
                endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
                customerId: initialData.customerId ?? undefined,
                categoryId: initialData.categoryId || 1,
                stockQty: initialData.stockQty ?? 1
            };

            if (initialData.startDate) {
                initialStartDate.current = dayjs(initialData.startDate);
            }

            form.setFieldsValue(formattedData);

            if (initialData.images) {
                const formattedFiles = initialData.images.map((img: any) => ({
                    uid: img.id.toString(),
                    name: img.name || `Image-${img.id}`,
                    status: "done",
                    url: img.url
                }));
                setFileList(formattedFiles);
                form.setFieldsValue({ images: formattedFiles });
            }
        }
    }, [initialData, form]);

    const handleUploadChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        form.setFieldsValue({ images: newFileList });
        form.validateFields(["images"]);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
                const payload = {
                    ...values,
                    startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
                    endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
                    stockQty: values.stockQty || 1,

                    imageIds: fileList
                        .map((f) => f.response?.id || f.uid)
                        .filter((id) => !isNaN(Number(id)))
                        .map((id) => Number(id))
                };

                console.log("PAYLOAD:", payload);

                return onFinish(payload, fileList);
            }}
            validateTrigger={["onChange", "onBlur"]}
            requiredMark="optional"
            initialValues={{ stockQty: 1 }}
        >
            <Flex vertical gap={24}>
                <Card
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: 12 }}
                    title={
                        <Flex vertical gap={4}>
                            <Title level={4} style={{ margin: 0 }}>
                                {isEdit ? "Cập nhật sản phẩm" : "Tạo hợp đồng mới"}
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Thông tin chi tiết về tài sản và điều khoản cầm cố
                            </Text>
                        </Flex>
                    }
                >
                    <Row gutter={[24, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                            >
                                <Input placeholder="Ví dụ: iPhone 15 Pro Max" disabled={readOnly} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Danh mục cụ thể"
                                name="categoryId"
                                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                            >
                                <Select
                                    placeholder="Chọn danh mục con"
                                    options={categories?.map((u: any) => ({
                                        label: u.name,
                                        value: u.id
                                    }))}
                                    disabled={readOnly}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Mã hợp đồng / Số seri"
                                name="code"
                                rules={[{ required: true, message: "Vui lòng nhập mã" }]}
                            >
                                <Input placeholder="P-XXXXXX" disabled={readOnly} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Giá trị định giá"
                                name="price"
                                rules={[{ required: true, message: "Nhập giá trị" }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    addonAfter="VNĐ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    disabled={readOnly}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Lợi nhuận mỗi ngày" name="dailyProfit" rules={[{ required: true }]}>
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    addonAfter="VNĐ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    disabled={readOnly}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Số lượng sản phẩm"
                                name="stockQty"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số lượng" },
                                    {
                                        type: "number",
                                        min: 1,
                                        message: "Số lượng phải lớn hơn 0"
                                    }
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                    placeholder="Nhập số lượng"
                                    disabled={readOnly}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={6}>
                            <Form.Item
                                label="Ngày bắt đầu"
                                name="startDate"
                                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày"
                                    disabled={readOnly}
                                    disabledDate={(current) => {
                                        if (!current) return false;
                                        const today = dayjs().startOf("day");

                                        if (!isEdit) {
                                            return current < today;
                                        }
                                        if (isEdit && initialStartDate.current) {
                                            return current < initialStartDate.current.startOf("day");
                                        }
                                        return false;
                                    }}
                                    onChange={() => form.setFieldValue("endDate", null)}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={6}>
                            <Form.Item
                                label="Ngày kết thúc (Dự kiến)"
                                name="endDate"
                                dependencies={["startDate"]}
                                rules={[
                                    { required: true, message: "Vui lòng chọn ngày kết thúc" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const start = getFieldValue("startDate");

                                            if (!value || !start) return Promise.resolve();

                                            if (value.isBefore(start, "day")) {
                                                return Promise.reject(
                                                    new Error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu")
                                                );
                                            }

                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày"
                                    disabled={readOnly}
                                    disabledDate={(current) => {
                                        if (!current) return false;

                                        const start = form.getFieldValue("startDate");
                                        const today = dayjs().startOf("day");

                                        if (!isEdit && current < today) return true;

                                        if (start && current < start.startOf("day")) return true;

                                        return false;
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item label="Mô tả hiện trạng tài sản" name="description">
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Mô tả chi tiết ngoại quan, lỗi (nếu có)..."
                                    disabled={readOnly}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Hình ảnh hiện trạng (Phải có đúng 4 ảnh)"
                                name="images"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            const currentFiles = form.getFieldValue("images") || [];
                                            if (currentFiles.length === 4) return Promise.resolve();
                                            return Promise.reject(new Error("Vui lòng chụp đúng 4 góc của sản phẩm!"));
                                        }
                                    }
                                ]}
                            >
                                <Upload.Dragger
                                    multiple
                                    listType="picture"
                                    fileList={fileList}
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                    style={{ borderRadius: 12, background: token.colorFillAlter }}
                                    disabled={readOnly}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ color: token.colorPrimary }} />
                                    </p>
                                    <p className="ant-upload-text">Kéo thả hoặc nhấn để chọn 4 ảnh thực tế</p>
                                    <p className="ant-upload-hint">Yêu cầu ảnh chụp rõ nét, không bị lóa</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: 12 }}
                    title={
                        <Flex vertical gap={4}>
                            <Title level={4} style={{ margin: 0 }}>
                                Thông tin khách hàng
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Xác thực chủ sở hữu tài sản
                            </Text>
                        </Flex>
                    }
                >
                    <Row gutter={[24, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Họ tên khách hàng" name="customerId" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm khách hàng"
                                    onChange={fillCustomerFields}
                                    optionFilterProp="label"
                                    options={users?.map((u: any) => ({
                                        label: u.name,
                                        value: u.id
                                    }))}
                                    disabled={readOnly}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Số điện thoại" name="phone">
                                <Input readOnly />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Số CCCD" name="idCard">
                                <Input readOnly />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Địa chỉ" name="address">
                                <Input readOnly />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Flex justify="flex-end" gap={12} style={{ marginBottom: 24 }}>
                    <Button
                        size="large"
                        onClick={onCancel}
                        icon={<CloseOutlined />}
                        style={{ borderRadius: 8, minWidth: 100 }}
                    >
                        Hủy bỏ
                    </Button>
                    <SaveButton form={form} loading={!!loading} fileList={fileList} />
                </Flex>
            </Flex>
        </Form>
    );
};

export default ProductForm;
