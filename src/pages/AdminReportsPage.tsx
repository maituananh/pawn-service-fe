import { Card, Col, Row, Typography, Space, List } from 'antd'
import {
  SearchOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  MobileOutlined,
  CameraOutlined,
  LaptopOutlined,
  GoldOutlined,
  CarOutlined,
  AppleOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const steps = [
  { icon: <UploadOutlined style={{ fontSize: 40 }} />, title: 'Bước 1', desc: 'Gửi thông tin tài sản' },
  { icon: <SearchOutlined style={{ fontSize: 40 }} />, title: 'Bước 2', desc: 'Nhận định giá' },
  { icon: <DollarCircleOutlined style={{ fontSize: 40 }} />, title: 'Bước 3', desc: 'Thẩm định giá & nhận tiền' },
  { icon: <CheckCircleOutlined style={{ fontSize: 40 }} />, title: 'Bước 4', desc: 'Hoàn trả & nhận lại tài sản' },
]

const assets = [
  { icon: <CarOutlined style={{ fontSize: 30 }} />, label: 'Các loại xe máy' },
  { icon: <CameraOutlined style={{ fontSize: 30 }} />, label: 'Đồ công nghệ' },
  { icon: <GoldOutlined style={{ fontSize: 30 }} />, label: 'Kim cương, đá quý' },
  { icon: <ClockCircleOutlined style={{ fontSize: 30 }} />, label: 'Đồng hồ' },
  { icon: <HomeOutlined style={{ fontSize: 30 }} />, label: 'Nhà cửa' },
  { icon: <GoldOutlined style={{ fontSize: 30 }} />, label: 'Vàng bạc' },
  { icon: <LaptopOutlined style={{ fontSize: 30 }} />, label: 'Máy tính, laptop' },
  { icon: <MobileOutlined style={{ fontSize: 30 }} />, label: 'Điện thoại' },
]

const AdminReportsPage = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: 'auto' }}>
      {/* Quy trình cầm đồ */}
      <Title level={3} style={{ color: 'red', textAlign: 'center' }}>
        Quy trình cầm đồ
      </Title>
      <Row gutter={16} justify="center">
        {steps.map((step, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card variant='borderless' style={{ textAlign: 'center' }}>
              {step.icon}
              <Title level={5}>{step.title}</Title>
              <Text>{step.desc}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tài sản được chấp nhận */}
      <Title level={3} style={{ color: 'red', marginTop: 48, textAlign: 'center' }}>
        Tài sản được chấp nhận
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {assets.map((item, index) => (
          <Col key={index} xs={12} sm={8} md={6}>
            <Card hoverable style={{ textAlign: 'center' }}>
              {item.icon}
              <Paragraph style={{ marginTop: 8 }}>{item.label}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default AdminReportsPage;
