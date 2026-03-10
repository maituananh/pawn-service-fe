// [UI ONLY] Redesigned AppFooter with a professional fintech dark aesthetic
import footerImage from '../assets/images/footer.png';
import { Layout, List, Typography, Flex, theme, Card, Divider } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Footer } = Layout;
const { Paragraph, Text, Title, Link } = Typography;

const AppFooter = () => {
  const { token } = theme.useToken();
  
  return (
    <Footer 
      style={{ 
        background: '#0a0a0a', 
        padding: '64px 24px',
        color: 'rgba(255, 255, 255, 0.85)'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Flex gap={64} wrap="wrap" justify="space-between">
          {/* [UI ONLY] Left Section: Policy & Information */}
          <Flex vertical gap={32} style={{ flex: '1 1 500px' }}>
            <Flex vertical gap={12}>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>Cam kết bảo mật & An toàn</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 16 }}>
                Luôn an tâm vì tài sản được niêm phong bằng tem vỡ và bảo quản với quy trình chuyên nghiệp.
              </Text>
            </Flex>

            <List
              dataSource={[
                'Thời gian tối thiểu 3 tháng và tối đa 12 tháng',
                'Lãi suất vay trong hạn tối đa 30%/năm (chỉ 2.5%/tháng)',
                'Tài sản được đảm bảo an toàn tuyệt đối 100%',
                'Thời hạn vay linh hoạt, trả trước hạn không phí phạt',
              ]}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', padding: '8px 0' }}>
                  <Flex align="center" gap={12}>
                    <CheckCircleFilled style={{ color: token.colorSuccess, fontSize: 18 }} />
                    <Text style={{ color: '#fff', fontSize: 15 }}>{item}</Text>
                  </Flex>
                </List.Item>
              )}
            />

            <Card 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12
              }}
              styles={{ body: { padding: 20 } }}
            >
              <Title level={5} style={{ color: '#fff', marginTop: 0, marginBottom: 12 }}>Ví dụ minh họa:</Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.65)', margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                Khách cầm tài sản <Text strong style={{ color: '#fff' }}>10.000.000đ</Text> trong 12 tháng, lãi suất vay 2.5%/tháng tương đương 250.000đ/tháng.
                Tổng nợ gốc và lãi trong 12 tháng là 13.000.000đ. Khách hàng có thể chọn trả lãi hàng tháng mà không cần trả nợ gốc ngay.
              </Paragraph>
            </Card>
          </Flex>

          {/* [UI ONLY] Right Section: Visual & Branding */}
          <Flex vertical align="center" gap={32} style={{ flex: '1 1 300px' }}>
            <div style={{ 
              position: 'relative',
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(22, 119, 255, 0.1) 0%, rgba(10, 10, 10, 0) 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={footerImage} 
                alt="Footer Branding" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxWidth: 240,
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                }} 
              />
            </div>
            <Flex vertical align="center" gap={8} style={{ textAlign: 'center' }}>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>Niêm phong & Bảo quản</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.45)', maxWidth: 240 }}>
                Hệ thống lưu trữ hiện đại, bảo hiểm tài sản lên đến 100% giá trị.
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '48px 0' }} />

        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 13 }}>
            © {new Date().getFullYear()} camdo <Text strong style={{ color: 'rgba(255,255,255,0.6)' }}>Thảo Quyên</Text>. All rights reserved.
          </Text>
          <Flex gap={24}>
            <Link style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 13 }}>Điều khoản sử dụng</Link>
            <Link style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 13 }}>Chính sách bảo mật</Link>
            <Link style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 13 }}>Liên hệ</Link>
          </Flex>
        </Flex>
      </div>
    </Footer>
  )
}

export default AppFooter