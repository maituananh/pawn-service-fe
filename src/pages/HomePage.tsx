import { Card, Col, Row, Typography } from 'antd'

import Step1Image from '@/assets/images/step1.png';
import Step2Image from '@/assets/images/step2.png';
import Step3Image from '@/assets/images/step3.png';
import Step4Image from '@/assets/images/step4.png';
import Product1Image from '@/assets/images/bike.png';
import Product2Image from '@/assets/images/camera.png';
import Product3Image from '@/assets/images/diamond.png';
import Product4Image from '@/assets/images/watch.png';
import Product5Image from '@/assets/images/house.png';
import Product6Image from '@/assets/images/gold.png';
import Product7Image from '@/assets/images/laptop.png';
import Product8Image from '@/assets/images/phone.png';

const { Title, Paragraph, Text } = Typography

const steps = [
  { image: Step1Image, title: 'Bước 1', desc: 'Gửi thông tin tài sản' },
  { image: Step2Image, title: 'Bước 2', desc: 'Nhận định giá' },
  { image: Step3Image, title: 'Bước 3', desc: 'Thẩm định giá & nhận tiền' },
  { image: Step4Image, title: 'Bước 4', desc: 'Hoàn trả & nhận lại tài sản' },
]

const assets = [
  { image: Product1Image, label: 'Các loại xe máy' },
  { image: Product2Image, label: 'Đồ công nghệ' },
  { image: Product3Image, label: 'Kim cương, đá quý' },
  { image: Product4Image, label: 'Đồng hồ' },
  { image: Product5Image, label: 'Nhà cửa' },
  { image: Product6Image, label: 'Vàng bạc' },
  { image: Product7Image, label: 'Máy tính, laptop' },
  { image: Product8Image, label: 'Điện thoại' },
]

const HomePage = () => {
  return (
    <div className='bg-white container'>
      <Title level={4} className='text-center text-red mt-0 pb-4'>
        Quy trình cầm đồ
      </Title>
      <Row className='steps-wrapper' gutter={[50, 50]} justify="center">
        {steps.map((step, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <div className="step-item">
              <img src={step.image} alt={step.title} className="step-image" />
              <div className="step-desc">
                <Title level={5}>{step.title}</Title>
                <Text>{step.desc}</Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Title level={4} className='text-center text-red mt-9 pb-4'>
        Tài sản được chấp nhận
      </Title>
      <Row className='steps-wrapper' gutter={[16, 16]} justify="center">
        {assets.map((item, index) => (
          <Col key={index} xs={12} sm={8} md={6}>
            <Card className="step-item step-product" hoverable style={{ textAlign: 'center' }}>
              <img src={item.image} alt={item.label} className="step-image" />
              <Paragraph className='mt-2 ellipsis-1'>{item.label}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomePage
