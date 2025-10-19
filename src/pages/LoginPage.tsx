import React from 'react';
import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Flex,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../assets/icons/google.svg';

const { Title, Text, Link } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Đăng nhập:', values);
  };

  const handleLoginGoogle = () => {
    console.log('Đăng nhập bằng Google');
  };

  const handleLoginFacebook = () => {
    console.log('Đăng nhập bằng Facebook');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <Title level={3} style={{ textAlign: 'center' }}>Đăng nhập</Title>

        <Form layout="vertical" onFinish={onFinish}>
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Hoặc đăng nhập bằng</Divider>

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
            onClick={handleLoginGoogle}
          >
            Google
          </Button>
          <Button
            icon={<FacebookFilled style={{ color: '#1877F2' }} />}
            block
            onClick={handleLoginFacebook}
          >
            Facebook
          </Button>
        </Flex>

        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Text>Bạn chưa có tài khoản?</Text>{' '}
          <Link onClick={() => navigate('/register')}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
