import React from 'react';
import { Form, Input, Button, Typography, Divider, Flex, Card } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, FacebookFilled } from '@ant-design/icons';
import googleIcon from '../assets/icons/google.svg';
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

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const socialLoginHandler = (handler: (() => void) | undefined) => {
    if (handler) handler();
  };

  return (
    <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card className="login-box" style={{ width: 400, padding: 20 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          {mode === 'register' && (
            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]} >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          )}
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
          </Form.Item>
          {mode === "register" && (
            <Form.Item label="Nhập lại mật khẩu" name="re-password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} >
              <Input.Password placeholder="Nhập mật khẩu" iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
            >
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </Form.Item>
          <Divider plain>Hoặc  {mode === 'login' ? 'đăng nhập' : 'đăng kí'} bằng</Divider>
          <Flex className="login-social" gap={12}>
            <Button icon={<img src={googleIcon} alt="Google" style={{ width: '1em', height: '1em', verticalAlign: 'middle', marginRight: 4, }} />} block onClick={() => socialLoginHandler(mode === "login" ? handleLoginGoogle : handleRegisterGoogle)} > Google </Button>
            <Button icon={<FacebookFilled style={{ color: '#1877F2' }} />} block onClick={() => socialLoginHandler(mode === 'login' ? handleLoginFacebook : handleRegisterFacebook)} > Facebook </Button>
          </Flex>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            {mode === "register" ? <Link onClick={() => navigate('/login')}>Quay lại trang đăng nhập</Link> : (<><Text>Bạn chưa có tài khoản?</Text>{' '}<Link onClick={() => navigate('/register')}>Đăng ký ngay</Link></>)}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserAuthForm;