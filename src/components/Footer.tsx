import footerImage from '../assets/images/footer.png';
import { Layout, List, Typography } from 'antd';

const { Footer } = Layout;
const { Paragraph, Text } = Typography;

const AppFooter = () => {
  return (
    <Footer className="bg-black app-footer">
      <div className="footer-content">
        <div className='footer-left'>
          <Text className='size-20 text-white'>Luôn an tâm vì tài sản được niêm phong bằng tem vỡ và bảo quản với quy trình chuyên nghiệp.</Text>
          <List
            className='mt-4'
            dataSource={[
              'Thời gian tối thiểu 3 tháng và tối đa 12 tháng',
              'Lãi suất vay trong hạn 30%/năm (2.5%/tháng với khoản vay dài hạn)',
              'Tài sản được đảm bảo an toàn 100%',
              'Thời hạn vay linh hoạt, có thể trả trước hạn - không phí phạt',
            ]}
            renderItem={(item) => (
              <List.Item>
                <Text type="success" className='size-20'>✔</Text>
                <Text className='size-20 text-white ml-2'>{item}</Text>
              </List.Item>
            )}
          />
          <Paragraph className='size-20 text-white mt-4'>
            Ví dụ: Khách cầm tài sản 10,000,000 trong 12 tháng, lãi suất vay 2.5%/tháng tương đương 250,000đ/tháng.
            Tổng nợ gốc và lãi trong 12 tháng là 13,000,000đ. Khách hàng có thể chọn trả lãi hàng tháng, không cần trả nợ gốc.
          </Paragraph>
        </div>
        <div className="footer-right">
          <img src={footerImage} alt="Footer Image" />
          <Paragraph className='text-white mt-2'>
            Niêm phong và bảo quản<br />với quy trình chuyên nghiệp
          </Paragraph>
        </div>
      </div>
    </Footer>
  )
}

export default AppFooter