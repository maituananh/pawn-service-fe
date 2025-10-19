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

const LoginPage = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: 'auto' }}>
      Login
    </div>
  )
}

export default LoginPage
