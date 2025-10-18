import { Layout } from 'antd';
import AppHeader from '../components/Header';
import AppFooter from '../components/Footer';

const { Content, Footer } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className="main-layout">
      <AppHeader />
      <Content className="main-content px-4">
        <div className="site-layout-background">{children}</div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;