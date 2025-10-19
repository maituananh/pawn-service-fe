import React from 'react';
import { Form, Input, Button, Typography, Divider, Flex } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookFilled,
} from '@ant-design/icons';
import googleIcon from '../assets/icons/google.svg';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

interface Props {
  mode: 'login' | 'register';
  onSubmit: (data: any) => void;
  handleLoginGoogle?: (data: any) => void;
  handleLoginFacebook?: (data: any) => void;
  handleRegisterGoogle?: (data: any) => void;
  handleRegisterFacebook?: (data: any) => void;
}

const UserAuthForm: React.FC<Props> = ({ mode, onSubmit, handleLoginGoogle, handleLoginFacebook, handleRegisterGoogle, handleRegisterFacebook }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <div className="login-box">
        <Title level={3} style={{ textAlign: 'center' }}>
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </Title>
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          {mode === 'register' && (
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          {mode === "register" && (
            <Form.Item
              label="Nhập lại mật khẩu"
              name="re-password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </Form.Item>
          <Divider plain>Hoặc  {mode === 'login' ? 'đăng nhập' : 'đăng kí'} bằng</Divider>
          <Flex className="login-social" gap={12}>
            <Button
              icon={
                <img
                  src={googleIcon}
                  alt="Google"
                  style={{
                    width: '1em',
                    height: '1em',
                    verticalAlign: 'middle',
                    marginRight: 4,
                  }}
                />
              }
              block
              onClick={mode === "login" ? handleLoginGoogle : handleRegisterGoogle}
            >
              Google
            </Button>
            <Button
              icon={<FacebookFilled style={{ color: '#1877F2' }} />}
              block
              onClick={mode === 'login' ? handleLoginFacebook : handleRegisterFacebook}
            >
              Facebook
            </Button>
          </Flex>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            {mode === "register" ?
              <Link onClick={() => navigate('/login')}>Quay lại trang đăng nhập</Link>
              : (
                <>
                  <Text>Bạn chưa có tài khoản?</Text>{' '}
                  <Link onClick={() => navigate('/register')}>Đăng ký ngay</Link></>
              )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserAuthForm;
