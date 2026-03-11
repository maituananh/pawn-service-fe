// [UI ONLY] Redesigned HomePage with premium fintech aesthetic
import { Card, Col, Flex, Row, theme, Typography } from "antd";

import Product1Image from "@/assets/images/bike.png";
import Product2Image from "@/assets/images/camera.png";
import Product3Image from "@/assets/images/diamond.png";
import Product6Image from "@/assets/images/gold.png";
import Product5Image from "@/assets/images/house.png";
import Product7Image from "@/assets/images/laptop.png";
import Product8Image from "@/assets/images/phone.png";
import Step1Image from "@/assets/images/step1.png";
import Step2Image from "@/assets/images/step2.png";
import Step3Image from "@/assets/images/step3.png";
import Step4Image from "@/assets/images/step4.png";
import Product4Image from "@/assets/images/watch.png";

const { Title, Paragraph, Text } = Typography;

const steps = [
  { image: Step1Image, title: "Bước 1", desc: "Gửi thông tin tài sản" },
  { image: Step2Image, title: "Bước 2", desc: "Nhận định giá" },
  { image: Step3Image, title: "Bước 3", desc: "Thẩm định giá & nhận tiền" },
  { image: Step4Image, title: "Bước 4", desc: "Hoàn trả & nhận lại tài sản" },
];

const assets = [
  { image: Product1Image, label: "Các loại xe máy" },
  { image: Product2Image, label: "Đồ công nghệ" },
  { image: Product3Image, label: "Kim cương, đá quý" },
  { image: Product4Image, label: "Đồng hồ" },
  { image: Product5Image, label: "Bất động sản" },
  { image: Product6Image, label: "Vàng bạc" },
  { image: Product7Image, label: "Máy tính, laptop" },
  { image: Product8Image, label: "Điện thoại" },
];

const HomePage = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "48px 0", maxWidth: 1200, margin: "0 auto" }}>
      <Flex vertical align="center" gap={48}>
        {/* [UI ONLY] Section: Process */}
        <Flex vertical align="center" gap={32} style={{ width: "100%" }}>
          <Flex vertical align="center" gap={8}>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              Quy trình cầm đồ
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Đơn giản, minh bạch và nhanh chóng
            </Text>
          </Flex>

          <Row gutter={[32, 32]} style={{ width: "100%" }}>
            {steps.map((step, index) => (
              <Col key={index} xs={24} sm={12} md={6}>
                <Card
                  bordered={false}
                  style={{
                    textAlign: "center",
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    borderRadius: 16,
                  }}
                >
                  <Flex vertical align="center" gap={16}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: token.colorPrimaryBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 8,
                      }}
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        style={{ height: 40 }}
                      />
                    </div>
                    <Title level={5} style={{ margin: 0 }}>
                      {step.title}
                    </Title>
                    <Text type="secondary">{step.desc}</Text>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        </Flex>

        {/* [UI ONLY] Section: Accepted Assets */}
        <Flex vertical align="center" gap={32} style={{ width: "100%" }}>
          <Flex vertical align="center" gap={8}>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              Tài sản được chấp nhận
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Định giá cao, lãi suất ưu đãi cho mọi loại tài sản
            </Text>
          </Flex>

          <Row gutter={[24, 24]} style={{ width: "100%" }}>
            {assets.map((item, index) => (
              <Col key={index} xs={12} sm={8} md={6}>
                <Card
                  hoverable
                  bordered={false}
                  style={{
                    textAlign: "center",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.3s",
                  }}
                  bodyStyle={{ padding: "24px 16px" }}
                >
                  <Flex vertical align="center" gap={16}>
                    <img
                      src={item.image}
                      alt={item.label}
                      style={{ height: 64, objectFit: "contain" }}
                    />
                    <Text strong style={{ fontSize: 15 }}>
                      {item.label}
                    </Text>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        </Flex>
      </Flex>
    </div>
  );
};

export default HomePage;
