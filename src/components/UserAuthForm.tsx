// [UI ONLY] Redesigned UserAuthForm with premium fintech aesthetic
import React from 'react';
import { Form, Input, Button, Typography, Divider, Flex, Card, theme } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, FacebookFilled, ArrowLeftOutlined } from '@ant-design/icons';
import googleIcon from '../assets/icons/google.svg';
import logoImage from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

interface Props {
  mode: 'login' | 'register';
  onSubmit: (data) => void;
  handleLoginGoogle?: () => void;
  handleLoginFacebook?: () => void;
  handleRegisterGoogle?: () => void;
  handleRegisterFacebook?: () => void;
  isLoading: boolean;
}

const UserAuthForm: React.FC<Props> = ({ mode, onSubmit, handleLoginGoogle, handleLoginFacebook, handleRegisterGoogle, handleRegisterFacebook, isLoading }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const socialLoginHandler = (handler: (() => void) | undefined) => {
    if (handler) handler();
  };

  return (
    <div 
      className="login-page" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: token.colorBgLayout,
        padding: '24px'
      }}
    >
      <Card 
        bordered={false}
        style={{ 
          width: '100%', 
          maxWidth: 440, 
          borderRadius: 20, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <Flex vertical align="center" gap={24} style={{ marginBottom: 32 }}>
          <img src={logoImage} alt="Logo" style={{ height: 48 }} />
          <Flex vertical align="center" gap={4}>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
              {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {mode === 'login' ? 'Vui lòng đăng nhập để tiếp tục' : 'Bắt đầu hành trình cùng camdoTQ'}
            </Text>
          </Flex>
        </Flex>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
          size="large"
        >
          {mode === 'register' && (
            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]} >
              <Input placeholder="Nguyễn Văn A" style={{ borderRadius: 10 }} />
            </Form.Item>
          )}
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="username" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              placeholder="••••••••" 
              style={{ borderRadius: 10 }}
              iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} 
            />
          </Form.Item>
          {mode === "register" && (
            <Form.Item 
              label="Nhập lại mật khẩu" 
              name="re-password" 
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]} 
            >
              <Input.Password placeholder="••••••••" style={{ borderRadius: 10 }} />
            </Form.Item>
          )}
          
          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              style={{ height: 48, borderRadius: 12, fontWeight: 600, fontSize: 16 }}
            >
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký ngay'}
            </Button>
          </Form.Item>
          
          <Divider plain style={{ margin: '24px 0' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Hoặc tiếp tục bằng</Text>
          </Divider>

          <Flex gap={12}>
            <Button 
              block 
              style={{ height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifySelf: 'center' }}
              onClick={() => socialLoginHandler(mode === "login" ? handleLoginGoogle : handleRegisterGoogle)}
            > 
              <img src={googleIcon} alt="Google" style={{ width: 20, marginRight: 8 }} />
              Google
            </Button>
            <Button 
              block 
              style={{ height: 48, borderRadius: 10, color: '#1877F2', borderColor: '#1877F2', display: 'flex', alignItems: 'center' }}
              icon={<FacebookFilled />}
              onClick={() => socialLoginHandler(mode === 'login' ? handleLoginFacebook : handleRegisterFacebook)} 
            > 
              Facebook 
            </Button>
          </Flex>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            {mode === "register" ? (
              <Flex align="center" justify="center" gap={8}>
                <Text type="secondary">Đã có tài khoản?</Text>
                <Link onClick={() => navigate('/login')} style={{ fontWeight: 600 }}>Đăng nhập</Link>
              </Flex>
            ) : (
              <Flex vertical gap={8}>
                <Flex align="center" justify="center" gap={8}>
                  <Text type="secondary">Bạn chưa có tài khoản?</Text>
                  <Link onClick={() => navigate('/register')} style={{ fontWeight: 600 }}>Đăng ký ngay</Link>
                </Flex>
                <Link onClick={() => navigate('/')} style={{ fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <ArrowLeftOutlined style={{ fontSize: 11 }} /> Quay về trang chủ
                </Link>
              </Flex>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserAuthForm;