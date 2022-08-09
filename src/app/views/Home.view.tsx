import { Col, Divider, Row, Space, Typography } from 'antd';
import useAuth from '../../core/hooks/useAuth';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import userPageTitle from '../../core/hooks/usePageTitle';
import CompanyMetrics from '../features/CompanyMetrics';
import LatestPosts from '../features/LatestPosts';

const { Title, Paragraph } = Typography;

function HomeView() {
  userPageTitle('Home');
  useBreadcrumb('Home');

  const { user } = useAuth();

  return (
    <Space direction='vertical' size={'small'} style={{ maxWidth: '100%' }}>
      <Row>
        <Col span={24}>
          <Title level={2}>{`Olá, ${user?.name}`}</Title>
          <Paragraph>Este é um resumo da empresa nos últimos 12 meses</Paragraph>
        </Col>
        <Col span={24}>
          <CompanyMetrics />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Title level={3}>Últimos posts</Title>
        </Col>
        <Col span={24}>
          <LatestPosts />
        </Col>
      </Row>
    </Space>
  );
}

export default HomeView;
