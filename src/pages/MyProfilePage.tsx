import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Select,
  Upload,
  Button,
  Avatar,
  Form,
  message,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  EditOutlined,
  SaveOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { UserProfile } from '@/type/user.type';
import authApi from '@/api/authApi';
import fileApi from '@/api/filesApi';

const { Title, Text } = Typography;
const { Option } = Select;

const MyProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('https://via.placeholder.com/150');
  const [cccdImage, setCccdImage] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authApi.getProfile();
        setUserProfile(profile);
        setAvatarUrl(profile.avatarUrl || 'https://via.placeholder.com/150');
        if (profile.avatarUrl) {
          setCccdImage([
            {
              uid: '-1',
              name: 'cccd',
              url: profile.avatarUrl,
              status: 'done',
            },
          ]);
        }
        form.setFieldsValue(profile);
      } catch (error) {
        message.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const [avatarFileList, setAvatarFileList] = useState<any[]>([]);

  const handleAvatarChange = ({ fileList }: any) => {
    setAvatarFileList(fileList);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
      form.setFieldValue('avatarFile', file);
    }
  };

  const handleCccdChange = ({ fileList }: any) => setCccdImage(fileList);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      let uploadedAvatarUrl = avatarUrl;
      const avatarFile = form.getFieldValue('avatarFile');
      if (avatarFile instanceof File) {
        const res = await fileApi.upload(avatarFile);
        uploadedAvatarUrl = res.url;
      }

      let uploadedCccdUrl = userProfile?.avatarUrl || '';
      if (cccdImage.length > 0 && cccdImage[0].originFileObj) {
        const res = await fileApi.upload(cccdImage[0].originFileObj as File);
        uploadedCccdUrl = res.url;
      }

      const payload = {
        ...values,
        avatarUrl: uploadedAvatarUrl,
        cccdImageUrl: uploadedCccdUrl,
      };

      const updated = await authApi.updateProfile(payload);
      setUserProfile(updated);
      message.success('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      message.error('Vui lòng kiểm tra lại thông tin!');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );

  if (!userProfile) return <div>Không thể tải hồ sơ người dùng!</div>;

  return (
    <div className="my-profile-page" style={{ padding: 20 }}>
      <Card
        style={{
          borderRadius: 16,
          maxWidth: 900,
          margin: '0 auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Row gutter={[32, 32]} align="middle" justify="center">
          <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              fileList={avatarFileList}
              onChange={handleAvatarChange}
              disabled={!isEditing}
            >
              <Avatar
                size={100}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ cursor: isEditing ? 'pointer' : 'default' }}
              />
            </Upload>
            <div style={{ marginTop: 12 }}>
              <Title level={5} style={{ marginBottom: 0 }}>
                {userProfile.name}
              </Title>
              <Text type="secondary">{userProfile.email}</Text>
            </div>
          </Col>

          <Col xs={24} sm={16} md={18}>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              {isEditing ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={handleSave}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditToggle}
                >
                  Sửa
                </Button>
              )}
            </div>

            <Form form={form} layout="vertical" disabled={!isEditing}>
              <Row gutter={[24, 8]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                  >
                    <Input placeholder="Nhập tên" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                  >
                    <Select placeholder="Chọn giới tính">
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                      <Option value="Khác">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      {
                        pattern: /^0\d{9}$/,
                        message: 'Số điện thoại không hợp lệ (VD: 0912345678)',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="CCCD"
                    name="cccd"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số CCCD' },
                      {
                        pattern: /^\d{9,12}$/,
                        message: 'Số CCCD không hợp lệ',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập CCCD" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input placeholder="Nhập địa chỉ" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Ảnh đại diện" name="cccdImage">
                    <Upload
                      listType="picture-card"
                      fileList={cccdImage}
                      beforeUpload={() => false}
                      onChange={handleCccdChange}
                      disabled={!isEditing}
                    >
                      {cccdImage.length >= 1 ? null : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MyProfilePage;
